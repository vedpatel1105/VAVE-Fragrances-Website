import { CartItem, Product } from "@/src/types/cart"
import { toast } from "@/components/ui/use-toast"

export const addToCart = (
  product: Product,
  quantity: number,
  size: string,
  cart: CartItem[]
): CartItem[] => {
  try {
    const sizeOption = product.sizes.find((s) => s.size === size)
    const price = sizeOption ? sizeOption.price : product.price

    const existingItemIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size && !item.type
    )

    let updatedCart: CartItem[]
    if (existingItemIndex >= 0) {
      updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += quantity
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: price,
          image: product.image,
          quantity: quantity,
          size: size,
          type: 'single',
        },
      ]
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} (${size}) has been added to your cart.`,
    })

    return updatedCart
  } catch (error) {
    console.error("Error adding to cart:", error)
    toast({
      title: "Error",
      description: "Failed to add to cart. Please try again.",
      variant: "destructive",
    })
    return cart
  }
}

export const updateCartItemQuantity = (
  id: number,
  size: string,
  quantity: number,
  cart: CartItem[]
): CartItem[] => {
  const updatedCart = cart.map((item) =>
    item.id === id && item.size === size ? { ...item, quantity } : item
  )
  localStorage.setItem("cart", JSON.stringify(updatedCart))
  return updatedCart
}

export const removeFromCart = (
  id: number,
  size: string,
  cart: CartItem[]
): CartItem[] => {
  const updatedCart = cart.filter((item) => !(item.id === id && item.size === size))
  localStorage.setItem("cart", JSON.stringify(updatedCart))
  return updatedCart
}

export const calculateTotal = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const storedCart = localStorage.getItem("cart")
    return storedCart ? JSON.parse(storedCart) : []
  } catch (error) {
    console.error("Error loading cart:", error)
    return []
  }
}
