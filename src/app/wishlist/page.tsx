"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Heart, Trash2 } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import EnhancedProductCard from "@/src/app/components/EnhancedProductCard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

// Sample products data
const allProducts = [
  {
    id: 1,
    name: "Havoc",
    price: 350,
    image: "/img/havoc50.png",
    description: "A fresh and invigorating scent with notes of citrus and ocean breeze.",
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    offers: ["Buy 2 get 1 free sample", "Free shipping on orders above ₹1000"],
  },
  {
    id: 2,
    name: "Lavior",
    price: 350,
    image: "/img/lavior50.png",
    description: "A luxurious floral fragrance with hints of lavender and vanilla.",
    rating: 4.7,
    reviews: 98,
    isLimited: true,
    discount: 15,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    offers: ["Limited edition gift box available", "Free shipping on orders above ₹1000"],
  },
  {
    id: 3,
    name: "Duskfall",
    price: 350,
    image: "/img/duskfall50.png",
    description: "A mysterious and alluring scent perfect for evening wear.",
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    offers: ["Buy 2 get 1 free sample", "Free shipping on orders above ₹1000"],
  },
  {
    id: 4,
    name: "Euphoria",
    price: 350,
    image: "/img/euphoria50.png",
    description: "An exhilarating blend of fruity and floral notes that lifts your spirits.",
    rating: 4.6,
    reviews: 87,
    isNew: true,
    discount: 10,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    offers: ["New launch special: Free gift with purchase", "Free shipping on orders above ₹1000"],
  },
  {
    id: 5,
    name: "Oceane",
    price: 350,
    image: "/img/oceane50.png",
    description: "A deep, aquatic fragrance that evokes the mystery of the ocean.",
    rating: 4.8,
    reviews: 112,
    isNew: true,
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    offers: ["New launch special: Free gift with purchase", "Free shipping on orders above ₹1000"],
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      setIsLoading(true)
      try {
        const storedWishlist = localStorage.getItem("wishlist")
        if (storedWishlist) {
          const wishlistIds = JSON.parse(storedWishlist)
          // Find products that match the wishlist IDs
          const items = allProducts.filter((product) => wishlistIds.includes(product.id))
          setWishlistItems(items)
        }
      } catch (error) {
        console.error("Error loading wishlist:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlist()
  }, [])

  const addToWishlist = (product: any) => {
    try {
      // Check if product is already in wishlist
      const exists = wishlistItems.some((item) => item.id === product.id)

      let updatedWishlist
      if (exists) {
        // Remove from wishlist
        updatedWishlist = wishlistItems.filter((item) => item.id !== product.id)
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        // Add to wishlist
        updatedWishlist = [...wishlistItems, product]
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }

      setWishlistItems(updatedWishlist)

      // Save to localStorage
      const wishlistIds = updatedWishlist.map((item) => item.id)
      localStorage.setItem("wishlist", JSON.stringify(wishlistIds))
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromWishlist = (productId: number) => {
    try {
      const updatedWishlist = wishlistItems.filter((item) => item.id !== productId)
      setWishlistItems(updatedWishlist)

      // Save to localStorage
      const wishlistIds = updatedWishlist.map((item) => item.id)
      localStorage.setItem("wishlist", JSON.stringify(wishlistIds))

      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addToCart = (product: any, quantity: number, size: string) => {
    try {
      // Get current cart
      const storedCart = localStorage.getItem("cart")
      const cart = storedCart ? JSON.parse(storedCart) : []

      // Find the price based on selected size
      const sizeOption = product.sizes.find((s: any) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id && item.size === size)

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: price,
          image: product.image,
          quantity: quantity,
          size: size,
        })
      }

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart))

      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} (${size}) has been added to your cart.`,
      })

      // Optionally open the cart
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

  const handleQuickView = (product: any) => {
    // In a real app, this might open a modal or navigate to the product page
    console.log("Quick view:", product)
  }

  const clearWishlist = () => {
    try {
      setWishlistItems([])
      localStorage.removeItem("wishlist")

      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const moveAllToCart = () => {
    try {
      if (wishlistItems.length === 0) return

      // Get current cart
      const storedCart = localStorage.getItem("cart")
      const cart = storedCart ? JSON.parse(storedCart) : []

      // Add all wishlist items to cart
      wishlistItems.forEach((product) => {
        // Default to first size option
        const size = product.sizes[0].size
        const price = product.sizes[0].price

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex((item: any) => item.id === product.id && item.size === size)

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          cart[existingItemIndex].quantity += 1
        } else {
          // Add new item to cart
          cart.push({
            id: product.id,
            name: product.name,
            price: price,
            image: product.image,
            quantity: 1,
            size: size,
          })
        }
      })

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart))

      toast({
        title: "Added to Cart",
        description: `${wishlistItems.length} items have been added to your cart.`,
      })

      // Optionally open the cart
      setIsCartOpen(true)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add items to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Navbar setIsCartOpen={setIsCartOpen} />
      <main className="container mx-auto py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <div className="flex gap-4 mt-4 md:mt-0">
                <Button variant="outline" onClick={clearWishlist}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Wishlist
                </Button>
                <Button onClick={moveAllToCart}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Heart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Add items you love to your wishlist. Review them anytime and easily move them to your cart.
              </p>
              <Button onClick={() => router.push("/collection")}>Explore Collection</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {wishlistItems.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}
                  >
                    <EnhancedProductCard
                      product={product}
                      onAddToCart={addToCart}
                      onAddToWishlist={() => removeFromWishlist(product.id)}
                      onQuickView={handleQuickView}
                      inWishlist={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Recommended Products */}
          {!isLoading && wishlistItems.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts
                  .filter((product) => !wishlistItems.some((item) => item.id === product.id))
                  .slice(0, 4)
                  .map((product) => (
                    <EnhancedProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onAddToWishlist={() => addToWishlist(product)}
                      onQuickView={handleQuickView}
                      inWishlist={false}
                    />
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
