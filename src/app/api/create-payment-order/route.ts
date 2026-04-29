import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import { getSupabaseClient } from '@/src/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Guard: ensure Razorpay keys are configured
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: 'Payment gateway is not configured. Please contact support.' },
                { status: 503 }
            );
        }

        // Initialise Razorpay inside handler so missing keys never crash the module
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Get authorization token from header
        const headersList = headers();
        const authorization = (await headersList).get('authorization');

        let user: any = null;
        let supabaseClient = getSupabaseClient(); // Use public client by default

        if (authorization?.startsWith('Bearer ')) {
            const supabaseToken = authorization.split(' ')[1];
            const supabaseAuth = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${supabaseToken}`,
                        },
                    },
                }
            );

            const { data: { user: authUser }, error: userError } = await supabaseAuth.auth.getUser();
            if (!userError && authUser) {
                user = authUser;
                supabaseClient = supabaseAuth;
            }
        }

        const { items, total, shipping_address, payment_method, coupon_code, discount } = await request.json();

        // Validate required fields
        if (!items?.length || total === undefined || !shipping_address || payment_method !== 'razorpay') {
            return NextResponse.json(
                { error: 'Invalid order data' },
                { status: 400 }
            );
        }

        // Parse shipping address if it's a string
        const parsedAddress = typeof shipping_address === 'string'
            ? JSON.parse(shipping_address)
            : shipping_address;

        // Validate shipping address
        const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
        for (const field of requiredFields) {
            if (!parsedAddress[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Get products from database to verify prices (exclude demo product)
        const dbProductIds = items
            .map((item: any) => item.product_id)
            .filter((id: string) => id !== 'demo-product-10');

        let products: any[] = [];
        if (dbProductIds.length > 0) {
            const { data, error: productsError } = await supabaseClient
                .from('products')
                .select('id, price_30ml, price_50ml, stock_30ml, stock_50ml')
                .in('id', dbProductIds);

            if (productsError) {
                return NextResponse.json(
                    { error: 'Failed to verify products from database' },
                    { status: 400 }
                );
            }
            products = data || [];
        }

        if (dbProductIds.length > 0 && products.length !== dbProductIds.length) {
            return NextResponse.json(
                { error: 'Failed to verify all products' },
                { status: 400 }
            );
        }

        // Verify stock and calculate subtotal from trusted DB prices
        let calculatedSubtotal = 0;
        for (const item of items) {
            // Bypass verification for demo product
            if (item.product_id === 'demo-product-10') {
                if (item.price !== 10) {
                    return NextResponse.json(
                        { error: `Price mismatch for demo product` },
                        { status: 400 }
                    );
                }
                calculatedSubtotal += 10 * item.quantity;
                continue;
            }

            const product = products.find(p => p.id === item.product_id);
            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.product_id}` },
                    { status: 400 }
                );
            }

            // Verify stock
            const stock = item.size === '30' ? product.stock_30ml : product.stock_50ml;
            if (stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for product: ${item.name}` },
                    { status: 400 }
                );
            }

            // Verify price and add to total
            const price = item.size === '30' ? product.price_30ml : product.price_50ml;
            if (price !== item.price) {
                return NextResponse.json(
                    { error: `Price mismatch for product: ${item.name}` },
                    { status: 400 }
                );
            }

            calculatedSubtotal += price * item.quantity;
        }

        // Handle Coupon/Discount validation
        let serverCalculatedDiscount = 0;
        if (coupon_code) {
            const { data: coupon, error: couponError } = await supabaseClient
                .from('coupons')
                .select('*')
                .eq('code', coupon_code.toUpperCase())
                .eq('is_active', true)
                .single();

            if (!couponError && coupon) {
                // Check expiry
                const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < new Date();
                const isMinAmountMet = !coupon.min_amount || calculatedSubtotal >= coupon.min_amount;

                if (!isExpired && isMinAmountMet) {
                    // Check applies_to
                    let applicableSubtotal = calculatedSubtotal;
                    if (coupon.applies_to && coupon.applies_to.length > 0) {
                        applicableSubtotal = items
                            .filter((item: any) => coupon.applies_to.includes(item.product_id?.toString()))
                            .reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                    }

                    if (applicableSubtotal > 0) {
                        if (coupon.type === 'percentage') {
                            serverCalculatedDiscount = Math.round((applicableSubtotal * coupon.value) / 100);
                            if (coupon.max_discount) {
                                serverCalculatedDiscount = Math.min(serverCalculatedDiscount, coupon.max_discount);
                            }
                        } else {
                            serverCalculatedDiscount = Math.min(coupon.value, applicableSubtotal);
                        }
                    }
                }
            }

            // Verify provided discount matches server calculated discount
            if (discount !== undefined && discount !== serverCalculatedDiscount) {
                return NextResponse.json(
                    { error: 'Discount amount mismatch' },
                    { status: 400 }
                );
            }
        }

        // Compute shipping charge: ₹30 for orders below ₹1000
        const shippingCharge = calculatedSubtotal < 1000 ? 30 : 0;
        const computedOrderTotal = Math.max(0, calculatedSubtotal + shippingCharge - serverCalculatedDiscount);

        // Validate client provided total matches server computed total
        // We use Math.abs comparison for floating point safety if needed, but here it's integers mostly
        if (typeof total !== 'number' || Math.abs(total - computedOrderTotal) > 1) {
            return NextResponse.json(
                { error: `Order total mismatch. Expected ${computedOrderTotal}, got ${total}` },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(computedOrderTotal * 100), // Convert to paise and ensure integer
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                user_id: user?.id || 'guest',
                shipping_inr: String(shippingCharge),
                discount_inr: String(serverCalculatedDiscount),
                coupon_code: coupon_code || 'none'
            },
        });

        // Start a database transaction
        const { data: newOrder, error: orderError } = await supabaseClient
            .from('orders')
            .insert([
                {
                    user_id: user?.id || null,
                    items: items,
                    total_amount: computedOrderTotal,
                    subtotal_amount: calculatedSubtotal,
                    shipping_amount: shippingCharge,
                    discount_amount: serverCalculatedDiscount,
                    coupon_code: coupon_code || null,
                    shipping_address: JSON.stringify(parsedAddress),
                    payment_method: 'razorpay',
                    status: 'pending',
                    razorpay_order_id: razorpayOrder.id,
                },
            ])
            .select()
            .single();

        if (orderError || !newOrder) {
            console.error('Order insertion error:', orderError);
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        // Return order details
        return NextResponse.json({
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderId: newOrder.id,
            // Prefill hints for checkout UX only
            customerName: parsedAddress.name,
            customerEmail: parsedAddress.email,
            customerPhone: parsedAddress.phone,
        });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}