"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "Unknown"
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
          <p className="text-lg font-semibold">{orderId}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link href="/my-orders" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Track Your Order
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button className="flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>A confirmation email has been sent to your email address.</p>
          <p>You will be redirected to the home page in {countdown} seconds...</p>
        </div>
      </motion.div>
    </div>
  )
}
