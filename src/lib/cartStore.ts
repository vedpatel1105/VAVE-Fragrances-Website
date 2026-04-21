import { persist } from 'zustand/middleware'
import { analytics } from './analytics'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, quantity: number) => void
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
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        )

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...currentItems, item] })
        }

        // Tracking
        analytics.trackEvent('add_to_cart', {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size
        })
      },
      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        })
      },
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
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
      },
    }),
    {
      name: 'cart-storage',
    }
  )
) 