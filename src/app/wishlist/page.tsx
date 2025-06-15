"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Heart, Trash2 } from "lucide-react"
import Footer from "@/src/app/components/Footer"
import EnhancedProductCard from "@/src/app/components/EnhancedProductCard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "@/src/lib/cartStore"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"

type Product = ProductInfo.Product

export default function WishlistPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Wishlist store
  const {
    items: wishlistItems,
    removeFromWishlist,
    clearWishlist
  } = useWishlistStore()

  // Cart store
  const {
    addItem: addToCart,
    setIsOpen: setIsCartOpen
  } = useCartStore()

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    setMounted(true)
    return () => clearTimeout(timer)
  }, [])

  const handleAddToWishlist = (product: Product) => {
    try {
      if (wishlistItems.some((item) => item.id === product.id.toString())) {
        removeFromWishlist(product.id.toString())
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        useWishlistStore.getState().addToWishlist({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.images["30"][0],
          slug: product.slug
        })
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: Product, quantity: number) => {
    try {
      const size = selectedSizes[product.id] || product.sizeOptions[0].size
      const sizeOption = product.sizeOptions.find((s) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: price,
        image: product.images[size as "30" | "50"][0],
        images: product.images,
        quantity: quantity,
        size: size,
        type: "single",
      }

      addToCart(cartItem)
      setIsCartOpen(true)

      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} (${size}ml) has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleQuickView = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
  }

  const handleClearWishlist = () => {
    try {
      clearWishlist()
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

  const handleMoveAllToCart = () => {
    try {
      if (wishlistItems.length === 0) return

      wishlistItems.forEach((item) => {
        const product = ProductInfo.allProductItems.find(p => p.id.toString() === item.id)
        if (product) {
          const size = selectedSizes[product.id] || product.sizeOptions[0].size
          const sizeOption = product.sizeOptions.find(s => s.size === size)
          const price = sizeOption ? sizeOption.price : product.price

          const cartItem = {
            id: product.id.toString(),
            name: product.name,
            price: price,
            image: product.images[size as "30" | "50"][0],
            images: product.images,
            quantity: 1,
            size: size,
            type: "single",
          }
          addToCart(cartItem)
        }
      })

      setIsCartOpen(true)
      toast({
        title: "Added to Cart",
        description: `${wishlistItems.length} items have been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add items to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <SimpleNavbar />
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
                <Button variant="outline" onClick={handleClearWishlist}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Wishlist
                </Button>
                <Button onClick={handleMoveAllToCart}>
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
                {wishlistItems.map((item) => {
                  const product = ProductInfo.allProductItems.find(p => p.id.toString() === item.id)
                  if (!product) return null
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3 }}
                    >
                      <EnhancedProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={() => handleAddToWishlist(product)}
                        onQuickView={handleQuickView}
                        inWishlist={true}
                        selectedSize={selectedSizes[product.id] || product.sizeOptions[0].size}
                        onSizeSelect={(size) => handleSizeSelect(product.id.toString(), size)}
                      />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Recommended Products */}
          {!isLoading && wishlistItems.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ProductInfo.allProductItems
                  .filter((product) => !wishlistItems.some((item) => item.id === product.id.toString()))
                  .slice(0, 4)
                  .map((product) => (
                    <EnhancedProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={() => handleAddToWishlist(product)}
                      onQuickView={handleQuickView}
                      inWishlist={false}
                      selectedSize={selectedSizes[product.id] || product.sizeOptions[0].size}
                      onSizeSelect={(size) => handleSizeSelect(product.id.toString(), size)}
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
