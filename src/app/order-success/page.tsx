"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/src/lib/supabaseClient"
import { CheckCircle2, Loader2, PackageSearch } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/src/lib/auth"

interface OrderDetails {
  id: string
  status: string
  shipping_address: string
  total_amount: number
  items: Array<{
    name: string
    quantity: number
    size: string
    price: number
    image: string
  }>
  created_at: string
}

export default function OrderSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const orderId = searchParams.get("orderId")

  // Protected route - redirect if not authenticated
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      // Wait for authentication to complete
      if (isLoading) return;
      
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      if (!orderId) {
        toast({
          title: "Error",
          description: "Order ID not found",
          variant: "destructive",
        })
        setLoading(false);
        return
      }

      try {
        // Fetch order with security check - ensure user can only access their own orders
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id) // Security: Only allow access to user's own orders
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned - order not found or user doesn't have access
            toast({
              title: "Access Denied",
              description: "You don't have permission to view this order",
              variant: "destructive",
            });
            router.push('/my-orders');
          } else {
            throw error;
          }
          return;
        }

        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, toast, user, isAuthenticated, isLoading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium">Loading order details...</h2>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <PackageSearch className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">We couldn't find the order you're looking for.</p>
          <Button asChild>
            <Link href="/collection">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const shippingAddress = JSON.parse(order.shipping_address)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-400">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date</span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.size}ml × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{shippingAddress.name}</p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.pincode}
                </p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="w-full" asChild>
                <Link href="/my-orders">View Orders</Link>
              </Button>
              <Button className="w-full" variant="secondary" asChild>
                <Link href="/collection">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
