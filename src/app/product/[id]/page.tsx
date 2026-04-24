"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  Share2,
  Minus,
  Plus,
  Droplets,
  Clock,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Thermometer,
  Sun,
  Package,
  Maximize2,
  ChevronLeft,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { useToast } from "@/components/ui/use-toast"
import Footer from "@/src/app/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import Cart from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "@/src/lib/cartStore"
import EnhancedProductCard from "@/src/app/components/EnhancedProductCard"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState("30")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false)
  const { addItem, setIsOpen } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  // Find the current product based on the ID in the URL
  const productId = params.id
  const product = ProductInfo.allProductItems.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Product not found</p>
      </div>
    )
  }

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist")
      if (storedWishlist) {
        const wishlist = JSON.parse(storedWishlist)
        setIsWishlisted(wishlist.includes(product.id))
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
  }, [product.id])

  // Handle keyboard navigation in fullscreen gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreenGallery) return

      if (e.key === "Escape") {
        setIsFullscreenGallery(false)
      } else if (e.key === "ArrowRight") {
        handleNextImage()
      } else if (e.key === "ArrowLeft") {
        handlePrevImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreenGallery, currentImage])

  // Prevent body scroll when fullscreen gallery is open
  useEffect(() => {
    if (isFullscreenGallery) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreenGallery])

  const handleNextImage = () => {
    const images = product.images[selectedSize as "30" | "50"]
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = () => {
    const images = product.images[selectedSize as "30" | "50"]
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    try {
      setIsAnimating(true)

      setTimeout(() => {
        const sizeOption = product.sizeOptions.find((s) => s.size === selectedSize)
        const price = sizeOption ? sizeOption.price : product.price
        const cartItem = {
          id: product.id.toString(),
          name: product.name,
          price: price,
          image: product.images[selectedSize as "30" | "50"][0],
          quantity: quantity,
          size: selectedSize,
          type: "single",
          images: product.images
        }
        addItem(cartItem)

        toast({
          title: "Added to Cart",
          description: `${quantity} × ${product.name} (${selectedSize}ml) has been added to your cart.`,
        })

        setIsOpen(true)
        setIsAnimating(false)
      }, 800)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setIsAnimating(false)
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = () => {
    // Redirect with single item params, forcing quantity to 1 as requested
    router.push(`/checkout?productId=${product.id}&size=${selectedSize}&quantity=1`)
  }

  const handleAddToWishlist = () => {
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

  // Update the share function to include the current URL and handle more share methods
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        // Use native share if available (mobile devices)
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard with enhanced feedback
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied!",
          description: "Share link has been copied to your clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "Please try copying the URL manually",
        variant: "destructive"
      })
    }
  }

  // Filter out the current product from recommendations
  const recommendations = ProductInfo.allProductItems.filter((p) => p.id !== product.id).slice(0, 4)

  // Image labels for better context
  const imageLabels = ["Front View", "Side View", "Back View", "Label"]

  // Compute images for the selected size (3 bottle images + 1 label image)
  const imagesForSelectedSize = [
    ...product.images[selectedSize as "30" | "50"],
    product.images.label
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-zinc-950 text-white font-mono selection:bg-white/10"
    >
      <SimpleNavbar />

      <div className="container mx-auto px-6 py-32 max-w-7xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center text-[9px] uppercase tracking-[0.3em] text-white/30 mb-12"
        >
          <Link href="/" className="hover:text-white transition-colors">Registry</Link>
          <ChevronRight className="h-3 w-3 mx-3 text-white/10" />
          <Link href="/collection" className="hover:text-white transition-colors">Collection</Link>
          <ChevronRight className="h-3 w-3 mx-3 text-white/10" />
          <span className="text-white/60">{product.name}</span>
        </motion.div>

        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 relative">
          
          {/* Gallery Section - Left */}
          <div className="w-full lg:w-[55%] shrink-0 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative aspect-[4/5] bg-zinc-900 border border-white/5 overflow-hidden group cursor-crosshair"
              onClick={() => setIsFullscreenGallery(true)}
            >
              <Image
                src={imagesForSelectedSize[currentImage]}
                alt={`${product.name} - ${imageLabels[currentImage]}`}
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                priority
              />

              {/* Badges - Editorial Style */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-white text-black text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1 shadow-2xl">New Arrival</span>
                )}
                {product.isBestseller && (
                  <span className="bg-zinc-900/80 backdrop-blur-sm text-white text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1 border border-white/10">Bestseller</span>
                )}
              </div>

              {/* Wishlist Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToWishlist()
                }}
                className="absolute top-6 right-6 z-10 p-3 bg-zinc-950/50 backdrop-blur-sm border border-white/10 hover:bg-white hover:text-black transition-all duration-500 group/heart"
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id.toString()) ? 'fill-current text-red-500' : 'text-white'}`} />
              </button>

              {/* Image Navigation - Sharp Minimal Controls */}
              <div className="absolute bottom-6 left-6 flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity duration-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="p-3 bg-zinc-950/80 border border-white/10 hover:bg-white hover:text-black transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="p-3 bg-zinc-950/80 border border-white/10 hover:bg-white hover:text-black transition-all"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Counter */}
              <div className="absolute bottom-6 right-6 bg-zinc-950/80 border border-white/10 px-4 py-2 text-[10px] tracking-[0.4em] text-white/60">
                {currentImage + 1} / {imagesForSelectedSize.length}
              </div>
            </motion.div>

            {/* Thumbnails - Sharp Layout */}
            <div className="grid grid-cols-4 gap-4">
              {imagesForSelectedSize.map((image, index) => (
                <button
                  key={`thumb-${index}`}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-[3/4] border transition-all duration-500 overflow-hidden ${
                    currentImage === index ? "border-white" : "border-white/5 grayscale group-hover:grayscale-0"
                  }`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
            {/* Product Details - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 flex flex-col"
            >
              {/* Product Header */}
              <div className="mb-10">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-5xl md:text-6xl font-serif text-white tracking-tight"
                  >
                    {product.name}
                  </motion.h1>
                  <button onClick={handleShare} className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <Share2 className="h-4 w-4 text-white/40" />
                  </button>
                </div>
                <p className="text-[12px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">{product.tagline}</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-serif text-white">
                    ₹{product.sizeOptions.find((s) => s.size === selectedSize)?.price || product.price}
                  </span>
                  {product.discount && (
                    <span className="text-sm font-mono text-white/20 line-through tracking-widest">
                      ₹{Math.round(product.price * 1.2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Composition Matrix (Notes) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 mb-12">
                {["top", "heart", "base"].map((noteType) => (
                  <div key={noteType} className="bg-zinc-950 p-6">
                    <h4 className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/20 mb-4">{noteType} composition</h4>
                    <ul className="space-y-2">
                       {product.notes[noteType as keyof typeof product.notes].map((note: string, idx: number) => (
                         <li key={idx} className="text-[10px] uppercase tracking-widest text-white/60 font-light">{note}</li>
                       ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Selection Interface */}
              <div className="space-y-12 mb-12">
                {/* Size Interface */}
                <div>
                   <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-6">Choose Volume</label>
                   <div className="flex gap-4">
                      {product.sizeOptions.map((option) => (
                        <button
                          key={option.size}
                          onClick={() => { setSelectedSize(option.size); setCurrentImage(0); }}
                          className={`flex-1 h-20 border transition-all duration-700 font-serif flex flex-col items-center justify-center gap-1 ${
                            selectedSize === option.size 
                              ? "bg-white text-black border-white" 
                              : "border-white/10 text-white/40 hover:border-white/30"
                          }`}
                        >
                          <span className="text-xl">{option.size}ML</span>
                          <span className={`text-[8px] uppercase tracking-widest ${selectedSize === option.size ? 'text-black/40' : 'text-white/20'}`}>
                            Valuation Available
                          </span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Quantitative Interface */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-40">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-6">Quantity</label>
                    <div className="h-14 border border-white/10 flex items-center justify-between px-2">
                       <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-2 hover:text-white text-white/20 transition-colors">
                        <Minus size={14} />
                       </button>
                       <span className="font-serif text-lg">{quantity < 10 ? `0${quantity}` : quantity}</span>
                       <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-white text-white/20 transition-colors">
                        <Plus size={14} />
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex gap-4 h-14">
                      <Button
                        onClick={handleAddToCart}
                        className="flex-1 border border-white/10 bg-transparent hover:bg-white/5 text-white rounded-none text-[10px] uppercase tracking-[0.3em] font-bold h-full"
                        disabled={isAnimating}
                      >
                         {isAnimating ? "Adding to Cart..." : "Acquire Essence"}
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold h-full shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editorial Description */}
              <div className="space-y-6 pt-12 border-t border-white/5">
                <div className="prose prose-sm prose-invert max-w-none">
                   <p className="text-sm font-light leading-relaxed text-white/50 first-letter:text-4xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-white">
                      {product.description}
                   </p>
                </div>
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[9px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors flex items-center gap-2"
                >
                  {showFullDescription ? "Contract Information" : "Manifest Details"}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-500 ${showFullDescription ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showFullDescription && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-xs font-light leading-relaxed text-white/30 pt-4" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        {/* Global Specification Matrix */}
        <div className="mt-32 border-t border-white/5 pt-20">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="flex bg-transparent border-b border-white/5 w-full justify-start rounded-none h-auto p-0 mb-16 gap-12 overflow-x-auto">
              {["specifications", "ingredients", "protocol", "warnings", "storage"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/30 text-[9px] uppercase tracking-[0.4em] font-bold h-14 px-0 transition-all hover:text-white/60 whitespace-nowrap"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="specifications" className="focus-visible:ring-0">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <h3 className="text-2xl font-serif text-white">Technical Attributes</h3>
                     <div className="divide-y divide-white/5 border-t border-white/5">
                        {[
                          { label: 'Concentration', value: '25% Pure Perfume Oil' },
                          { label: 'longevity', value: '8 - 12 Hours' },
                          { label: 'Sillage', value: 'Moderate - High' },
                          { label: 'Origin', value: 'Grasse, France' }
                        ].map((spec) => (
                          <div key={spec.label} className="py-4 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest text-white/30">{spec.label}</span>
                            <span className="text-[11px] text-white/80">{spec.value}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 p-8 flex items-center justify-center">
                     <div className="text-center space-y-4">
                        <Droplets className="h-8 w-8 mx-auto text-white/20" strokeWidth={1} />
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 max-w-[200px] leading-relaxed">
                          Hand-poured in small batches to preserve molecular integrity.
                        </p>
                     </div>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="ingredients" className="focus-visible:ring-0">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-serif text-white mb-8">Molecular Composition</h3>
                <p className="text-sm font-light leading-[2] text-white/50 tracking-wide">
                  {product.ingredients || "Alcohol Denat., Fragrance (Parfum), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Benzyl Benzoate, Citral, Eugenol, Benzyl Alcohol."}
                </p>
                <div className="mt-12 p-8 border border-dashed border-white/10 opacity-60">
                   <p className="text-[9px] uppercase tracking-widest text-center leading-loose">
                     Our fragrances are vegan, cruelty-free, and formulated without parabens or phthalates. 
                     Full safety registry available upon request.
                   </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protocol" className="focus-visible:ring-0">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'Application', desc: 'Pulse points - neck, wrists, inner elbows. Do not rub.' },
                    { title: 'Layering', desc: 'Apply heavier scents first, followed by lighter molecules.' },
                    { title: 'Enhancement', desc: 'Apply to hydrated skin for maximum scent retention.' }
                  ].map((item, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 p-8 space-y-4">
                       <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">{item.title}</h4>
                       <p className="text-xs font-light text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </TabsContent>
            
            <TabsContent value="warnings" className="focus-visible:ring-0">
               <div className="bg-red-500/5 border border-red-500/10 p-10 max-w-2xl">
                  <h3 className="text-xl font-serif text-red-500/80 mb-6 flex items-center gap-3">
                    <AlertTriangle size={20} /> Safety Protocol
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'For external application only.',
                      'Keep away from flammable sources.',
                      'Store away from direct solar exposure.',
                      'Discontinue if biological reaction occurs.'
                    ].map((txt, i) => (
                      <li key={i} className="text-xs text-white/40 flex gap-4">
                        <span className="text-white/10">0{i+1}</span> {txt}
                      </li>
                    ))}
                  </ul>
               </div>
            </TabsContent>

            <TabsContent value="storage" className="focus-visible:ring-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Thermometer, label: 'Temperature', val: '15-20°C' },
                    { icon: Sun, label: 'Environment', val: 'Darkness' },
                    { icon: Droplets, label: 'Condition', val: 'Dry' },
                    { icon: Package, label: 'Safety', val: 'Capped' }
                  ].map((item, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 p-8 text-center space-y-4 transition-all hover:bg-zinc-800">
                       <item.icon className="h-5 w-5 mx-auto text-white/20" strokeWidth={1.5} />
                       <div>
                         <p className="text-[8px] uppercase tracking-[0.3em] text-white/20">{item.label}</p>
                         <p className="text-[12px] text-white/80 mt-1">{item.val}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Discovery Matrix Cross-Sell */}
        <div className="mt-40">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-2 gap-8">
             <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-[0.5em] text-white/20">System Recommendations</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-none">Complements</h2>
             </div>
             <Link href="/collection" className="text-[9px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all border-b border-white/10 pb-2 flex items-center gap-4 group">
                Observe Entire Collection
                <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
             </Link>
           </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
              {recommendations.map((p) => (
                <EnhancedProductCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={(prod, qty) => {
                    const price = prod.sizeOptions[0].price;
                    addItem({
                      id: prod.id.toString(),
                      name: prod.name,
                      price: price,
                      image: prod.images["30"][0],
                      quantity: qty,
                      size: "30",
                      type: "single",
                      images: prod.images
                    });
                    setIsOpen(true);
                  }}
                  onAddToWishlist={() => {
                    if (isInWishlist(p.id.toString())) {
                      removeFromWishlist(p.id.toString());
                    } else {
                      addToWishlist({
                        id: p.id.toString(),
                        name: p.name,
                        price: p.price,
                        image: p.images["30"][0],
                        slug: p.slug
                      });
                    }
                  }}
                  inWishlist={isInWishlist(p.id.toString())}
                  selectedSize="30"
                  onSizeSelect={() => {}} // Simple mock for recommendations
                />
              ))}
            </div>
        </div>
      </div>

      {/* Fullscreen Gallery Interface */}
      <AnimatePresence>
        {isFullscreenGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center overflow-hidden"
            onClick={() => setIsFullscreenGallery(false)}
          >
            {/* Close button */}
            <button 
              onClick={() => setIsFullscreenGallery(false)}
              className="absolute top-6 right-6 p-3 text-white/60 hover:text-white transition-all z-[80] bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-[80] text-[11px] tracking-[0.4em] text-white/40 font-mono">
              {currentImage + 1} / {imagesForSelectedSize.length}
            </div>

            {/* Main Image — plain img avoids next/image fill collapse inside AnimatePresence */}
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center w-full px-16"
              onClick={(e) => e.stopPropagation()}
              style={{ height: "80vh" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagesForSelectedSize[currentImage]}
                alt={`${product.name} — image ${currentImage + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </motion.div>

            {/* Navigation arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-[70] pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="pointer-events-auto p-4 bg-white/5 hover:bg-white/15 border border-white/10 transition-all backdrop-blur-sm"
              >
                <ArrowLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="pointer-events-auto p-4 bg-white/5 hover:bg-white/15 border border-white/10 transition-all backdrop-blur-sm"
              >
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Thumbnail strip at the bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-[70]" onClick={(e) => e.stopPropagation()}>
              {imagesForSelectedSize.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-12 h-12 border overflow-hidden transition-all duration-300 ${idx === currentImage ? "border-white opacity-100" : "border-white/10 opacity-40 hover:opacity-70"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <Footer />
    </motion.div>
  )
}
