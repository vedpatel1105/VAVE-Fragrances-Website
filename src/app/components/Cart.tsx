"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, CreditCard, Wallet, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string | number
  name: string
  price: number
  image: string
  quantity: number
  size: string
  type?: string
  fragrances?: string[]
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
      items: [],
      isOpen: false,
      addItem: (item) => {
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
      removeItem: (id, size) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.size === size))
        })
      },
      updateQuantity: (id, size, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          )
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
      setIsOpen: (isOpen) => {
        set({ isOpen })
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
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
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    removeItem, 
    updateQuantity, 
    getTotalPrice 
  } = useCartStore()

  const handleCheckout = () => {
    if (items.length === 0) return
    setIsOpen(false)
    router.push("/checkout")
  }

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    // Create WhatsApp message with cart details
    let message = "Hi, I would like to order the following items:\n\n"

    items.forEach((item) => {
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
            className="fixed inset-0 bg-black/50 z-[9999]"
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
                items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      {item.type === 'layered' && item.fragrances && (
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
                  <Button onClick={handleCheckout} disabled={items.length === 0} className="w-full py-6 h-auto">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Checkout with Payment
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
        </>
      )}
    </AnimatePresence>
  )
}
