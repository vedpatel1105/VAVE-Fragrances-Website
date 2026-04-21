/**
 * Service to handle external notifications (e.g., Email via FormSubmit.co)
 */

export interface OrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: string; // Formatting as a string for email clarity
  totalAmount: number;
  paymentMethod: 'Razorpay' | 'WhatsApp (COD)';
  shippingAddress: string;
}

const FORMSUBMIT_EMAIL = 'vavefragrances@gmail.com';

export const notificationService = {
  /**
   * Sends an order notification email using FormSubmit.co AJAX API
   */
  async sendOrderNotification(data: OrderNotificationData) {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `📦 New Order Placed: #${data.orderId || 'N/A'}`,
          "Order ID": data.orderId || 'N/A',
          "Customer": data.customerName,
          "Email": data.customerEmail,
          "Phone": data.customerPhone,
          "Items": data.items,
          "Total": `₹${data.totalAmount}`,
          "Payment Method": data.paymentMethod,
          "Shipping Address": data.shippingAddress,
          "_template": "table" // Uses FormSubmit's table template for better readability
        })
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Notification Service Error:', error);
      return false;
    }
  }
}
