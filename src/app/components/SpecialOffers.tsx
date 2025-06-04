"use client"

import { motion } from "framer-motion"
import { Gift, Truck, Clock, Tag } from "lucide-react"

export default function SpecialOffers() {
  const offers = [
    {
      title: "Buy 2 Get 1 Free",
      description: "On selected fragrances",
      icon: Gift,
      color: "bg-pink-100 dark:bg-pink-900/20",
      textColor: "text-pink-800 dark:text-pink-300",
      iconColor: "text-pink-500",
    },
    {
      title: "Free Shipping",
      description: "On orders above ₹1000",
      icon: Truck,
      color: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-800 dark:text-blue-300",
      iconColor: "text-blue-500",
    },
    {
      title: "Limited Time Offer",
      description: "15% off on all 50ml bottles",
      icon: Clock,
      color: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-800 dark:text-amber-300",
      iconColor: "text-amber-500",
    },
    {
      title: "Student Discount",
      description: "Extra 10% off with valid ID",
      icon: Tag,
      color: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-800 dark:text-green-300",
      iconColor: "text-green-500",
    },
  ]

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-serif">Special Offers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${offer.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start">
                <div className="mr-4">
                  <offer.icon className={`h-8 w-8 ${offer.iconColor}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg mb-1 ${offer.textColor}`}>{offer.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{offer.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            *Offers cannot be combined. Terms and conditions apply.
          </p>
        </div>
      </div>
    </section>
  )
}
