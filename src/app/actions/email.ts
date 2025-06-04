"use server"

interface OrderItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size: string
}

interface OrderDetails {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  orderDate: string
}

export async function sendOrderConfirmationEmail(orderDetails: OrderDetails) {
  try {
    // TEMPORARILY DISABLED: Email sending functionality
    console.log("Email sending disabled for preview. Would have sent email with:", orderDetails)

    // Just return success without actually sending emails
    return { success: true }
  } catch (error) {
    console.error("Error in email function:", error)
    return { success: false, error: error.message }
  }
}
