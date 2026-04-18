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
    const size = selectedSize || (product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0].size : "30")
    router.push(`/checkout?productId=${product.id}&size=${size}&quantity=1`)
  }

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/product/${product.id}`)
  }

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    onSizeSelect(size);
  }

  return (
    <motion.div
      className="group relative bg-zinc-950 border border-white/5 rounded-none overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Luxury Badges */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
        {!!product.isNew && (
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] bg-zinc-900 border border-white/10 text-white rounded-full backdrop-blur-md"
          >
            New
          </motion.span>
        )}
        {!!product.isBestseller && (
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] bg-zinc-900 border border-white/10 text-white rounded-full backdrop-blur-md"
          >
            Bestseller
          </motion.span>
        )}
        {!!(product.discount && product.discount > 0) && (
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] bg-zinc-900 border border-white/10 text-white rounded-full backdrop-blur-md"
          >
            {product.discount}% Off
          </motion.span>
        )}
      </div>

      {/* Elegant Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
          inWishlist
            ? "bg-white text-black border-transparent"
            : "bg-zinc-900/50 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
        }`}
        onClick={handleAddToWishlist}
      >
        <Heart
          className="h-4 w-4"
          strokeWidth={inWishlist ? 2.5 : 1.5}
          fill={inWishlist ? "currentColor" : "none"}
        />
      </motion.button>

      {/* Image Area - Sleek container */}
      <div
        className="relative cursor-pointer bg-zinc-900/20 aspect-[4/5] overflow-hidden"
        onClick={handleViewProduct}
      >
        <motion.div
           className="relative w-full h-full flex items-center justify-center"
           whileHover={{ scale: 1.05 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src={
              (["30", "50"].includes(selectedSize) && product.images[selectedSize as "30" | "50"]
                ? product.images[selectedSize as "30" | "50"][0]
                : product.images["30"][0])
            }
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </motion.div>
        
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-60 pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="p-6 bg-zinc-950 border-t border-white/5 relative z-10">
        
        {/* Header block */}
        <div className="flex justify-between items-start mb-3">
          <h3
            className="text-2xl font-serif text-white tracking-wide cursor-pointer hover:text-white/70 transition-colors"
            onClick={handleViewProduct}
          >
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="h-3 w-3 text-white/50" strokeWidth={1} fill="currentColor" />
              <span className="text-[10px] text-white/50 font-mono">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Minimal Description */}
        <p className="text-xs text-white/40 line-clamp-2 mb-6 font-light leading-relaxed">
          {product.description}
        </p>

        {/* Luxury Size Pills */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-6">
          {product.sizeOptions.map((size) => (
            <button
              key={size.size}
              onClick={(e) => handleSizeSelect(e, size.size)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                selectedSize === size.size
                ? "bg-white text-black font-bold"
                : "bg-transparent border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {size.size}ml
            </button>
          ))}
        </div>

        {/* Price & Action Buttons */}
        <div className="space-y-4">
          <div className="text-xl font-mono tracking-tighter text-white">
            ₹{product.sizeOptions.find(opt => opt.size === selectedSize)?.price || product.price || ""}
          </div>

          <div className="flex gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center py-3.5 rounded-none text-[10px] uppercase tracking-widest font-bold
                bg-transparent hover:bg-white/5 text-white border border-white/20 transition-all duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Add
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center py-3.5 rounded-none text-[10px] uppercase tracking-widest font-bold
                bg-white text-black transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              onClick={handleBuyNow}
            >
              <Zap className="h-4 w-4 mr-2" strokeWidth={1.5} fill="currentColor" />
              Buy Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


