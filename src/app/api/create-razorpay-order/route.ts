import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/src/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        // Get authorization token from header
        const headersList = headers();
        const authorization = (await headersList).get('authorization');

        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseToken = authorization.split(' ')[1];

        // Create authenticated Supabase client
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

        // Get authenticated user
        const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { items, total, shipping_address, payment_method } = await request.json();

        // Validate required fields
        if (!items?.length || !total || !shipping_address || payment_method !== 'razorpay') {
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

        // Get products from database to verify prices
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price_30ml, price_50ml, stock_30ml, stock_50ml')
            .in(
                'id',
                items.map((item: any) => item.product_id)
            );

        if (productsError || !products?.length) {
            return NextResponse.json(
                { error: 'Failed to verify products' },
                { status: 400 }
            );
        }

        // Verify stock and calculate total
        let calculatedTotal = 0;
        for (const item of items) {
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

            calculatedTotal += price * item.quantity;
        }

        // Verify total amount
        if (calculatedTotal !== total) {
            return NextResponse.json(
                { error: 'Order total mismatch' },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: total * 100, // Convert to paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                user_id: user.id,
            },
        });

        // Start a database transaction
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: user.id,
                    items: items,
                    total_amount: total,
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
        });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}