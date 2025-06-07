"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, Wallet, AlertCircle } from "lucide-react"
import Image from "next/image"
import { sendOrderConfirmationEmail } from "@/src/app/actions/email"
import { useUser } from "@/src/contexts/UserContext"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size: string
}

export default function Checkout() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const { user } = useUser()

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    } else {
      // Redirect to home if cart is empty
      router.push("/")
    }

    // Pre-fill form with user data if available
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))

      // If user has a default address, pre-fill that too
      const defaultAddress = user.addresses?.find((addr) => addr.isDefault)
      if (defaultAddress) {
        setFormData((prev) => ({
          ...prev,
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
        }))
      }
    }
  }, [router, user])

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateShipping = () => {
    // Free shipping for orders over Rs. 1000
    return calculateTotal() > 1000 ? 0 : 100
  }

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateShipping()
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Process payment based on selected method
    setIsProcessing(true)
    setError("")

    try {
      let paymentSuccess = false

      if (formData.paymentMethod === "card") {
        paymentSuccess = await processCardPayment() as boolean
      } else if (formData.paymentMethod === "cod") {
        paymentSuccess = await processCashOnDelivery() as boolean
      } else if (formData.paymentMethod === "upi") {
        paymentSuccess = await processUpiPayment() as boolean
      }

      if (paymentSuccess) {
        // Generate a unique order ID
        const orderId = `ORD${Date.now().toString().slice(-8)}`

        // Send order confirmation email (disabled for preview)
        await sendOrderConfirmationEmail({
          orderId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          items: cart,
          subtotal: calculateTotal(),
          shipping: calculateShipping(),
          total: calculateGrandTotal(),
          paymentMethod: formData.paymentMethod,
          orderDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        })

        // Save order to user's order history if logged in
        if (user) {
          const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
          orderHistory.push({
            id: orderId,
            date: new Date().toISOString(),
            items: cart,
            total: calculateGrandTotal(),
            status: "Processing",
            trackingNumber: `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          })
          localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
        }

        // Clear cart and redirect to success page
        localStorage.removeItem("cart")
        router.push(`/order-success?orderId=${orderId}`)
      } else {
        setError("Payment failed. Please try again.")
        setIsProcessing(false)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("An error occurred during checkout. Please try again.")
      setIsProcessing(false)
    }
  }

  const processCardPayment = async () => {
    // Simulate payment gateway integration
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would integrate with Razorpay, Stripe, etc.
        resolve(true)
      }, 2000)
    })
  }

  const processCashOnDelivery = async () => {
    // Simulate COD processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)
    })
  }

  const processUpiPayment = async () => {
    // Simulate UPI payment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1500)
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="mb-8 flex justify-between max-w-md mx-auto">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i <= step ? "bg-accent text-white" : "bg-gray-200 text-gray-600"
            }`}
            animate={{ scale: i === step ? 1.2 : 1 }}
          >
            {i}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">PIN Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>

                <RadioGroup
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Credit/Debit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center cursor-pointer">
                      <Wallet className="mr-2 h-5 w-5" />
                      UPI Payment
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer">
                      <Truck className="mr-2 h-5 w-5" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "upi" && (
                  <div className="mt-6">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      name="upiId"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {formData.paymentMethod === "cod" && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Cash on Delivery is available for orders under Rs. 5000. A nominal fee of Rs. 50 will be added to
                      your order.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={isProcessing}>
                  Back
                </Button>
              )}
              <Button type="submit" className="ml-auto" disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : step < 3 ? (
                  "Continue"
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4">
                  <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">Rs. {calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">{calculateShipping() === 0 ? "Free" : `Rs. ${calculateShipping()}`}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">Rs. {calculateGrandTotal()}</span>
              </div>
            </div>

            {/* Promotional offers */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Available Offers</h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                <li>• 10% off on your first order</li>
                <li>• Free shipping on orders above Rs. 1000</li>
                <li>• Get a free sample with every purchase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
