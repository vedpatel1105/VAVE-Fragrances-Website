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

  const handleWhatsAppCheckout = async () => {
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

    try {
      setIsPlacingOrder(true)
      
      const itemsText = items
        .map((item) => `• *${item.name}* (${item.size}ml) x ${item.quantity} - ₹${item.price * item.quantity}`)
        .join("\n")

      const total = grandTotal
      
      // 1. Record order in database
      const orderData = {
        user_id: user?.id || null,
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size ?? "",
          image: item.image,
        })),
        total_amount: total,
        subtotal_amount: getTotalPrice(),
        shipping_amount: shippingCost,
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: 'cod',
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { data: savedOrder, error: dbError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (dbError) {
        console.error('Error saving COD order from cart:', dbError)
      }

      const orderId = savedOrder?.id || ('COD-' + Date.now().toString().slice(-6))
      const displayId = typeof orderId === 'string' && orderId.includes('-') ? orderId.slice(-8).toUpperCase() : orderId

      const messageText = 
        `🛍️ *NEW COD ORDER CONFIRMATION*\n\n` +
        `🆔 *Order ID:* #${displayId}\n` +
        `👤 *Customer Details:*\n` +
        `Name: ${shippingAddress.name}\n` +
        `Phone: ${shippingAddress.phone}\n\n` +
        `📦 *Order Details:*\n` +
        `${itemsText}\n\n` +
        `💰 *Total Amount:* ₹${total}\n\n` +
        `📍 *Delivery Address:*\n` +
        `${shippingAddress.address}\n` +
        `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\n\n` +
        `Please confirm my COD order. Thank you!`;

      // 2. Send WhatsApp link
      const whatsappUrl = `https://wa.me/919328701508?text=${encodeURIComponent(messageText)}`;
      
      // 3. Cleanup
      clearCart()
      setIsOpen(false)
      setShowWhatsAppModal(false)
      
      toast({
        title: "Order Request Sent",
        description: "Your order has been recorded and details sent via WhatsApp.",
      })

      // 4. Open WhatsApp with fallback
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        window.location.href = whatsappUrl;
      }

      // 5. Redirect to success page
      router.push(`/order-success?orderId=${orderId}&method=cod`)

    } catch (error) {
      console.error('Error in WhatsApp COD flow:', error)
      toast({
        title: "Error",
        description: "Could not process your WhatsApp order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPlacingOrder(false)
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-md flex flex-col bg-zinc-950 border-l border-white/5 shadow-2xl z-50 overflow-hidden text-white"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/70">Your Cart</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 text-white rounded-full h-8 w-8 transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-12 w-12 text-white/10 mb-6" strokeWidth={1} />
                    <h3 className="text-sm uppercase tracking-widest font-medium text-white/60 mb-2">Cart is empty</h3>
                    <p className="text-xs text-white/30 mb-8 max-w-[200px] leading-relaxed">
                      Discover your next signature scent in our collection.
                    </p>
                    <Button 
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/collection")
                    }}
                    className="bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-full px-8 py-2.5 text-xs uppercase tracking-widest transition-all duration-300"
                    >
                      Explore Collection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="flex gap-5 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl relative group transition-all duration-300 hover:border-white/10"
                      >
                        <div className="relative h-24 w-20 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-white/5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start pr-6">
                              <h3 className="font-serif text-lg tracking-wide text-white/90">{item.name}</h3>
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                              {item.size}ml
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-full px-2 py-1">
                              <button
                                className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10 text-white/60 transition-colors"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-4 text-center text-xs font-mono text-white/80">{item.quantity}</span>
                              <button
                                className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10 text-white/60 transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="font-mono text-sm tracking-tighter text-white/90">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                        
                        {/* Absolute Trash Button - Always visible on mobile, hover on desktop */}
                        <button
                          className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                          onClick={() => removeItem(item.id, item.size, item.color)}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 bg-zinc-950 border-t border-white/5 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[11px] uppercase tracking-widest text-white/50">
                      <span>Subtotal</span>
                      <span className="font-mono tracking-tighter text-white/80">₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] uppercase tracking-widest text-white/50">
                      <span>Shipping</span>
                      <span className="font-mono tracking-tighter text-white/80">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-white pt-3 border-t border-white/5">
                      <span>Total</span>
                      <span className="font-mono tracking-tighter">₹{grandTotal}</span>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 text-center mt-2">GST included in all prices</p>
                  </div>

                  {/* Primary Checkout Button */}
                  <Button
                    className="w-full h-14 text-xs tracking-widest uppercase font-bold bg-white text-black hover:bg-gray-200 rounded-full shadow-lg transition-all duration-300"
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/checkout')
                    }}
                    disabled={items.length === 0}
                  >
                    Check out (Online Payment)
                  </Button>

                  {/* Payment Options Divider */}
                  <div className="flex items-center my-5">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-4 text-[9px] uppercase tracking-[0.2em] text-white/30 bg-zinc-950">
                      Or choose alternative
                    </span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>

                  {/* Alternative Payment Options */}
                  <div className="space-y-3">
                    {/* WhatsApp Button */}
                    <Button
                      onClick={() => setShowWhatsAppModal(true)}
                      disabled={items.length === 0}
                      className="w-full h-14 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg transition-all duration-300 group"
                    >
                      <MessageCircle className="mr-3 h-4 w-4 animate-pulse group-hover:animate-none" strokeWidth={2} />
                      Order via WhatsApp (COD)
                    </Button>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-center">
                    <Truck className="h-4 w-4 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[10px] uppercase tracking-widest text-white/50">
                      {shippingCost === 0 ? "You qualify for free shipping" : "Free shipping on orders above ₹1,000"}
                    </p>
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
