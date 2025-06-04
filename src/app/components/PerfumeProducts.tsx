/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, ShoppingCart, Star, ThumbsUp, X, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import ProductCard from "./ProductCard"

const perfumes = [
  {
    id: 1,
    name: "Havoc",
    price: 350,
    images: ["/img/havoc50.png", "/img/havoc_1.jpg", "/img/havoc_2.jpg", "/img/havoc_3.jpg", "/img/havoc_4.jpg"],
    image: "/img/havoc50.png",
    description: "A fresh and invigorating scent with notes of citrus and ocean breeze.",
    rating: 4.8,
    reviews: 124,
    related: [2, 5],
    tags: ["fresh", "citrus", "summer"],
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: null,
    offers: ["Buy 2 get 1 free sample", "Free shipping on orders above ₹1000", "10% off on your next purchase"],
  },
  {
    id: 2,
    name: "Lavior",
    price: 350,
    images: ["/img/lavior50.png", "/img/lavior_1.jpg", "/img/lavior_2.jpg", "/img/lavior_3.jpg", "/img/lavior_4.jpg"],
    image: "/img/lavior50.png",
    description: "A luxurious floral fragrance with hints of lavender and vanilla.",
    rating: 4.7,
    reviews: 98,
    related: [1, 4],
    tags: ["floral", "lavender", "elegant"],
    isNew: false,
    isBestseller: false,
    isLimited: true,
    discount: 15,
    offers: ["Limited edition gift box available", "Free shipping on orders above ₹1000"],
  },
  {
    id: 3,
    name: "Duskfall",
    price: 350,
    images: [
      "/img/duskfall50.png",
      "/img/duskfall_1.jpg",
      "/img/duskfall_2.jpg",
      "/img/duskfall_3.jpg",
      "/img/duskfall_4.jpg",
    ],
    image: "/img/duskfall50.png",
    description: "A mysterious and alluring scent perfect for evening wear.",
    rating: 4.9,
    reviews: 156,
    related: [5, 2],
    tags: ["woody", "evening", "mysterious"],
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: null,
    offers: ["Buy 2 get 1 free sample", "Free shipping on orders above ₹1000"],
  },
  {
    id: 4,
    name: "Euphoria",
    price: 350,
    images: [
      "/img/euphoria50.png",
      "/img/euphoria_1.jpg",
      "/img/euphoria_2.jpg",
      "/img/euphoria_3.jpg",
      "/img/euphoria_4.jpg",
    ],
    image: "/img/euphoria50.png",
    description: "An exhilarating blend of fruity and floral notes that lifts your spirits.",
    rating: 4.6,
    reviews: 87,
    related: [2, 1],
    tags: ["fruity", "floral", "uplifting"],
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: 10,
    offers: ["New launch special: Free gift with purchase", "Free shipping on orders above ₹1000"],
  },
  {
    id: 5,
    name: "Oceane",
    price: 350,
    images: ["/img/oceane50.png", "/img/oceane_1.jpg", "/img/oceane_2.jpg", "/img/oceane_3.jpg", "/img/oceane_4.jpg"],
    image: "/img/oceane50.png",
    description: "A deep, aquatic fragrance that evokes the mystery of the ocean.",
    rating: 4.8,
    reviews: 112,
    related: [1, 3],
    tags: ["aquatic", "fresh", "deep"],
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: null,
    offers: ["New launch special: Free gift with purchase", "Free shipping on orders above ₹1000"],
  },
]

interface Perfume {
  id: number
  name: string
  price: number
  images: string[]
  image: string
  description: string
  rating?: number
  reviews?: number
  related?: number[]
  tags?: string[]
  isNew?: boolean
  isBestseller?: boolean
  isLimited?: boolean
  discount?: number | null
  offers?: string[]
}

interface PerfumeProductsProps {
  addToCart: (perfume: Perfume, quantity: number, size: string) => void
  addToWishlist: (perfume: Perfume) => void
}

