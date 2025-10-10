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
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { useToast } from "@/components/ui/use-toast"
import Footer from "@/src/app/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import Cart from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "@/src/lib/cartStore"

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
    handleAddToCart()
    router.push("/checkout")
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
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black"
    >
      <SimpleNavbar />

      {/* Update container max width and padding */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center text-sm text-gray-400  mt-8 sm:mt-2  mb-6"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/collection" className="hover:text-white transition-colors">
            Collection
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">{product.name}</span>
        </motion.div>

        {/* Main Product Section - Update grid columns */}
        <div className="relative">
          {/* Background Glass Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-white/5 backdrop-blur-md border border-white/10"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-4 lg:p-8">
            {/* Product Images - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full space-y-4"
            >
              {/* Main Image - Updated to fit edge to edge */}
              <div
                className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 backdrop-blur-md border border-white/20 shadow-lg group cursor-pointer"
                onClick={() => setIsFullscreenGallery(true)}
              >
                <Image
                  src={imagesForSelectedSize[currentImage]}
                  alt={`${product.name} ${selectedSize} - ${imageLabels[currentImage]}`}
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge className="bg-white text-black hover:bg-gray-200 px-3 py-1 text-xs rounded-full font-medium">
                        NEW
                      </Badge>
                    </motion.div>
                  ) : ''}
                  {product.isBestseller ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Badge className="bg-gray-800 text-white hover:bg-gray-700 px-3 py-1 text-xs rounded-full font-medium">
                        BESTSELLER
                      </Badge>
                    </motion.div>
                  ) : ''}
                  {product.isLimited ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Badge className="bg-gray-600 text-white hover:bg-gray-500 px-3 py-1 text-xs rounded-full font-medium">
                        LIMITED EDITION
                      </Badge>
                    </motion.div>
                  ) : ''}
                  {product.discount ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Badge className="bg-black text-white hover:bg-gray-900 px-3 py-1 text-xs rounded-full font-medium">
                        {product.discount}% OFF
                      </Badge>
                    </motion.div>
                  ) : ''}
                </div>

                {/* Wishlist Button - Fixed Position */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToWishlist()
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 ${isInWishlist(product.id.toString()) ? "bg-white text-black" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${isInWishlist(product.id.toString()) ? "text-red-500 fill-red-500 scale-110" : "scale-100"
                      }`}
                  />
                </motion.button>

                {/* Size Badge */}
                <div className="absolute bottom-4 right-4 z-10">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                    <Badge className="bg-black/70 hover:bg-black text-white px-4 py-2 text-sm rounded-full font-bold backdrop-blur-sm">
                      {selectedSize}
                    </Badge>
                  </motion.div>
                </div>

                {/* Fullscreen indicator */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Navigation Arrows */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-300"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>

              {/* Thumbnail Grid - Updated spacing */}
              <div className="grid grid-cols-4 gap-4 px-1">
                {imagesForSelectedSize.map((image, index) => (
                  <motion.button
                    key={`${selectedSize}-thumb-${index}`}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${currentImage === index
                      ? "ring-2 ring-white/80 scale-105 z-10"
                      : "ring-1 ring-white/20 hover:ring-white/40"
                      }`}
                    onClick={() => setCurrentImage(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${imageLabels[index]}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                        {imageLabels[index]}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Details - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full flex flex-col"
            >
              {/* Product Title and Tagline */}
              <div className="mb-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {product.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-gray-300"
                >
                  {product.tagline}
                </motion.p>
              </div>

              {/* Rating and Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col md:flex-row md:items-center justify-between mb-8"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.svg
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + star * 0.1 }}
                        className={`h-5 w-5 ${star <= Math.round(product.rating) ? "text-white fill-white" : "text-gray-600"
                          }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.934l-6.18 3.254 1.18-6.875L.5 7.938l6.902-1.004L10 .79l2.598 6.144 6.902  1.004-4.5 4.375 1.18 6.875L10 15.934z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-300">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2 text-white">
                  ₹{product.sizeOptions.find((s) => s.size === selectedSize)?.price || product.price}
                </div>
              </motion.div>

              {/* Size Selection - Always Buttons, Responsive */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3 text-gray-200 uppercase tracking-wider">
                  Select Size
                </h3>
                <div className="flex gap-4 flex-col xs:flex-row sm:flex-row">
                  {product.sizeOptions.map((option, index) => (
                    <button
                      key={option.size}
                      onClick={() => {
                        setSelectedSize(option.size)
                        setCurrentImage(0)
                      }}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-300 text-base font-bold ${selectedSize === option.size
                        ? "border-white bg-white/10 text-white"
                        : "border-gray-600 text-gray-300 hover:border-gray-400"
                        }`}
                      style={{ minWidth: 100 }}
                    >
                      <div>{option.size}</div>
                      <div className="text-sm font-normal">₹{option.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mb-8"
              >
                <h3 className="text-sm font-medium mb-4 text-gray-200 uppercase tracking-wider">Fragrance Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["top", "heart", "base"].map((noteType, index) => (
                    <motion.div
                      key={noteType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="rounded-xl p-4 text-white bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <h4 className="text-xs uppercase mb-2 opacity-80 font-medium">
                        {noteType === "top" ? "Top Notes" : noteType === "heart" ? "Heart Notes" : "Base Notes"}
                      </h4>
                      <ul className="space-y-1">
                        {product.notes[noteType as keyof typeof product.notes].map(
                          (note: string, noteIndex: number) => (
                            <motion.li
                              key={noteIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2 + index * 0.1 + noteIndex * 0.05 }}
                              className="text-sm font-medium"
                            >
                              {note}
                            </motion.li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Product Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">High Concentration</h4>
                    <p className="text-sm text-gray-300">25% Perfume Oil</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">Long Lasting</h4>
                    <p className="text-sm text-gray-300">8+ hours longevity</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="mb-8"
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-300">{product.description}</p>
                  <AnimatePresence>
                    {showFullDescription && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-white flex items-center text-sm font-medium hover:text-gray-300 transition-colors"
                >
                  {showFullDescription ? "Show Less" : "Read More"}
                  {showFullDescription ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </motion.button>
              </motion.div>

              {/* Quantity Selector and Add to Cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden flex justify-between items-center">
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="p-4 w-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-6 w-6 text-white" />
                    </motion.button>
                    <div className="px-8 py-4 min-w-[80px] text-center font-bold text-2xl text-white">
                      {quantity}
                    </div>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 w-20 transition-colors flex justify-center"
                    >
                      <Plus className="h-6 w-6 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Updated Cart and Buy Now Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 px-4">
                  <motion.button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 px-6 rounded-xl flex items-center justify-center font-medium text-black bg-white hover:bg-gray-200 relative overflow-hidden transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isAnimating}
                  >
                    {isAnimating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        ADDING TO CART...
                      </span>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        ADD TO CART
                      </>
                    )}

                    {isAnimating && (
                      <motion.span
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          scale: [1, 1.5, 1.8],
                          opacity: [0.7, 0.5, 0],
                        }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-6 rounded-xl flex items-center justify-center font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BUY NOW
                  </motion.button>
                </div>
              </motion.div>

              {/* Layering Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mb-8 p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                <div className="flex items-center mb-4">
                  <Sparkles className="h-5 w-5 mr-2 text-white" />
                  <h3 className="font-medium text-white">Perfect Layering Combinations</h3>
                </div>
                <div className="space-y-4">
                  {product.layeringOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7 + index * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <div>
                        <span className="font-medium text-white">{option.name}</span>
                        <p className="text-xs text-gray-300">{option.description}</p>
                      </div>
                      <Link href={`/product/${option.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-white text-black hover:bg-gray-200 transition-colors"
                        >
                          VIEW
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/layering">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-white text-white hover:bg-white hover:text-black transition-colors"
                    >
                      EXPLORE ALL LAYERING OPTIONS
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Product Details Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
                className="mb-8"
              >
                <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
                  {["specifications", "ingredients", "how-to-apply", "warnings", "storage"].map((tab, index) => (
                    <motion.button
                      key={tab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-gray-200"
                        }`}
                    >
                      {tab.replace("-", " ")}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "specifications" && (
                    <motion.div
                      key="specifications"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 border-b border-gray-700 pb-2">
                            <div className="font-medium capitalize text-gray-300">{key.replace("_", " ")}</div>
                            <div className="text-white">{value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "ingredients" && (
                    <motion.div
                      key="ingredients"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="mb-4 text-gray-300">Our fragrances are crafted with the finest ingredients:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.ingredients.map((ingredient, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center p-2 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <Check className="h-4 w-4 mr-2 text-white" />
                            <span className="text-sm text-gray-300">{ingredient}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "how-to-apply" && (
                    <motion.div
                      key="how-to-apply"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3">How to Apply Your Fragrance</h4>
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start p-3 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white">
                              1
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Apply to Pulse Points</h5>
                              <p className="text-sm text-gray-300">
                                Spray on wrists, neck, behind ears, and inside elbows where blood vessels are close to
                                the skin.
                              </p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start p-3 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white">
                              2
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Don't Rub</h5>
                              <p className="text-sm text-gray-300">
                                Let the fragrance dry naturally. Rubbing can break down the fragrance molecules.
                              </p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start p-3 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white">
                              3
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Layer for Intensity</h5>
                              <p className="text-sm text-gray-300">
                                For stronger scent, apply to clothing or hair from 6 inches away.
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "warnings" && (
                    <motion.div
                      key="warnings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3">Important Warnings</h4>
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">
                              For external use only. Avoid contact with eyes.
                            </span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Discontinue use if skin irritation occurs.</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Keep away from heat, sparks, and open flames.</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Keep out of reach of children and pets.</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "storage" && (
                    <motion.div
                      key="storage"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3">Storage Advice</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Thermometer className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Temperature</h5>
                            </div>
                            <p className="text-sm text-gray-300">
                              Store in a cool place, ideally between 15-20°C (59-68°F).
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Sun className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Light</h5>
                            </div>
                            <p className="text-sm text-gray-300">Keep away from direct sunlight and UV rays.</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Droplets className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Humidity</h5>
                            </div>
                            <p className="text-sm text-gray-300">
                              Avoid humid areas like bathrooms. Store in dry conditions.
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Package className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Original Box</h5>
                            </div>
                            <p className="text-sm text-gray-300">Keep in original packaging when not in use.</p>
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                        >
                          <div className="flex items-start">
                            <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-white mb-1">Pro Tip</h5>
                              <p className="text-sm text-gray-300">
                                Properly stored fragrances can last 3-5 years. Always cap tightly after use to prevent
                                evaporation.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Share Button - Fixed Position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">SHARE</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* You May Also Like Section - Update layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 lg:mt-24"
        >
          <h2 className="text-2xl font-bold mb-8 text-white px-4">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {recommendations.map((perfume, index) => (
              <motion.div
                key={perfume.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
                onClick={() => router.push(`/product/${perfume.id}`)}
              >
                {/* Image Container - Update sizing */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
                  <Image
                    src={perfume.images["30"][0]}
                    alt={perfume.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>

                {/* Product Info - Update spacing */}
                <div className="mt-4 space-y-2 px-2">
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white">{perfume.name}</h3>
                  <p className="text-xs sm:text-sm text-white/80">{perfume.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-white">₹{perfume.price}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-3 w-3 ${star <= Math.round(perfume.rating) ? "text-white fill-white" : "text-gray-600"
                            }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.934l-6.18 3.254 1.18-6.875L.5 7.938l6.902-1.004L10 .79l2.598 6.144 6.902  1.004-4.5 4.375 1.18 6.875L10 15.934z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreenGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <div className="absolute top-4 right-4 z-10">
              <motion.button
                onClick={() => setIsFullscreenGallery(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {imagesForSelectedSize.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-2 h-2 rounded-full ${currentImage === index ? "bg-white" : "bg-white/40"
                    } transition-colors duration-200`}
                />
              ))}
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <motion.button
                onClick={handlePrevImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <motion.button
                onClick={handleNextImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="flex flex-col items-center max-w-[90vw] max-h-[90vh]">
              <div className="relative w-full h-full">
                <Image
                  src={imagesForSelectedSize[currentImage]}
                  alt={`${product.name} ${selectedSize} - ${imageLabels[currentImage]}`}
                  width={1200}
                  height={1200}
                  className="object-contain w-full h-full transform scale-110 transition-transform duration-500"
                />
              </div>
              <p className="text-white mt-4 text-lg font-medium">{imageLabels[currentImage]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart />

      <Footer />
    </motion.div>
  )
}
