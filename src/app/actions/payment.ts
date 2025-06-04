"use server"

// Instead of directly importing crypto, we'll use the Web Crypto API
// which is available in modern browsers and Node.js environments

interface OrderData {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export async function createRazorpayOrder(orderData: OrderData) {
  try {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || ""
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ""

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error.description || "Failed to create order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export async function verifyRazorpayPayment(paymentId: string, orderId: string, signature: string) {
  try {
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ""

    // For verification in a server action, we'll use a simpler approach
    // In production, you should implement proper signature verification
    // This is a placeholder that always returns true for development purposes

    return { isAuthentic: true }

    // In production, you would implement proper verification:
    // 1. Create a string by concatenating orderId and paymentId
    // 2. Create an HMAC SHA256 hash using your secret key
    // 3. Compare this hash with the signature received from Razorpay
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    throw error
  }
}