export default function PerfumeProducts({ addToCart, addToWishlist }: PerfumeProductsProps) {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null)
  const [selectedSize, setSelectedSize] = useState("30ml")
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [slideInterval, setSlideInterval] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const handleAddToCart = () => {
    if (selectedPerfume) {
      addToCart(selectedPerfume, quantity, selectedSize)
      setSelectedPerfume(null)
      setQuantity(1)
    }
  }

  const handleAddToWishlist = () => {
    if (selectedPerfume) {
      addToWishlist(selectedPerfume)
    }
  }

  const handleBuyNow = () => {
    if (selectedPerfume) {
      // Add to cart first
      addToCart(selectedPerfume, quantity, selectedSize)
      // Then redirect to checkout
      router.push('/checkout')
    }
  }

  const handleWhatsAppBuy = () => {
    if (selectedPerfume) {
      const price = selectedSize === "30ml" ? 350 : 450
      const totalPrice = price * quantity
      const message = `Hi, I'm interested in buying ${quantity} ${selectedPerfume.name} (${selectedSize}) for Rs. ${totalPrice}. Can you provide more details?`
      const encodedMessage = encodeURIComponent(message)
      window.location.href = `https://wa.me/919328701508?text=${encodedMessage}`
    }
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handlePerfumeSelect = (perfume: Perfume) => {
    setSelectedPerfume(perfume)
    setCurrentImageIndex(0)
    setQuantity(1)

    // Start slideshow
    if (slideInterval) clearInterval(slideInterval)
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % (perfume.images.length || 1))
    }, 3000)
    setSlideInterval(interval)
  }

  const handleModalClose = () => {
    if (slideInterval) clearInterval(slideInterval)
    setSelectedPerfume(null)
  }

  const getRelatedPerfumes = (perfume: Perfume) => {
    if (!perfume.related) return []
    return perfumes.filter(p => perfume.related?.includes(p.id))
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Our Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {perfumes.map((perfume) => (
          <ProductCard
            key={perfume.id}
            product={perfume}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            onQuickView={handlePerfumeSelect}
          />
        ))}
      </div>
      
      <AnimatePresence>
        {selectedPerfume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPerfume.name}</h3>
                <button 
                  onClick={handleModalClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Images */}
                <div>
                  {/* Main Image */}
                  <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={selectedPerfume.images[currentImageIndex] || "/placeholder.svg"}
                      alt={selectedPerfume.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-5 gap-2">
                    {selectedPerfume.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                          currentImageIndex === index 
                            ? "border-accent" 
                            : "border-transparent"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${selectedPerfume.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right column - Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{selectedPerfume.rating || 4.5}</span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({selectedPerfume.reviews || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>98% recommend</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedPerfume.isNew && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium rounded-full">
                        New Arrival
                      </span>
                    )}
                    {selectedPerfume.isBestseller && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-medium rounded-full">
                        Bestseller
                      </span>
                    )}
                    {selectedPerfume.isLimited && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium rounded-full">
                        Limited Edition
                      </span>
                    )}
                    {selectedPerfume.tags?.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedPerfume.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline mb-6">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{selectedPerfume.price}
                    </span>
                    {selectedPerfume.discount && (
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ₹{Math.round(selectedPerfume.price * (100 / (100 - selectedPerfume.discount)))}
                      </span>
                    )}
                    {selectedPerfume.discount && (
                      <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                        Save {selectedPerfume.discount}%
                      </span>
                    )}
                  </div>

                  {/* Offers */}
                  {selectedPerfume.offers && selectedPerfume.offers.length > 0 && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Available Offers</h4>
                      <ul className="space-y-2">
                        {selectedPerfume.offers.map((offer, index) => (
                          <li key={index} className="flex items-start text-sm text-green-700 dark:text-green-400">
                            <span className="mr-2">•</span>
                            {offer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Size Selection */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Select Size</h4>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedSize("30ml")}
                        className={`flex-1 py-2 rounded-lg border ${
                          selectedSize === "30ml" 
                            ? "border-accent bg-accent/10 text-accent" 
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        30ml - ₹350
                      </button>
                      <button
                        onClick={() => setSelectedSize("50ml")}
                        className={`flex-1 py-2 rounded-lg border ${
                          selectedSize === "50ml" 
                            ? "border-accent bg-accent/10 text-accent" 
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        50ml - ₹450
                      </button>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Quantity</h4>
                    <div className="flex items-center">
                      <button
                        onClick={decreaseQuantity}
                        className="p-2 rounded-l-lg border border-gray-300 dark:border-gray-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 min-w-[60px] text-center">
                        {quantity}
                      </div>
                      <button
                        onClick={increaseQuantity}
                        className="p-2 rounded-r-lg border border-gray-300 dark:border-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center bg-gray-900 dark:bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex items-center justify-center bg-accent text-white px-4 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Buy Now
                    </button>
                  </div>
                  
                  <button
                    onClick={handleWhatsAppBuy}
                    className="w-full flex items-center justify-center bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors mb-6"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01\
\
