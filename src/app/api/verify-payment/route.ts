import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Check for Razorpay configuration
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment verification service is not configured.' },
        { status: 503 }
      );
    }

    // Initialize Razorpay inside handler to avoid module-level crashes
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    
    let user: any = null;
    let supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const authenticatedClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );

      const { data: { user: authUser }, error: authError } = await authenticatedClient.auth.getUser();
      if (!authError && authUser) {
        user = authUser;
        supabaseClient = authenticatedClient;
      }
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    console.log(`[verify-payment] Initiating verification for order: ${razorpay_order_id}`);

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('[verify-payment] Invalid signature detected');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    console.log('[verify-payment] Signature verified. Looking up order in DB...');

    // Verification is done using the Razorpay order ID which was shared between client and server
    // We also check against user_id if authenticated, or null for guests

    // Get the order from database
    // NOTE: Supabase JS v2 query builder returns NEW objects on each chain call,
    // so we must build the full chain before calling .single()
    let orderQuery = supabaseClient
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id);

    if (user) {
      orderQuery = orderQuery.eq('user_id', user.id);
    }
    // For guest orders, we skip the user_id filter entirely so the lookup
    // succeeds regardless of whether user_id is null or not set

    const { data: order, error: orderError } = await orderQuery.single();

    if (orderError || !order) {
      console.error('[verify-payment] Order lookup failed:', orderError || 'Order not found');
      // If order not found by user_id filter, try finding it without user_id filter just to be sure 
      // (in case session changed)
      const { data: globalOrder } = await supabaseClient
        .from('orders')
        .select('id, user_id, status')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();
      
      if (globalOrder) {
        console.warn(`[verify-payment] Order found but restricted. Global status: ${globalOrder.status}`);
      }

      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    console.log(`[verify-payment] Order found: ${order.id}. Current status: ${order.status}`);

    // If order is already paid, return success (idempotency)
    if (order.status === 'paid') {
      console.log(`[verify-payment] Order ${order.id} already marked as paid. Returning success.`);
      return NextResponse.json({
        success: true,
        orderId: order.id,
      });
    }

    // Update order status
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', order.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert([
        {
          order_id: order.id,
          payment_id: razorpay_payment_id,
          amount: order.total_amount,
          status: 'success',
        },
      ]);

    if (transactionError) throw transactionError;

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}