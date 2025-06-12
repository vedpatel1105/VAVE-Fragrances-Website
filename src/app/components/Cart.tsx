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

export interface CartItem {
  id: string | number
  name: string
  price: number
  image: string
  quantity: number
  size: string
  type?: string
  fragrances?: string[]
  images?: {
    "30": string[]
    "50": string[]
    label: string
  }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string | number, size: string) => void
  updateQuantity: (id: string | number, size: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      isOpen: false,
      addItem: (item: CartItem) => {
        const currentItems = get().items
        const existingItemIndex = currentItems.findIndex(
          (i) => i.id === item.id && i.size === item.size
        )

        if (existingItemIndex >= 0) {
          const updatedItems = [...currentItems]
          updatedItems[existingItemIndex].quantity += item.quantity
          set({ items: updatedItems })
        } else {
          set({ items: [...currentItems, item] })
        }
      },
      removeItem: (id: string | number, size: string) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.size === size))
        })
      },
      updateQuantity: (id: string | number, size: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          )
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
      setIsOpen: (isOpen: boolean) => {
        set({ isOpen })
      },
      getTotalItems: () => {
        return get().items.reduce((total: any, item: { quantity: any }) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total: number, item: { price: number; quantity: number }) => total + item.price * item.quantity,
          0
        )

      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default function Cart() {
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

  // Check auth state when component mounts and subscribe to auth changes
  useEffect(() => {
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

    items.forEach((item: { quantity: number; name: any; size: any; price: number }) => {
      message += `${item.quantity}x ${item.name} (${item.size}) - Rs. ${item.price * item.quantity}\n`
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 h-screen bg-white dark:bg-gray-900 shadow-lg z-[9999] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Your cart is empty</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/collection")
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item: CartItem) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.images ? item.images[item.size as "30" | "50"][0] : item.image || "/placeholder.svg"} 
                        alt={item.name} 
                        fill 
                        className="object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      {item.type && item.type === 'layered' && item.fragrances && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.fragrances.join(' × ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.size} - {formatCurrency(item.price)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
                        >
                          <Minus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="mx-2 text-sm text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
                        >
                          <Plus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="mt-1 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium">{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout} 
                    disabled={items.length === 0 || isPlacingOrder} 
                    className="w-full py-6 h-auto"
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

                {getTotalPrice() < 1000 && (
                  <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    Add {formatCurrency(1000 - getTotalPrice())} more to get free shipping!
                  </p>
                )}
              </div>
            )}
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
