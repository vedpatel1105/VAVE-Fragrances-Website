"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"
import EnhancedProductCard from "@/src/app/components/EnhancedProductCard"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CartItem, Product } from "@/src/types/cart"
import { addToCart, updateCartItemQuantity, removeFromCart, calculateTotal, loadCart } from "@/src/utils/cartUtils"

// Add product data (use the same data from layering page)
const allProducts = [
  {
    id: 8,
    name: "Havoc",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/havoc30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/havoc50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/havoc30.jpg",
    description: "A fresh and invigorating scent with notes of citrus and ocean breeze.",
    category: "Fresh Aromatic",
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: {
      top: ["Bergamot", "Sea Salt"],
      heart: ["Lavender", "Geranium"],
      base: ["Sandalwood", "Amber", "Musk"],
    },
  },
   {
    id: 4,
    name: "Lavior",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/lavior30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/lavior50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/lavior30.jpg",
    description: "A luxurious floral fragrance with hints of lavender and vanilla.",
    rating: 4.7,
    reviews: 98,
    isLimited: true,
    discount: 15,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Lavender", "Vanilla"],
  },
  {
    id: 3,
    name: "Duskfall",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/duskfall30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/duskfall50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/duskfall30.jpg",
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
    id: 2,
    name: "Euphoria",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/euphoria30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/euphoria50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/euphoria30.jpg",
    description: "An exhilarating blend of fruity and floral notes that lifts your spirits.",
    rating: 4.6,
    reviews: 87,
    isNew: true,
    discount: 10,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Rose", "Jasmine"],
  },
  {
    id: 1,
    name: "Oceane",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/oceane30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/oceane50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/oceane30.jpg",
    description: "A deep, aquatic fragrance that evokes the mystery of the ocean.",
    rating: 4.8,
    reviews: 112,
    isNew: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    fragranceNotes: ["Sea Salt", "Citrus"],
  },
   {
    id: 6,
    name: "Obsession",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/obsession30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/obsession50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/obsession30.jpg",
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
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/velora30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/velora50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/velora30.jpg",
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
    id: 5,
    name: "Mehfil",
    price: 350,
    images: {
      "30ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/mehfil30.jpg",
      "50ml": "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/mehfil50.jpg"
    },
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/mehfil30.jpg",
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

export default function CollectionPage() {
  const { toast } = useToast()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    setCart(loadCart())
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }
  }, [])

  const handleAddToCart = (product: Product, quantity: number, size: string) => {
    const updatedCart = addToCart(product, quantity, size, cart)
    setCart(updatedCart)
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (id: number, size: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(id, size, quantity, cart)
    setCart(updatedCart)
  }

  const handleRemoveFromCart = (id: number, size: string) => {
    const updatedCart = removeFromCart(id, size, cart)
    setCart(updatedCart)
  }

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
  }

  const checkout = () => {
    if (cart.length === 0) return
    let message = "Hi, I would like to order the following items:\n\n"
    cart.forEach((item) => {
      message += `${item.quantity}x ${item.name} (${item.size}) - Rs. ${item.price * item.quantity}\n`
    })
    message += `\nTotal: Rs. ${calculateTotal(cart)}`
    const encodedMessage = encodeURIComponent(message)
    window.location.href = `https://wa.me/919328701508?text=${encodedMessage}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SimpleNavbar cartItemsCount={cart.length} />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 dark:text-white">Our Collection</span>
        </div>

        <h1 className="text-4xl font-bold text-center mb-4">Our Collection</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Discover our range of unique fragrances, each crafted to evoke distinct emotions and memories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
          {allProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="h-full"
            >
              <EnhancedProductCard
                product={{
                  ...product,
                  image: product.images?.[(selectedSizes[product.id] || "30ml") as "30ml" | "50ml"] || product.images["30ml"],
                  fragranceNotes: Array.isArray(product.fragranceNotes)
                    ? product.fragranceNotes
                    : product.fragranceNotes
                      ? [
                          ...(product.fragranceNotes.top || []),
                          ...(product.fragranceNotes.heart || []),
                          ...(product.fragranceNotes.base || [])
                        ]
                      : []
                }}
                onAddToCart={(product, quantity) =>
                  handleAddToCart(product, quantity, selectedSizes[product.id] || product.sizes[0].size)
                }
                onAddToWishlist={() => {}}
                onQuickView={() => {}}
                inWishlist={wishlist.includes(product.id)}
                selectedSize={selectedSizes[product.id] || product.sizes[0].size}
                onSizeSelect={(size) => {
                  handleSizeSelect(product.id, size)
                  // Update the product image when size changes
                  if (product.images?.[size as "30ml" | "50ml"]) {
                    product.image = product.images[size as "30ml" | "50ml"]
                  }
                }}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        total={calculateTotal(cart)}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        checkout={checkout}
      />
      
      <Footer />
    </div>
  )
}
