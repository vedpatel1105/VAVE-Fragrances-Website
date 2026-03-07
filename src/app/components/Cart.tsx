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

      // Build JSON shipping address per orders schema
      const shippingAddress = {
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        address: addresses.address,
        city: addresses.city,
        state: addresses.state,
        pincode: addresses.pincode,
      }

      // Place COD order in orders table
      const order = await orderService.placeOrder({
        items,
        total_amount: grandTotal,
        subtotal_amount: getTotalPrice(),
        shipping_amount: shippingCost,
        shipping_address: shippingAddress,
        payment_method: 'COD',
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
  const shippingCost = getTotalPrice() >= 1000 ? 0 : 30

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
                        key={`${item.id}-${item.size}-${item.color}`}
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
                            onClick={() => removeItem(item.id, item.size, item.color)}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">GST is included in the displayed prices</p>
                  </div>
                  {/* Primary Checkout Button */}
                  <Button
                    className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/checkout')
                    }}
                    disabled={items.length === 0}
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    Proceed to Checkout
                  </Button>

                  {/* Payment Options Divider */}
                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="px-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                      Or choose alternative
                    </span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                  </div>

                  {/* Alternative Payment Options */}
                  <div className="space-y-3">
                    {/* COD Button */}
                    <Button
                      className="w-full h-11 bg-green-600 hover:bg-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={handleCheckout}
                      disabled={items.length === 0 || isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                          Processing COD Order...
                        </>
                      ) : (
                        <>
                          <Package className="mr-3 h-4 w-4" />
                          Cash on Delivery
                        </>
                      )}
                    </Button>

                    {/* WhatsApp Button */}
                    <Button
                      onClick={handleWhatsAppCheckout}
                      disabled={items.length === 0}
                      className="w-full h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <svg className="mr-3 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Order via WhatsApp
                    </Button>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Truck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100">Free Shipping</p>
                        <p className="text-blue-700 dark:text-blue-200">Orders above ₹1,000 qualify for free delivery</p>
                      </div>
                    </div>
                  </div>
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
                  router.push('/auth/login?redirect=/checkout')
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
