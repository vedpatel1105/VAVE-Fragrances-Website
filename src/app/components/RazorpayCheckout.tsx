"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { loadScript } from "@/lib/utils"

interface RazorpayCheckoutProps {
  amount: number
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  onSuccess: (paymentId: string, orderId: string, signature: string) => void
  onFailure: (error: any) => void
}

export default function RazorpayCheckout({
  amount,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadRazorpayScript = async () => {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
      if (!res) {
        setError("Razorpay SDK failed to load. Please check your internet connection.")
        return
      }
      setIsScriptLoaded(true)
    }

    loadRazorpayScript()
  }, [])

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      setError("Payment gateway is still loading. Please try again.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Vave Fragrances",
        description: "Purchase of premium fragrances",
        order_id: orderId,
        image: "/logo.png",
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          address: "Vave Fragrances Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        handler: (response: any) => {
          // Handle successful payment
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature)
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (err) {
      console.error("Payment error:", err)
      setError("Something went wrong with the payment. Please try again.")
      onFailure(err)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={isLoading || !isScriptLoaded}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.2 4h15.6c1.2 0 2.2 1 2.2 2.2v11.6c0 1.2-1 2.2-2.2 2.2H4.2C3 20 2 19 2 17.8V6.2C2 5 3 4 4.2 4z" />
              <path d="M9 12a3 3 0 100-6 3 3 0 000 6z" fill="white" />
              <path d="M19 6l-3 5-3-2.5-4 6.5h13L19 6z" fill="white" />
            </svg>
            Pay Securely with Razorpay
          </span>
        )}
      </Button>
    </div>
  )
}
