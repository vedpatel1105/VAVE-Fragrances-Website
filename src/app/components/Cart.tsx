"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, CreditCard, Wallet, ShoppingBag, Loader2, CheckCircle2, Package, Truck, MessageCircle } from "lucide-react"
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
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Gujarat",
    pincode: "",
  })
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

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSavedAddresses()
      setShippingAddress(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      }))
    }
  }, [isAuthenticated, user])

  const fetchSavedAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })

      if (error) throw error
      setSavedAddresses(data || [])
      if (data && data.length > 0) {
        handleAddressSelect(data[0].id, data[0])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleAddressSelect = (id: string, addr?: any) => {
    setSelectedAddressId(id)
    if (id === 'new') {
      setShippingAddress(prev => ({
        ...prev,
        address: "",
        city: "",
        pincode: "",
      }))
    } else if (addr) {
      setShippingAddress(prev => ({
        ...prev,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

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

    // Validate if any field is missing
    const missing = []
    if (!shippingAddress.name.trim()) missing.push("Name")
    if (!shippingAddress.phone.trim()) missing.push("Phone")
    if (!shippingAddress.address.trim()) missing.push("Address")

    if (missing.length > 0) {
      toast({
        title: "Details Required",
        description: `Please provide your ${missing.join(", ")} to confirm the WhatsApp order.`,
        variant: "destructive",
      })
      return
    }

    const itemsText = items
      .map((item) => `*${item.name}*\n  Size: ${item.size}ml\n  Qty: ${item.quantity}\n  Price: ₹${item.price}`)
      .join("\n\n")

    const total = grandTotal
    
    const message = encodeURIComponent(
      `*ORDER REQUEST - CASH ON DELIVERY*\n\n` +
      `Hello Vave Fragrances! I'd like to place an order for:\n\n` +
      `${itemsText}\n\n` +
      `*Order Total:* ₹${total}\n\n` +
      `*Customer Details:*\n` +
      `Name: ${shippingAddress.name}\n` +
      `Contact: ${shippingAddress.phone}\n` +
      `Email: ${shippingAddress.email}\n\n` +
      `*Shipping Address:*\n` +
      `${shippingAddress.address}\n` +
      `${shippingAddress.city}, ${shippingAddress.state}\n` +
      `PIN: ${shippingAddress.pincode}\n\n` +
      `Please confirm my COD order. Thank you!`
    )

    window.open(`https://wa.me/919328701508?text=${message}`, "_blank")
    setShowWhatsAppModal(false)
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
                    Check out (Online Payment)
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
                    {/* WhatsApp Button */}
                    <Button
                      onClick={() => setShowWhatsAppModal(true)}
                      disabled={items.length === 0}
                      className="w-full h-12 bg-[#25D366] hover:bg-[#20ba5a] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <MessageCircle className="mr-3 h-5 w-5 animate-pulse group-hover:animate-none" />
                      Order via WhatsApp (COD)
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
          {/* WhatsApp COD Details Modal */}
          <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
            <DialogContent className="sm:max-w-[450px] z-[10000] bg-zinc-950 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#25D366]">
                  <MessageCircle className="h-6 w-6" />
                  Order via WhatsApp (COD)
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Provide your delivery details to confirm your order on WhatsApp.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Saved Addresses for Authenticated Users */}
                {isAuthenticated && savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Select Saved Address</label>
                    <div className="grid grid-cols-1 gap-2">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleAddressSelect(addr.id, addr)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr.id
                              ? 'bg-zinc-900 border-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.1)]'
                              : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                            }`}
                        >
                          <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-zinc-100">{addr.address}</p>
                                <p className="text-xs text-zinc-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                            </div>
                            {selectedAddressId === addr.id && (
                              <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddressSelect('new')}
                        className={`p-2 rounded-xl border border-dashed text-xs transition-all ${selectedAddressId === 'new'
                            ? 'bg-zinc-900 border-[#25D366] text-white'
                            : 'bg-zinc-900/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                          }`}
                      >
                        + Use different address
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Delivery Details</label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 pl-1">Full Name</label>
                      <input
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#25D366] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 pl-1">Phone Number</label>
                      <input
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#25D366] outline-none transition-all"
                      />
                    </div>
                    {(!isAuthenticated || selectedAddressId === 'new') && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 pl-1">Delivery Address</label>
                          <input
                            name="address"
                            value={shippingAddress.address}
                            onChange={handleInputChange}
                            placeholder="Flat/House No, Street, Landmark"
                            className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#25D366] outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs text-zinc-400 pl-1">City</label>
                            <input
                              name="city"
                              value={shippingAddress.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#25D366] outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-zinc-400 pl-1">PIN Code</label>
                            <input
                              name="pincode"
                              value={shippingAddress.pincode}
                              onChange={handleInputChange}
                              placeholder="6-digit PIN"
                              className="w-full bg-zinc-900 border-zinc-800 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#25D366] outline-none transition-all"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2 border-t border-zinc-800">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWhatsAppModal(false)}
                  className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWhatsAppCheckout}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_4px_10px_rgba(37,211,102,0.2)]"
                  disabled={!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address}
                >
                  Confirm & Send to WhatsApp
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  )
}
