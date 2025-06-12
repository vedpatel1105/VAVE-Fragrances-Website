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
import { useCartStore } from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"

export default function CollectionPage() {
  const { toast } = useToast()
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({})
  const { addItem, setIsOpen, getTotalItems } = useCartStore()

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist")
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist))
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
  }, [])

  const handleAddToCart = (product: any, quantity: number, size: string) => {
    try {
      const sizeOption = product.sizeOptions.find((s: any) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id,
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

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
  }

  const addToWishlist = (product: any) => {
    try {
      // Check if product is already in wishlist
      const exists = wishlist.includes(product.id)

      let updatedWishlist
      if (exists) {
        // Remove from wishlist
        updatedWishlist = wishlist.filter((id) => id !== product.id)
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        // Add to wishlist
        updatedWishlist = [...wishlist, product.id]
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }

      setWishlist(updatedWishlist)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
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
                  handleAddToCart(product, quantity, selectedSizes[product.id] || product.sizeOptions[0].size)
                }
                onAddToWishlist={addToWishlist}
                onQuickView={() => {}}
                inWishlist={wishlist.includes(product.id)}
                selectedSize={selectedSizes[product.id] || product.sizeOptions[0].size}
                onSizeSelect={(size) => handleSizeSelect(product.id, size)}
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
