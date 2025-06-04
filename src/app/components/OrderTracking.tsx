"use client"
import { motion } from "framer-motion"

const steps = [
  { id: 1, name: "Order Placed", description: "Your order has been received and is being processed." },
  { id: 2, name: "Processing", description: "We are preparing your order for shipment." },
  { id: 3, name: "Shipped", description: "Your order has been shipped and is on its way to you." },
  { id: 4, name: "Delivered", description: "Your order has been delivered. Enjoy your new fragrance!" },
]

export default function OrderTracking({ orderId = "12345", currentStep = 2 }) {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Order Tracking</h2>
      <p className="text-center mb-8">Order ID: {orderId}</p>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center mb-8 last:mb-0">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.id <= currentStep ? "bg-accent text-white" : "bg-gray-200 text-gray-600"
              }`}
              animate={{ scale: step.id === currentStep ? 1.2 : 1 }}
            >
              {step.id}
            </motion.div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{step.name}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
            {index < steps.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  )
}
