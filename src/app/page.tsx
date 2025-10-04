"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, X, ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import dynamic from "next/dynamic"
import Footer from "@/src/app/components/Footer"
import LoyaltyProgram from "@/src/app/components/LoyaltyProgram"
import SpecialOffers from "./components/SpecialOffers"
import EnhancedProductCard from "./components/EnhancedProductCard"
import { useToast } from "@/components/ui/use-toast"
import StoreLocator from "./components/StoreLocator"
import Hero from "./components/Hero"
import Newsletter from "./components/Newsletter"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductInfo } from "@/src/data/product-info"
import PopularCombination from "./components/PopularCombination"
import { useWishlistStore } from "@/src/store/wishlist"
import { motion } from "framer-motion"
import { useCartStore } from "../lib/cartStore"

const SimpleNavbar = dynamic(() => import("@/src/app/components/SimpleNavbar"), { ssr: false })
const Cart = dynamic(() => import("@/src/app/components/Cart"), { ssr: false })

// Popular combinations
const popularCombinations = [
  { fragrance1: "Oceane", fragrance2: "Euphoria", name: "Ocean Bloom", popularity: "95%" },
  { fragrance1: "Duskfall", fragrance2: "Obsession", name: "Dark Mystery", popularity: "92%" },
  { fragrance1: "Lavior", fragrance2: "Mehfil", name: "Royal Spice", popularity: "88%" },
  { fragrance1: "Havoc", fragrance2: "Velora", name: "Fresh Woods", popularity: "85%" },
]

// Function to generate layered fragrance
const generateLayeredFragrance = (perfume1: any, perfume2: any) => {
  if (!perfume1 || !perfume2) return null

  const combinedTopNotes = [...new Set([...perfume1.notes.top, ...perfume2.notes.top])]
  const combinedHeartNotes = [...new Set([...perfume1.notes.heart, ...perfume2.notes.heart])]
  const combinedBaseNotes = [...new Set([...perfume1.notes.base, ...perfume2.notes.base])]

  const descriptions = {
    "Fresh-Oriental": "A captivating blend that opens with fresh citrus and transitions into warm oriental depths",
    "Fresh-Woody": "An invigorating combination of crisp freshness with grounding woody undertones",
    "Fresh-Floral": "A harmonious marriage of zesty freshness and delicate floral elegance",
    "Fresh-Aquatic": "An oceanic symphony combining citrus brightness with aquatic serenity",
    "Fresh-Spicy": "A dynamic fusion of refreshing citrus with exotic spice warmth",
    "Oriental-Woody": "A sophisticated blend of mysterious oriental richness and earthy wood depth",
    "Oriental-Floral": "An enchanting combination of exotic oriental spices with romantic florals",
    "Oriental-Aquatic": "A unique fusion of warm oriental mystique with cool aquatic freshness",
    "Oriental-Spicy": "An intense and luxurious blend of oriental warmth with traditional spices",
    "Woody-Floral": "A balanced composition of earthy wood strength with feminine floral grace",
    "Woody-Aquatic": "An unexpected harmony of grounding woods with refreshing aquatic notes",
    "Woody-Spicy": "A bold and complex blend of rich woods with aromatic spice complexity",
    "Floral-Aquatic": "A dreamy combination of soft florals with crisp aquatic freshness",
    "Floral-Spicy": "An exotic blend of delicate flowers with warm, inviting spices",
    "Aquatic-Spicy": "A surprising fusion of cool ocean breeze with warm spice accents",
  }

  const categoryKey = `${perfume1.category}-${perfume2.category}`
  const reverseKey = `${perfume2.category}-${perfume1.category}`

  const description =
    descriptions[categoryKey as keyof typeof descriptions] ||
    descriptions[reverseKey as keyof typeof descriptions] ||
    "A unique and personalized fragrance that combines the best of both worlds"

  return {
    name: `${perfume1.name} × ${perfume2.name}`,
    description,
    notes: {
      top: combinedTopNotes.slice(0, 6),
      heart: combinedHeartNotes.slice(0, 6),
      base: combinedBaseNotes.slice(0, 6),
    },
  }
}

