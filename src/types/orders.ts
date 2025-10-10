export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  image: string;
}

export interface ShippingAddress {
  [x: string]: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  id?: string;
  user_id?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  payment_method: 'razorpay';
  razorpay_order_id?: string;
  created_at?: string;
}

export interface Transaction {
  id?: string;
  order_id: string;
  payment_id: string;
  amount: number;
  status: 'success' | 'failed';
  created_at?: string;
}

export interface RazorpayOrderResponse {
  [x: string]: any;
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayVerificationResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResult {
  success?: boolean;
  orderId: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayVerificationResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}