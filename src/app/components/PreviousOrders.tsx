"use client"

import { useState } from "react"
import Link from "next/link"

const mockOrders = [
  { id: "12345", date: "2023-05-01", total: 89.99, status: "Delivered" },
  { id: "12346", date: "2023-05-15", total: 199.98, status: "Shipped" },
  { id: "12347", date: "2023-05-30", total: 129.99, status: "Processing" },
]

export default function PreviousOrders() {
  const [orders, setOrders] = useState(mockOrders)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Previous Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.date}</td>
                <td className="p-2">${order.total.toFixed(2)}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  <Link href={`/order-tracking/${order.id}`} className="text-accent hover:underline">
                    Track Order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
