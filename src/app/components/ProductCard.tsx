"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Zap, Star, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    images?: string[]
    description: string
    rating?: number
    reviews?: number
    isNew?: boolean
    isBestseller?: boolean
    isLimited?: boolean
    discount?: number
    tags?: string[]
    fragranceNotes?: string[]
  }
  onAddToCart: (product: any, quantity: number, size: string) => void
  onAddToWishlist: (product: any) => void
  onQuickView: (product: any) => void
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const router = useRouter()

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onAddToWishlist(product)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product, 1, "30ml")
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Add to cart first
    onAddToCart(product, 1, "30ml")
    // Then redirect to checkout
    router.push("/checkout")
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView(product)
  }

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/product/${product.id}`)
  }

  return (
    <motion.div
      className="group relative bg-navy-blue text-white rounded-xl shadow-sm overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleQuickView}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
        {product.isBestseller && <Badge className="bg-amber-500 hover:bg-amber-600">Bestseller</Badge>}
        {product.isLimited && <Badge className="bg-purple-500 hover:bg-purple-600">Limited Edition</Badge>}
        {product.discount && <Badge className="bg-red-500 hover:bg-red-600">{product.discount}% Off</Badge>}
      </div>

      {/* Wishlist button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md shadow-xl transition-colors duration-300 ${
          isWishlisted
            ? "bg-white/80 hover:bg-white text-red-500"
            : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
        }`}
        onClick={handleAddToWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isWishlisted ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </motion.button>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
        />

        {/* Hover overlay with actions */}
        <div
          className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4 mr-1 inline-block" />
            Quick View
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="bg-accent text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:bg-accent/90"
            onClick={handleViewProduct}
          >
            View Product
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-white">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm text-gray-300">{product.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{product.description}</p>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-white">₹{product.price}</span>
            {product.discount && (
              <span className="ml-2 text-sm line-through text-gray-400">
                ₹{Math.round(product.price * (100 / (100 - product.discount)))}
              </span>
            )}
          </div>

          {product.reviews && <span className="text-xs text-gray-300">{product.reviews} reviews</span>}
        </div>

        {/* Fragrance Notes */}
        {product.fragranceNotes && product.fragranceNotes.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.fragranceNotes.slice(0, 2).map((note, index) => (
                <span key={index} className="text-xs bg-blue-900/50 px-2 py-1 rounded-full text-gray-100">
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center bg-blue-900/50 hover:bg-blue-900/70 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add to Cart
          </button>
          <button
            className="flex-1 flex items-center justify-center bg-accent hover:bg-accent/90 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={handleBuyNow}
          >
            <Zap className="h-4 w-4 mr-1" />
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}
