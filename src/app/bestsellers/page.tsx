"use client"

import { useState, useEffect } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"
import EnhancedProductCard from "@/src/app/components/EnhancedProductCard"
import Footer from "@/src/app/components/Footer"
import Link from "next/link"
import { ChevronRight, Crown } from "lucide-react"

// Bestseller products data
const bestsellerProducts = [
  {
    id: 3,
    name: "Duskfall",
    price: 350,
    image: "/dus30.jpg",
    description: "A mysterious and alluring scent perfect for evening wear.",
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Vetiver", "Sandalwood"],
  },
  {
    id: 8,
    name: "Havoc",
    price: 350,
    image: "/hav3050.jpg",
    description: "A fresh and invigorating scent with notes of citrus and ocean breeze.",
    rating: 4.8,
    reviews: 124,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Cedar", "Amber"],
  },
  {
    id: 5,
    name: "Mehfil",
    price: 350,
    image: "/meh30.jpg",
    description: "A mysterious and alluring scent perfect for evening wear.",
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Vetiver", "Sandalwood"],
  },
  {
    id: 6,
    name: "Obsession",
    price: 350,
    image: "/obs30.jpg",
    description: "A mysterious and alluring scent perfect for evening wear.",
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Vetiver", "Sandalwood"],
  },
  {
    id: 7,
    name: "Velora",
    price: 350,
    image: "/vel30.jpg",
    description: "A mysterious and alluring scent perfect for evening wear.",
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Vetiver", "Sandalwood"],
  },
]

export default function BestsellersPage() {
  const { toast } = useToast()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({})

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }

    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }
  }, [])

  const addToCart = (product: any, quantity: number, size: string) => {
    try {
      const sizeOption = product.sizes.find((s: any) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.size === size && !item.type)

      let updatedCart
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
            type: "single",
          },
        ]
      }

      setCart(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))

      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} (${size}) has been added to your cart.`,
      })

      setIsCartOpen(true)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQuantity = (id: number, size: string, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item,
    )
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromCart = (id: number, size: string) => {
    const updatedCart = cart.filter((item) => !(item.id === id && item.size === size))
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }))
  }

  const checkout = () => {
    if (cart.length === 0) return
    let message = "Hi, I would like to order the following items:\n\n"
    cart.forEach((item) => {
      message += `${item.quantity}x ${item.name} (${item.size}) - Rs. ${item.price * item.quantity}\n`
    })
    message += `\nTotal: Rs. ${calculateTotal()}`
    const encodedMessage = encodeURIComponent(message)
    window.location.href = `https://wa.me/919328701508?text=${encodedMessage}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SimpleNavbar cartItemsCount={cart.length} />

      <main className="container mx-auto px-4 py-24">
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 dark:text-white">Bestsellers</span>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold">Our Bestsellers</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our most loved fragrances - the scents that have captured hearts and become customer favorites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellerProducts.map((product) => (
            <EnhancedProductCard
              key={product.id}
              product={product}
              onAddToCart={(product, quantity) =>
                addToCart(product, quantity, selectedSizes[product.id] || product.sizes[0].size)
              }
              onAddToWishlist={() => {}}
              onQuickView={() => {}}
              inWishlist={wishlist.includes(product.id)}
              selectedSize={selectedSizes[product.id] || product.sizes[0].size}
              onSizeSelect={(size) => handleSizeSelect(product.id, size)}
              onViewDetails={(): void => {
                throw new Error("Function not implemented.")
              }}
            />
          ))}
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        total={calculateTotal()}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        checkout={checkout}
      />

      <Footer />
    </div>
  )
}
