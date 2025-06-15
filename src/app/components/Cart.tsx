"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, CreditCard, Wallet, ShoppingBag, Loader2, CheckCircle2, Package, Truck } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { orderService } from '@/src/lib/orderService'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/src/lib/supabaseClient'
import { useAuthStore } from '@/src/lib/auth'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useCartStore, CartItem } from "@/src/lib/cartStore"

export default function Cart() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, checkAuth } = useAuthStore()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showIncompleteOrderModal, setShowIncompleteOrderModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    removeItem, 
    updateQuantity, 
    getTotalPrice,
    clearCart 
  } = useCartStore()

  useEffect(() => {
    setMounted(true)
    checkAuth()
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await checkAuth()
      } else if (event === 'SIGNED_OUT') {
        await checkAuth()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [checkAuth])

  const handleCheckout = async () => {
    if (items.length === 0) return

    // Recheck auth state before proceeding
    await checkAuth()

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setIsPlacingOrder(true)
    try {
      // Check for incomplete orders
      const hasIncompleteOrders = await orderService.checkIncompleteOrders()
      if (hasIncompleteOrders) {
        setShowIncompleteOrderModal(true)
        return
      }

      // Get user's default address
      const { data: addresses, error: addressError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_default', true)
        .single()

      if (addressError || !addresses) {
        setShowAddressModal(true)
        return
      }

      // Format address for order
      const formattedAddress = `${addresses.address}, ${addresses.city}, ${addresses.state} - ${addresses.pincode}`

      // Place COD order
      const order = await orderService.placeOrder({
        items,
        total: grandTotal,
        shipping_address: formattedAddress,
        payment_method: 'COD',
        status: "pending"
      })

      // Set order details for success modal
      setOrderDetails(order)

      // Clear cart and show success modal
      clearCart()
      setIsOpen(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    // Create WhatsApp message with cart details
    let message = "Hi, I would like to order the following items:\n\n"

    items.forEach((item) => {
      message += `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} - Rs. ${item.price * item.quantity}\n`
    })

    message += `\nTotal: Rs. ${getTotalPrice()}`

    // Redirect to WhatsApp
    const encodedMessage = encodeURIComponent(message)
    window.location.href = `https://wa.me/919328701508?text=${encodedMessage}`
  }

  // Calculate shipping cost
  const shippingCost = getTotalPrice() >= 1000 ? 0 : 99

  // Calculate grand total
  const grandTotal = getTotalPrice() + shippingCost

  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Add items to your cart to start shopping
                    </p>
                    <Button onClick={() => {
                      setIsOpen(false)
                      router.push("/collection")
                    }}>
                      Browse Collection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.size}ml
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t dark:border-gray-800 p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>₹{shippingCost === 0 ? "Free" : shippingCost}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Place COD Order
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleWhatsAppCheckout}
                    disabled={items.length === 0}
                    variant="outline"
                    className="w-full py-6 h-auto"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Order via WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Authentication Modal */}
          <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
            <DialogContent className="z-[10000]">
              <DialogHeader>
                <DialogTitle>Authentication Required</DialogTitle>
                <DialogDescription>
                  Please login to place an order
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowAuthModal(false)
                  router.push('/auth/login')
                }}>
                  Login
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Incomplete Order Modal */}
          <Dialog open={showIncompleteOrderModal} onOpenChange={setShowIncompleteOrderModal}>
            <DialogContent className="z-[10000]">
              <DialogHeader>
                <DialogTitle>Cannot Place Order</DialogTitle>
                <DialogDescription>
                  You have an incomplete order. Please wait for it to be processed before placing a new order.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setShowIncompleteOrderModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Address Modal */}
          <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
            <DialogContent className="z-[10000]">
              <DialogHeader>
                <DialogTitle>No Address Found</DialogTitle>
                <DialogDescription>
                  Please add a shipping address before placing an order.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddressModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowAddressModal(false)
                  router.push('/profile')
                }}>
                  Add Address
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Success Modal */}
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="sm:max-w-[500px] z-[10000]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                  Order Placed Successfully!
                </DialogTitle>
                <DialogDescription>
                  Thank you for your order. We'll process it as soon as possible.
                </DialogDescription>
              </DialogHeader>

              {orderDetails && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-medium">{orderDetails.id}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {orderDetails.items.map((item: CartItem) => (
                        <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name} ({item.size})</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping Details
                    </h4>
                    <p className="text-sm text-gray-600">{orderDetails.shipping_address}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Details
                    </h4>
                    <div className="flex justify-between text-sm">
                      <span>Payment Method:</span>
                      <span className="font-medium">{orderDetails.payment_method}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-medium">{formatCurrency(orderDetails.total)}</span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessModal(false)
                    router.push('/collection')
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessModal(false)
                    router.push('/profile')
                  }}
                >
                  View Order Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  )
}
