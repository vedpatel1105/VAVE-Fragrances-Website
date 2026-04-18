import { supabase } from './supabaseClient';
import type {
    Order,
    ShippingAddress,
    Transaction,
    RazorpayOrderResponse,
    RazorpayOptions,
    RazorpayVerificationResponse,
    PaymentVerificationResult
} from '@/src/types/orders';

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
    }
}

export const loadRazorpayScript = async (): Promise<void> => {
    return new Promise((resolve) => {
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

export const validateShippingAddress = (address: ShippingAddress): string | null => {
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    
    for (const field of requiredFields) {
        if (!address[field as keyof ShippingAddress]) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
        return 'Invalid email format';
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(address.phone)) {
        return 'Invalid phone number format';
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(address.pincode)) {
        return 'Invalid pincode format';
    }

    return null;
};

export const createRazorpayOrder = async (order: {
    items: Order['items'];
    total: number;
    shipping_address: ShippingAddress;
    payment_method: 'razorpay';
}): Promise<RazorpayOrderResponse> => {
    try {
        // Get the current session if available
        const { data: { session } } = await supabase.auth.getSession();
        
        // Pass the token only if it exists
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        // Validate input
        if (!order.items?.length) {
            throw new Error('Order must contain items');
        }

        if (!order.total || order.total <= 0) {
            throw new Error('Invalid order amount');
        }

        const addressError = validateShippingAddress(order.shipping_address);
        if (addressError) {
            throw new Error(addressError);
        }

        // Create order
        const response = await fetch('/api/create-razorpay-order', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                items: order.items,
                total: order.total,
                shipping_address: order.shipping_address,
                payment_method: order.payment_method
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create Razorpay order');
        }

        const data = await response.json();
        return data as RazorpayOrderResponse;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
};

export const initializeRazorpayCheckout = async (
    orderData: RazorpayOrderResponse,
    shippingAddress: ShippingAddress,
    onSuccess: (result: PaymentVerificationResult) => void,
    onError: (error: Error) => void
): Promise<void> => {
    try {
        await loadRazorpayScript();

        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            throw new Error('Razorpay key is not configured');
        }

        const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: 'INR',
            name: 'Vave Fragrances',
            description: 'Fragrance Purchase',
            order_id: orderData.id,
            prefill: {
                name: orderData.customerName,
                email: orderData.customerEmail,
                contact: orderData.customerPhone,
            },
            handler: async (response: RazorpayVerificationResponse) => {
                try {
                    // Get the current session if available
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    const verificationHeaders: Record<string, string> = {
                        'Content-Type': 'application/json',
                    };

                    if (session?.access_token) {
                        verificationHeaders['Authorization'] = `Bearer ${session.access_token}`;
                    }

                    // Verify payment with backend
                    const verificationResponse = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: verificationHeaders,
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    if (!verificationResponse.ok) {
                        const errorData = await verificationResponse.json();
                        throw new Error(errorData.error || 'Payment verification failed');
                    }

                    const verificationData = await verificationResponse.json();
                    onSuccess(verificationData as PaymentVerificationResult);
                } catch (error) {
                    console.error('Payment verification error:', error);
                    onError(error instanceof Error ? error : new Error('Payment verification failed'));
                }
            },
            theme: {
                color: '#000000'
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error('Error initializing Razorpay checkout:', error);
        onError(error instanceof Error ? error : new Error('Razorpay initialization failed'));
    }
};

export const createOrder = async (orderData: Order) => {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (error) throw error;
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const updateOrderStatus = async (
    orderId: string,
    status: 'paid' | 'failed'
) => {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const createTransaction = async (transactionData: Transaction) => {
    try {
        const { error } = await supabase
            .from('transactions')
            .insert([transactionData]);

        if (error) throw error;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
}