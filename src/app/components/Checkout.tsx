"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function Checkout({ cart, total }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Process payment and complete order
      console.log("Order completed:", formData)
      // Here you would typically send the order data to your backend
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Checkout</h2>
      <div className="mb-8 flex justify-between">
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
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Payment Information</h3>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <div className="flex space-x-4">
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-1/2 p-2 mb-4 border rounded"
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleInputChange}
                className="w-1/2 p-2 mb-4 border rounded"
                required
              />
            </div>
          </div>
        )}
        <div className="mt-8">
          <h4 className="text-xl font-bold mb-4">Order Summary</h4>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-white py-2 px-4 rounded mt-8 hover:bg-accent/90 transition-colors"
        >
          {step < 3 ? "Continue" : "Place Order"}
        </button>
      </form>
    </div>
  )
}
