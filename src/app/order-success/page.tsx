"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, MapPin, CreditCard, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/src/lib/auth"
import { getSupabaseClient } from "@/src/lib/supabaseClient"

interface OrderDetails {
  id: string
  status: string
  shipping_address: string
  total_amount: number
  payment_method: string
  items: Array<{
    name: string
    quantity: number
    size: string
    price: number
    image?: string
  }>
  created_at: string
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  
  const orderId = searchParams.get("orderId")
  const isPaid = searchParams.get("paid") === "true"
  const method = searchParams.get("method") || "razorpay"

  useEffect(() => {
    if (isLoading) return
    if (!orderId) {
      setFetchError("No order ID provided")
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const client = getSupabaseClient()
        const { data: { session } } = await client.auth.getSession()
        
        const headers: Record<string, string> = {}
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        const res = await fetch(`/api/get-order?orderId=${orderId}`, { headers })
        const data = await res.json()

        if (!res.ok || !data.order) {
          setFetchError("Order may still be processing. Please check your orders page.")
        } else {
          setOrder(data.order)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setFetchError("Could not load order details.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, isLoading])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white/50 text-sm uppercase tracking-widest">Loading your order...</p>
      </div>
    )
  }

  let shippingAddress: any = {}
  try {
    shippingAddress = order?.shipping_address
      ? (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address)
      : {}
  } catch { /* ignore */ }

  const displayId = orderId ? orderId.slice(-8).toUpperCase() : "—"

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        
        {/* Success Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative h-24 w-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-serif text-white mb-2">
            {(isPaid || method === "razorpay") ? "Payment Confirmed!" : "Order Placed!"}
          </h1>
          <p className="text-zinc-400 mb-4">
            {isPaid ? "Your payment was successful and your order is being processed." : "Your COD order has been placed successfully."}
          </p>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Order</span>
            <span className="text-sm font-mono font-bold text-white">#{displayId}</span>
          </div>
        </motion.div>

        {/* Status Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-2 mb-8"
        >
          {["Confirmed", "Processing", "Shipped"].map((step, i) => (
            <div key={i} className={`text-center p-4 rounded-2xl border ${i === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.03] border-white/5'}`}>
              <div className={`text-xs uppercase tracking-widest font-bold ${i === 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                {step}
              </div>
            </div>
          ))}
        </motion.div>

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
            {/* Items */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Items Ordered</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    {item.image && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.size}ml × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-mono font-semibold text-white shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
                  <span>Total Paid</span>
                  <span className="font-mono">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Delivery + Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shippingAddress?.address && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-zinc-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Delivering To</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{shippingAddress.name}</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}
                  </p>
                </div>
              )}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment</span>
                </div>
                <p className="text-sm font-semibold text-white capitalize">
                  {order.payment_method === 'razorpay' ? 'Paid Online ✓' : 'Cash on Delivery'}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {fetchError && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center mt-4">
            <p className="text-amber-300 text-sm">{fetchError}</p>
          </div>
        )}

        {/* Guest Registration Prompt */}
        {!isAuthenticated && shippingAddress?.email && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center"
          >
            <h3 className="text-base font-semibold mb-1">Save your details for next time?</h3>
            <p className="text-sm text-zinc-500 mb-4">Create a free account and checkout 3x faster.</p>
            <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full" asChild>
              <Link href={`/auth/register?email=${encodeURIComponent(shippingAddress.email || '')}&name=${encodeURIComponent(shippingAddress.name || '')}&phone=${encodeURIComponent(shippingAddress.phone || '')}`}>
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          {isAuthenticated ? (
            <Button
              className="flex-1 bg-white text-black hover:bg-zinc-100 h-12 rounded-xl font-semibold"
              onClick={() => router.push('/profile')}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Button>
          ) : (
            <Button className="flex-1 bg-white text-black hover:bg-zinc-100 h-12 rounded-xl font-semibold" asChild>
              <Link href="/collection">Continue Shopping</Link>
            </Button>
          )}
          <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/5 h-12 rounded-xl" asChild>
            <Link href="/collection">Shop More</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