export interface EnhancedProductCardProps {
  product: ProductInfo.Product
  onAddToCart: (product: ProductInfo.Product, quantity: number) => void
  onAddToWishlist: (product: ProductInfo.Product) => void
  onQuickView: (product: ProductInfo.Product) => void
  onViewDetails: () => void
  inWishlist: boolean
  selectedSize: string
  onSizeSelect: (size: string) => void
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number | string]: string }>({})
  const { addItem, setIsOpen, getTotalItems } = useCartStore()
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  // Layering states
  const [selectedFragrance1, setSelectedFragrance1] = useState<any>(null)
  const [selectedFragrance2, setSelectedFragrance2] = useState<any>(null)
  const [layeredSize, setLayeredSize] = useState<
    "combo-30ml" | "combo-50ml" | "combo-30-50ml" | "combo-50-30ml"
  >("combo-30ml")

  const addLayeredToCart = () => {
    if (!selectedFragrance1 || !selectedFragrance2) return

    // Update the prices and sizes objects in the addLayeredToCart function
    const prices = {
      "combo-30ml": 800,
      "combo-50ml": 1000,
      "combo-30-50ml": 900,
      "combo-50-30ml": 900,
    }

    const sizes = {
      "combo-30ml": "30ml + 30ml",
      "combo-50ml": "50ml + 50ml",
      "combo-30-50ml": "30ml + 50ml",
      "combo-50-30ml": "50ml + 30ml",
    }

    const layeredProduct = {
      id: `layered-${selectedFragrance1.id}-${selectedFragrance2.id}`,
      name: layeredFragrance ? layeredFragrance.name : "Custom Layered Fragrance",
      price: prices[layeredSize],
      image: selectedFragrance1.images["30"][0],
      quantity: 1,
      size: sizes[layeredSize],
      type: "layered",
      fragrances: [selectedFragrance1.name, selectedFragrance2.name],
    }

    addItem(layeredProduct)
    setIsOpen(true)

    toast({
      title: "Added to Cart",
      description: `${layeredFragrance ? layeredFragrance.name : "Layered fragrance"} combo has been added to your cart.`,
    })
  }

  const handleSizeSelect = (productId: number | string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }))
  }

  const addToCart = (product: any, quantity: number, size: string) => {
    try {
      const sizeOption = product.sizeOptions.find((s: any) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id.toString(),
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

  const handleAddToWishlist = (product: ProductInfo.Product) => {
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

  const handleQuickView = (product: any) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const handleViewDetails = (productId: number) => {
    router.push(`/product/${productId}`)
  }

  // Get layered fragrance
  const layeredFragrance = generateLayeredFragrance(selectedFragrance1, selectedFragrance2)

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <SimpleNavbar />
      <Hero />
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Featured Products Section */}
        <section id="featured" className="w-full py-24">
          <div className="container mx-auto px-4 md:px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-serif text-white">Featured Fragrances</h2>
              <div className="w-24 h-1 bg-white mx-auto rounded-full mb-4" />
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover our curated selection of premium fragrances, each crafted to evoke unique emotions and
                memories.
              </p>
            </div>

            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
              {ProductInfo.allProductItems.map((product) => (
                <div key={product.id} className="transform transition-transform duration-300 hover:-translate-y-2">
                  <EnhancedProductCard
                    product={{
                      ...product,
                      images: {
                        ...product.images,
                        label: product.images.label || ""
                      }
                    }}
                    onAddToCart={(product, quantity) =>
                      addToCart(product, quantity, selectedSizes[product.id] || product.sizeOptions[0].size)
                    }
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    inWishlist={isInWishlist(product.id.toString())}
                    selectedSize={selectedSizes[product.id] || product.sizeOptions[0].size}
                    onSizeSelect={(size: string) => handleSizeSelect(product.id, size)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Layering Section */}
        <section className="w-full py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <Card className="bg-black/70 backdrop-blur-md border-white/10 overflow-hidden relative">
                {/* Floating background elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                <CardContent className="p-12 relative z-10">
                  {/* Title */}
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-4 text-white">Layering</h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                      Layer/add two fragrances to make a new fragrance. Mix any two scents to create your unique
                      signature blend.
                    </p>
                  </div>

                  {/* Fragrance Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Fragrance 1 Dropdown */}
                    <div>
                      <label className="block text-lg font-semibold mb-4 text-center">Choose First Fragrance</label>
                      <Select
                        onValueChange={(value) => {
                          const fragrance = ProductInfo.allProductItems.find((f) => f.id.toString() === value)
                          setSelectedFragrance1(fragrance)
                        }}
                      >
                        <SelectTrigger className="w-full h-16 bg-black/40 backdrop-blur-md border-white/20 text-white">
                          <div className="flex items-center space-x-3">
                            {selectedFragrance1 && (
                              <Image
                                src={selectedFragrance1.images["30"][0] || "/placeholder.svg"}
                                alt={selectedFragrance1.name}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            )}
                            <SelectValue placeholder="Select first fragrance" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">
                          {ProductInfo.allProductItems.map((fragrance) => (
                            <SelectItem
                              key={fragrance.id}
                              value={fragrance.id.toString()}
                              className="text-white hover:bg-white/10"
                            >
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={fragrance.images["30"][0] || "/placeholder.svg"}
                                  alt={fragrance.name}
                                  width={30}
                                  height={30}
                                  className="object-contain"
                                />
                                <div>
                                  <div className="font-medium">{fragrance.name}</div>
                                  <div className="text-sm text-gray-400">{fragrance.category}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fragrance 2 Dropdown */}
                    <div>
                      <label className="block text-lg font-semibold mb-4 text-center">Choose Second Fragrance</label>
                      <Select
                        onValueChange={(value) => {
                          const fragrance = ProductInfo.allProductItems.find((f) => f.id.toString() === value)
                          setSelectedFragrance2(fragrance)
                        }}
                      >
                        <SelectTrigger className="w-full h-16 bg-black/40 backdrop-blur-md border-white/20 text-white">
                          <div className="flex items-center space-x-3">
                            {selectedFragrance2 && (
                              <Image
                                src={selectedFragrance2.images["30"][0] || "/placeholder.svg"}
                                alt={selectedFragrance2.name}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            )}
                            <SelectValue placeholder="Select second fragrance" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">
                          {ProductInfo.allProductItems.map((fragrance) => (
                            <SelectItem
                              key={fragrance.id}
                              value={fragrance.id.toString()}
                              className="text-white hover:bg-white/10"
                            >
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={fragrance.images["30"][0] || "/placeholder.svg"}
                                  alt={fragrance.name}
                                  width={30}
                                  height={30}
                                  className="object-contain"
                                />
                                <div>
                                  <div className="font-medium">{fragrance.name}</div>
                                  <div className="text-sm text-gray-400">{fragrance.category}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Generated Fragrance Display */}
                  {layeredFragrance && (
                    <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-xl p-8 mb-8 animate-fadeInUp">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">{layeredFragrance.name}</h3>
                        <p className="text-gray-300">{layeredFragrance.description}</p>
                      </div>

                      {/* Fragrance Notes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-center">Top Notes</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {layeredFragrance.notes.top.map((note: string, idx: number) => (
                              <span key={idx} className="text-xs bg-white/20 px-3 py-1 rounded-full">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-center">Heart Notes</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {layeredFragrance.notes.heart.map((note: string, idx: number) => (
                              <span key={idx} className="text-xs bg-white/20 px-3 py-1 rounded-full">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-center">Base Notes</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {layeredFragrance.notes.base.map((note: string, idx: number) => (
                              <span key={idx} className="text-xs bg-white/20 px-3 py-1 rounded-full">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart for Layered Fragrance */}
                  {layeredFragrance && (
                    <div className="text-center mb-8">
                      <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-xl p-6">
                        <h4 className="text-lg font-semibold mb-4">Add Your Custom Blend to Cart</h4>
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <Select onValueChange={(value) => setLayeredSize(value as "combo-30ml" | "combo-50ml" | "combo-30-50ml" | "combo-50-30ml")} defaultValue="combo-30ml">
                            <SelectTrigger className="w-48 bg-black/40 backdrop-blur-md border-white/20 text-white">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
                              <SelectItem value="combo-30ml" className="text-white hover:bg-white/10">
                                Combo 30ml + 30ml - ₹700
                              </SelectItem>
                              <SelectItem value="combo-50ml" className="text-white hover:bg-white/10">
                                Combo 50ml + 50ml - ₹900
                              </SelectItem>
                              <SelectItem value="combo-30-50ml" className="text-white hover:bg-white/10">
                                Combo 30ml + 50ml - ₹800
                              </SelectItem>
                              <SelectItem value="combo-50-30ml" className="text-white hover:bg-white/10">
                                Combo 50ml + 30ml - ₹800
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => addLayeredToCart()}
                            className="bg-white text-black hover:bg-gray-200 px-6 py-3 font-semibold rounded-lg"
                          >
                            Add Combo to Cart
                          </Button>
                        </div>
                        <p className="text-sm text-gray-400">
                          Get both fragrances together and save on your custom blend
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Popular Combinations */}
                  <PopularCombination />

                  {/* CTA */}
                  <div className="text-center">
                    <Link href="/layering">
                      <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300">
                        Explore More Combinations
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Sections with Enhanced Styling */}
        <div className="space-y-32">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-black/10 blur-3xl -z-10" />
          </div>
        </div>
      </div>

      {/* Enhanced Newsletter Section */}
      <div className="relative mt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/20 to-transparent blur-3xl -z-10" />
        <Newsletter />
      </div>

      <Footer />

      {isQuickViewOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div className="aspect-square relative">
                <Image
                  src={selectedProduct.images["30"][0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.round(selectedProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedProduct.description}</p>

                {selectedProduct.notes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Key Notes:</h3>
                    <div className="flex flex-wrap gap-2">
                      {[...selectedProduct.notes.top, ...selectedProduct.notes.heart, ...selectedProduct.notes.base].map((note: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Sizes:</h3>
                  <div className="flex gap-3">
                    {selectedProduct.sizeOptions.map((size: any) => (
                      <div key={size.size} className="px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-700">
                        {size.size}ml - ₹{size.price}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      addToCart(selectedProduct, 1, selectedProduct.sizeOptions[0].size)
                      setIsQuickViewOpen(false)
                    }}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => router.push(`/product/${selectedProduct.id}`)}
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Cart />
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      `}</style>
    </main>
  )
}
