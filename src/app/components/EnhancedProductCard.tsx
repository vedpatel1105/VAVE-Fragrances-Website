"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Zap, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductInfo } from "@/src/data/product-info"


interface EnhancedProductCardProps {
  product: ProductInfo.Product
  onAddToCart: (product: ProductInfo.Product, quantity: number) => void
  onAddToWishlist: (product: ProductInfo.Product) => void
  inWishlist: boolean
  selectedSize: string
  onSizeSelect: (size: string) => void
}

export default function EnhancedProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  inWishlist,
  selectedSize,
  onSizeSelect,
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value)
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToWishlist(product)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product, quantity)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    const size = product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0].size : "30"
    onAddToCart(product, quantity)
    router.push("/checkout")
  }

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/product/${product.id}`)
  }

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    onSizeSelect(size);
  };

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Enhanced badge section */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew ? (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="px-3 py-1 text-sm bg-gradient-to-r from-blue-600/90 to-blue-500/80 text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            New
          </motion.span>
        ) : ''}
        {product.isBestseller ? (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="px-3 py-1 text-sm bg-gradient-to-r from-amber-600/90 to-amber-500/80 text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            Bestseller
          </motion.span>
        ) : ''}
        {product.discount && product.discount > 0 ? (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3 py-1 text-sm bg-gradient-to-r from-red-600/90 to-red-500/80 text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            {product.discount}% Off
          </motion.span>
        ) : ''}
      </div>

      {/* Enhanced wishlist button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md shadow-xl transition-colors duration-300 ${
          inWishlist
            ? "bg-white/80 hover:bg-white text-red-500"
            : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
        }`}
        onClick={handleAddToWishlist}
      >
        <Heart
          className={`h-5 w-5 transition-all duration-300 ${
            inWishlist ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </motion.button>

      {/* Image section with increased height */}
      <div
        className="relative aspect-[4/5] overflow-hidden cursor-pointer" // Changed from aspect-square to aspect-[4/5]
        onClick={handleViewProduct}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={
              (["30", "50"].includes(selectedSize) && product.images[selectedSize as "30" | "50"]
                ? product.images[selectedSize as "30" | "50"][0]
                : product.images["30"][0])
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
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
      <div className="p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
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

        {/* Size Selection - Fixed and improved */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.sizeOptions.map((size) => (
            <button
              key={size.size}
              onClick={(e) => handleSizeSelect(e, size.size)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedSize === size.size
                ? "bg-white text-black font-medium shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {size.size}ml - ₹{size.price}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-white mb-2">
          ₹{product.sizeOptions.find(opt => opt.size === selectedSize)?.price || product.price || ""}
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
      </div>

      {/* Quick Actions - Wishlist */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className={`bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg ${
            inWishlist ? "text-red-500" : ""
          }`}
          onClick={handleAddToWishlist}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
    </motion.div>
  )
}
