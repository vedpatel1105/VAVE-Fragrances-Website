"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Zap, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button" // Add this import

interface EnhancedProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    category: string
    tagline: string
    price: number
    priceXL: number
    images: {
      "30": string[]
      "50": string[]
      label: string
    }
    description: string
    longDescription: string
    rating: number
    reviews: number
    isNew: boolean
    isBestseller: boolean
    isLimited: boolean
    discount: number | null
    ingredients: string[]
    sizeOptions: { size: string; price: number }[]
    specifications: {
      fragrance_family: string
      concentration: string
      longevity: string
      sillage: string
      launch_year: string
    }
    notes: {
      top: string[]
      heart: string[]
      base: string[]
    }
    layeringOptions: {
      id: number
      name: string
      description: string
    }[]
  }
  onAddToCart: (product: any, quantity: number, size: string) => void
  onAddToWishlist: (product: any) => void
  onQuickView: (product: any) => void
  inWishlist?: boolean
  selectedSize?: string
  onSizeSelect: (size: string) => void
}

export default function EnhancedProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  inWishlist = false,
  selectedSize = "30",
  onSizeSelect,
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(inWishlist)
  const [currentImage, setCurrentImage] = useState(0)
  const router = useRouter()

  const getCurrentPrice = () => {
    const sizeOption = product.sizeOptions.find((s) => s.size === selectedSize)
    return sizeOption ? sizeOption.price : product.price
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onAddToWishlist(product)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentPrice = getCurrentPrice()
    onAddToCart(product, 1, selectedSize)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    const size = product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0].size : "30"
    onAddToCart(product, 1, size)
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

  // Add this useEffect to update image when size changes
  useEffect(() => {
    if (product.images && product.images[selectedSize as "30" | "50"]) {
      setCurrentImage(0) // Reset to first image when size changes
    }
  }, [selectedSize, product.images])

  return (
    <motion.div
      className="group relative overflow-hidden bg-black/95 backdrop-blur-md backdrop-filter rounded-xl border border-white/5"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Enhanced badge section */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="px-3 py-1 text-sm bg-gradient-to-r from-blue-600/90 to-blue-500/80 text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            New
          </motion.span>
        )}
        {product.isBestseller && (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="px-3 py-1 text-sm bg-gradient-to-r from-amber-600/90 to-amber-500/80 text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            Bestseller
          </motion.span>
        )}
        {product.discount && (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3 py-1 text-sm bg-gradient-to-r from-red-600/90 to-red-500/80 text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            {product.discount}% Off
          </motion.span>
        )}
      </div>

      {/* Enhanced wishlist button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md shadow-xl
          ${
            isWishlisted
              ? "bg-gradient-to-r from-red-600/90 to-red-500/80 text-white"
              : "bg-gradient-to-r from-gray-900/90 to-gray-800/80 text-white"
          }`}
        onClick={handleAddToWishlist}
      >
        <Heart
          className={`h-5 w-5 transform transition-transform duration-300 ${isWishlisted ? "scale-110 fill-current" : "scale-100"}`}
        />
      </motion.button>

      {/* Image section with edge-to-edge fit */}
      <div 
        className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer" 
        onClick={handleViewProduct}
      >
        <motion.div 
          className="absolute inset-0 w-full h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={product.images[selectedSize as "30" | "50"][currentImage] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </motion.div>
        
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Content section */}
      <motion.div
        className="p-4 bg-gradient-to-t from-black via-black/95 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3
            className="text-lg font-bold text-white cursor-pointer hover:text-accent transition-colors"
            onClick={handleViewProduct}
          >
            {product.name}
          </h3>
          {product.rating && (
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center bg-white/10 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm text-white/90">{product.rating}</span>
            </motion.div>
          )}
        </div>

        <p className="text-sm text-gray-300 line-clamp-2 mb-4 font-light">{product.description}</p>

        {/* Size Selection */}
        <div className="flex gap-2 mb-4">
          {product.sizeOptions.map((size) => (
            <button
              key={size.size}
              onClick={() => onSizeSelect(size.size)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedSize === size.size
                  ? "bg-white text-black font-medium"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {size.size}ml
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-white mb-2">
          ₹{getCurrentPrice()}
        </div>

        {/* Enhanced action buttons with animations */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium
              bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600
              text-white border border-white/10 transition-all duration-300 hover:shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium
              bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/90
              text-white shadow-lg shadow-accent/20 transition-all duration-300"
            onClick={handleBuyNow}
          >
            <Zap className="h-4 w-4 mr-2" />
            Buy Now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
