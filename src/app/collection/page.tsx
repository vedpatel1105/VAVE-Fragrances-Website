"use client"

import { motion } from "framer-motion"
import { useState } from "react"
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
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "@/src/lib/cartStore"

type Size = "30" | "50"

export default function CollectionPage() {
  const { toast } = useToast()
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: Size }>({})
  const { addItem, setIsOpen, getTotalItems } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  const handleAddToCart = (product: ProductInfo.Product, quantity: number, size: Size) => {
    try {
      const sizeOption = product.sizeOptions.find((s) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: price,
        image: product.images[size][0],
        images: product.images,
        quantity: quantity,
        size: size,
        type: "single",
      }

      addItem(cartItem)
      setIsOpen(true)

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

  const handleSizeSelect = (productId: number, size: Size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
  }

  const handleAddToWishlist = (product: ProductInfo.Product) => {
    try {
      if (isInWishlist(product.id.toString())) {
        removeFromWishlist(product.id.toString())
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        addToWishlist({
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SimpleNavbar />
      
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
          {ProductInfo.allProductItems.map((product) => (
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
                  images: {
                    ...product.images,
                    label: product.images.label || ""
                  }
                }}
                onAddToCart={(product, quantity) =>
                  handleAddToCart(product, quantity, selectedSizes[product.id] || product.sizeOptions[0].size as Size)
                }
                onAddToWishlist={handleAddToWishlist}
                onQuickView={() => {}}
                inWishlist={isInWishlist(product.id.toString())}
                selectedSize={selectedSizes[product.id] || product.sizeOptions[0].size as Size}
                onSizeSelect={(size) => handleSizeSelect(product.id, size as Size)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <Cart />
      <Footer />
    </div>
  )
}
