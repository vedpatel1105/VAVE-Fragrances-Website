"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Zap, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductInfo } from "@/src/data/product-info"
import { analytics } from "@/src/lib/analytics"

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
  const router = useRouter()

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToWishlist(product)
    
    // Tracking intent
    analytics.trackEvent('add_to_wishlist', {
      item_id: product.id,
      item_name: product.name
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product, 1)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    const size = selectedSize || (product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0].size : "30")
    router.push(`/checkout?productId=${product.id}&size=${size}&quantity=1&express=true`)
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
      className="group relative w-full bg-transparent flex flex-col pt-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewProduct}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      {/* Absolute Price Indicator - Staggered Placement */}
      <div className="absolute top-0 right-0 z-10 flex flex-col items-end">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-1">Price</span>
        <span className="text-xl font-serif text-white/90">₹{product.sizeOptions.find((opt) => opt.size === selectedSize)?.price || product.price}</span>
      </div>

      {/* Main Architectural Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 border border-white/5 transition-colors duration-1000 group-hover:border-white/20">
        <Image
          src={product.images[selectedSize as "30" | "50" || "30"]?.[0] || product.images["30"][0]}
          alt={product.name}
          fill
          className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2.5s] ease-[0.22,1,0.36,1]"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Shine Animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full"
          animate={isHovered ? { translateX: "200%" } : { translateX: "-100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Dynamic Shadow Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000" />

        {/* Inventory Scarcity Badge */}
        {((selectedSize === "30" && product.stock_30ml < 10) || (selectedSize === "50" && product.stock_50ml < 10)) && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full"
          >
            <Zap className="w-3 h-3 text-gold fill-gold animate-pulse" />
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white">
              Scent selling fast
            </span>
          </motion.div>
        )}

        {/* Hover Action Overlay - Desktop Only */}
        <div className="absolute inset-0 hidden lg:flex flex-col justify-end p-6 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[0.22,1,0.36,1]">
          <div className="space-y-3">
             <motion.button 
               onClick={handleBuyNow}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full h-12 bg-white text-black text-[9px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-colors pointer-events-auto shadow-2xl"
             >
               Buy Now
             </motion.button>
             <motion.button 
               onClick={handleAddToCart}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full h-12 bg-transparent border border-white/20 text-white text-[9px] uppercase tracking-[0.4em] font-bold hover:bg-white/5 transition-all pointer-events-auto backdrop-blur-sm"
             >
               Add to Cart
             </motion.button>
          </div>
        </div>

        {/* Minimal Selection Dot */}
        {!((selectedSize === "30" && product.stock_30ml < 10) || (selectedSize === "50" && product.stock_50ml < 10)) && (
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {product.isNew && (
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
          </div>
        )}

        {/* Premium Bestseller Badge */}
        {product.isBestseller && (
           <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white/40">
              <Star className="w-3 h-3 fill-white/20" />
              <span className="text-[8px] uppercase tracking-[0.3em]">Bestseller</span>
           </div>
        )}

        {/* Quick Wishlist */}
        <button 
          onClick={handleAddToWishlist}
          className="absolute top-6 right-6 z-20 text-white/20 hover:text-white transition-colors"
        >
          <Heart size={18} strokeWidth={1} fill={inWishlist ? "currentColor" : "none"} className={inWishlist ? "text-white" : ""} />
        </button>
      </div>

      {/* Product Information - Aligned & Minimal */}
      <div className="mt-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-3xl font-serif text-white tracking-tight leading-none group-hover:italic transition-all duration-700">
            {product.name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-mono italic">
            {product.tagline || "Premium Perfumes"}
          </p>
        </div>

        {/* Size Selector - Editorial Underline Style */}
        <div className="flex gap-8 pt-4 border-t border-white/5">
          {product.sizeOptions.map((size) => (
            <button
              key={size.size}
              onClick={(e) => handleSizeSelect(e, size.size)}
              className={`text-[9px] uppercase tracking-[0.4em] pb-2 relative transition-colors ${
                selectedSize === size.size ? "text-white" : "text-white/20 hover:text-white/40"
              }`}
            >
              {size.size}ml
              {selectedSize === size.size && (
                <motion.div 
                  layoutId={`activeSize-${product.id}`}
                  className="absolute bottom-0 left-0 w-full h-px bg-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Action Area */}
        <div className="grid grid-cols-2 gap-3 pt-4 lg:hidden">
          <Button
            onClick={handleBuyNow}
            className="h-11 bg-white text-black text-[8px] uppercase tracking-[0.2em] font-bold rounded-none"
          >
            Buy Now
          </Button>
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="h-11 border-white/20 text-white text-[8px] uppercase tracking-[0.2em] font-bold rounded-none hover:bg-white/5"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )
}


