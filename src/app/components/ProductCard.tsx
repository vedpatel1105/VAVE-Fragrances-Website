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
    // Redirect with single item params
    router.push(`/checkout?productId=${product.id}&size=30&quantity=1`)
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
      className="group relative bg-zinc-950 border border-white/5 text-white hover:border-white/20 transition-colors duration-500 overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleQuickView}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && <Badge className="bg-white text-black hover:bg-gray-200 px-3 py-1 text-[10px] tracking-widest uppercase rounded-none font-medium border-none">NEW</Badge>}
        {product.isBestseller && <Badge className="bg-zinc-800/80 backdrop-blur-sm text-white hover:bg-zinc-700 px-3 py-1 text-[10px] tracking-widest uppercase rounded-none font-medium border border-white/10">BESTSELLER</Badge>}
        {product.isLimited && <Badge className="bg-zinc-800/80 backdrop-blur-sm text-white hover:bg-zinc-700 px-3 py-1 text-[10px] tracking-widest uppercase rounded-none font-medium border border-white/10">LIMITED EDITION</Badge>}
        {product.discount && <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-3 py-1 text-[10px] tracking-widest uppercase rounded-none font-medium">{product.discount}% OFF</Badge>}
      </div>

      {/* Wishlist button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 ${
          isWishlisted
            ? "bg-white text-black"
            : "bg-zinc-900/40 border border-white/10 text-white/70 hover:bg-white hover:text-black"
        }`}
        onClick={handleAddToWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isWishlisted ? "fill-black text-black scale-110" : "scale-100"
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
          className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-none font-medium text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4 mr-2 inline-block" />
            Quick View
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="bg-white text-black px-6 py-2 rounded-none font-medium text-[10px] tracking-widest uppercase hover:bg-gray-200 transition-all"
            onClick={handleViewProduct}
          >
            View Product
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-zinc-950">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl tracking-wide text-white">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-white fill-white" />
              <span className="ml-1 text-xs font-light text-white/50">{product.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm font-light leading-relaxed text-white/50 line-clamp-2 mb-4">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline">
            <span className="text-lg font-serif text-white">₹{product.price}</span>
            {product.discount && (
              <span className="ml-2 text-sm line-through text-white/30 font-light">
                ₹{Math.round(product.price * (100 / (100 - product.discount)))}
              </span>
            )}
          </div>

          {product.reviews && <span className="text-[10px] uppercase tracking-widest text-white/40">{product.reviews} reviews</span>}
        </div>

        {/* Fragrance Notes */}
        {product.fragranceNotes && product.fragranceNotes.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {product.fragranceNotes.slice(0, 3).map((note, index) => (
                <span key={index} className="text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-none text-white/60">
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center bg-zinc-900 border border-white/10 hover:border-white/30 text-white py-3 rounded-none text-[10px] uppercase tracking-widest font-medium transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
          <button
            className="flex-1 flex items-center justify-center bg-white hover:bg-gray-200 text-black py-3 rounded-none text-[10px] uppercase tracking-widest font-medium transition-all"
            onClick={handleBuyNow}
          >
            <Zap className="h-4 w-4 mr-2" />
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}
