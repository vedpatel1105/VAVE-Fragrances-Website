import { getSupabaseClient } from './supabaseClient';
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
        return 'Invalid email format';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(address.phone)) {
        return 'Invalid phone number format';
    }

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
        const client = getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

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

        const response = await fetch('/api/create-payment-order', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                items: order.items,
                total: order.total,
                shipping_address: order.shipping_address,
                payment_method: order.payment_method,
                coupon_code: (order as any).coupon_code,
                discount: (order as any).discount
            }),
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response received from API:', text.slice(0, 200));
            throw new Error(`Server returned HTML instead of JSON (${response.status} ${response.statusText}). This usually means an API error occurred.`);
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create Razorpay order');
        }

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
                    const client = getSupabaseClient();
                    const { data: { session } } = await client.auth.getSession();
                    
                    const verificationHeaders: Record<string, string> = {
                        'Content-Type': 'application/json',
                    };

                    if (session?.access_token) {
                        verificationHeaders['Authorization'] = `Bearer ${session.access_token}`;
                    }

                    const verificationResponse = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: verificationHeaders,
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const contentType = verificationResponse.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        const text = await verificationResponse.text();
                        console.error('Non-JSON response received from verify API:', text.slice(0, 200));
                        throw new Error(`Server returned HTML instead of JSON (${verificationResponse.status}). Payment might have gone through, please check your orders page.`);
                    }

                    const verificationData = await verificationResponse.json();

                    if (!verificationResponse.ok) {
                        throw new Error(verificationData.error || 'Payment verification failed');
                    }

                    onSuccess(verificationData as PaymentVerificationResult);
                } catch (error) {
                    console.error('Payment verification error:', error);
                    onError(error instanceof Error ? error : new Error('Payment verification failed'));
                }
            },
            theme: {
                color: '#000000'
            },
            modal: {
                ondismiss: () => {
                    console.log('Razorpay modal dismissed by user');
                    onError(new Error('Payment cancelled by user'));
                }
            }
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
        const client = getSupabaseClient();
        const { data: order, error } = await client
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
        const client = getSupabaseClient();
        const { error } = await client
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
        const client = getSupabaseClient();
        const { error } = await client
            .from('transactions')
            .insert([transactionData]);

        if (error) throw error;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
}