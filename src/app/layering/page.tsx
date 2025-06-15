"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Star, Eye, X, Zap } from "lucide-react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"
import { useCartStore } from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"
import { motion } from "framer-motion"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Function to generate layered fragrance description and notes
const generateLayeredFragrance = (perfume1: any, perfume2: any) => {
  const combinedTopNotes = [...new Set([...perfume1.notes.top, ...perfume2.notes.top])]
  const combinedHeartNotes = [...new Set([...perfume1.notes.heart, ...perfume2.notes.heart])]
  const combinedBaseNotes = [...new Set([...perfume1.notes.base, ...perfume2.notes.base])]

  const descriptions: { [key: string]: string } = {
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
    descriptions[categoryKey] ||
    descriptions[reverseKey] ||
    "A unique and personalized fragrance that combines the best of both worlds"

  return {
    description,
    notes: {
      top: combinedTopNotes.slice(0, 6),
      heart: combinedHeartNotes.slice(0, 6),
      base: combinedBaseNotes.slice(0, 6),
    },
  }
}

export default function LayeringPage() {
  const { toast } = useToast()
  const [selectedPerfume1, setSelectedPerfume1] = useState<any>(null)
  const [selectedPerfume2, setSelectedPerfume2] = useState<any>(null)
  const [selectedSize1, setSelectedSize1] = useState("30")
  const [selectedSize2, setSelectedSize2] = useState("30")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNotes, setShowNotes] = useState<{ [key: string]: boolean }>({})
  const { addItem, setIsOpen } = useCartStore()

  const addLayeredProductToCart = () => {
    if (!selectedPerfume1 || !selectedPerfume2) {
      toast({
        title: "Please select both fragrances",
        description: "Choose two different fragrances to create your layered scent.",
        variant: "destructive",
      })
      return
    }

    if (selectedPerfume1.id === selectedPerfume2.id) {
      toast({
        title: "Please select different fragrances",
        description: "Choose two different fragrances for layering.",
        variant: "destructive",
      })
      return
    }

    setIsAnimating(true)

    setTimeout(() => {
      const sizeOption1 = selectedPerfume1.sizeOptions.find((s: any) => s.size === selectedSize1)
      const sizeOption2 = selectedPerfume2.sizeOptions.find((s: any) => s.size === selectedSize2)
      const totalPrice = (sizeOption1 ? sizeOption1.price : selectedPerfume1.price) + 
                        (sizeOption2 ? sizeOption2.price : selectedPerfume2.price)

      const layeredProduct = {
        id: `layered-${selectedPerfume1.id}-${selectedPerfume2.id}-${Date.now()}`,
        name: `${selectedPerfume1.name} + ${selectedPerfume2.name}`,
        price: totalPrice,
        image: selectedPerfume1.images[selectedSize1][0],
        quantity: 1,
        type: "layered",
        size: `${selectedSize1}ml + ${selectedSize2}ml`,
        sizes: {
          perfume1: selectedSize1,
          perfume2: selectedSize2,
        },
        description: `Custom layered fragrance: ${selectedPerfume1.name} (${selectedSize1}ml) + ${selectedPerfume2.name} (${selectedSize2}ml)`,
      }

      addItem(layeredProduct)
      setIsOpen(true)

      toast({
        title: "Layered Fragrance Added! 🎉",
        description: `${layeredProduct.name} has been added to your cart.`,
      })

      setIsAnimating(false)
    }, 1500)
  }

  const toggleNotes = (id: string) => {
    setShowNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const addPopularComboToCart = (perfume1: any, perfume2: any) => {
    if (!perfume1 || !perfume2) return

    setIsAnimating(true)

    setTimeout(() => {
      const sizeOption1 = perfume1.sizeOptions.find((s: any) => s.size === "30")
      const sizeOption2 = perfume2.sizeOptions.find((s: any) => s.size === "30")
      const totalPrice = (sizeOption1 ? sizeOption1.price : perfume1.price) + 
                        (sizeOption2 ? sizeOption2.price : perfume2.price)

      const layeredProduct = {
        id: `layered-${perfume1.id}-${perfume2.id}-${Date.now()}`,
        name: `${perfume1.name} + ${perfume2.name}`,
        price: totalPrice,
        image: perfume1.images["30"][0],
        quantity: 1,
        type: "layered",
        size: "30ml + 30ml",
        sizes: {
          perfume1: "30",
          perfume2: "30",
        },
        description: `Custom layered fragrance: ${perfume1.name} (30ml) + ${perfume2.name} (30ml)`,
      }

      addItem(layeredProduct)
      setIsOpen(true)

      toast({
        title: "Popular Combination Added! 🎉",
        description: `${layeredProduct.name} has been added to your cart.`,
      })

      setIsAnimating(false)
    }, 1200)
  }

  const layeredFragrance =
    selectedPerfume1 && selectedPerfume2 ? generateLayeredFragrance(selectedPerfume1, selectedPerfume2) : null

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SimpleNavbar />

      <main className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with enhanced animations */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Layering</h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 mb-4">What is Layering?</p>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                Layering is the art of combining two different fragrances to create your own unique scent. Simply
                choose any two of our perfumes and wear them together - the scents will blend on your skin to form
                a completely new fragrance that's uniquely yours. It's like being your own perfumer!
              </p>
            </div>
          </div>

          {/* Main Layering Section with enhanced layout */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Selection Area */}
              <div className="space-y-8">
                {/* First Perfume Selection */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Choose Your First Fragrance</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {ProductInfo.allProductItems.map((perfume) => (
                      <Card
                        key={perfume.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedPerfume1?.id === perfume.id
                            ? "bg-white/20 border-white shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedPerfume1(perfume)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square relative mb-3">
                            <Image
                              src={perfume.images["30"][0]}
                              alt={perfume.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h3 className="font-medium text-center text-sm md:text-base">{perfume.name}</h3>
                          <p className="text-xs md:text-sm text-gray-400 text-center">{perfume.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Second Perfume Selection */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Second Fragrance</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {ProductInfo.allProductItems.map((perfume) => (
                      <Card
                        key={perfume.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedPerfume2?.id === perfume.id
                            ? "bg-white/20 border-white shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedPerfume2(perfume)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square relative mb-3">
                            <Image
                              src={perfume.images["30"][0]}
                              alt={perfume.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h3 className="font-medium text-center text-sm md:text-base">{perfume.name}</h3>
                          <p className="text-xs md:text-sm text-gray-400 text-center">{perfume.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Area */}
              <div className="space-y-8">
                {selectedPerfume1 && selectedPerfume2 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-center">Your Custom Blend</h2>
                    
                    {/* Selected Fragrances */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* First Perfume */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="aspect-square relative mb-4">
                          <Image
                            src={selectedPerfume1.images["30"][0]}
                            alt={selectedPerfume1.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="font-medium text-center mb-2">{selectedPerfume1.name}</h3>
                        <div className="flex justify-center gap-2">
                          {selectedPerfume1.notes.top.slice(0, 3).map((note: string, idx: number) => (
                            <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Second Perfume */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="aspect-square relative mb-4">
                          <Image
                            src={selectedPerfume2.images["30"][0]}
                            alt={selectedPerfume2.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="font-medium text-center mb-2">{selectedPerfume2.name}</h3>
                        <div className="flex justify-center gap-2">
                          {selectedPerfume2.notes.top.slice(0, 3).map((note: string, idx: number) => (
                            <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Fragrance Size</label>
                        <Select value={selectedSize1} onValueChange={setSelectedSize1}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedPerfume1.sizeOptions.map((option: { size: string; price: number }) => (
                              <SelectItem key={option.size} value={option.size}>
                                {option.size}ml - ₹{option.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Second Fragrance Size</label>
                        <Select value={selectedSize2} onValueChange={setSelectedSize2}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedPerfume2.sizeOptions.map((option: { size: string; price: number }) => (
                              <SelectItem key={option.size} value={option.size}>
                                {option.size}ml - ₹{option.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-semibold rounded-xl"
                      onClick={addLayeredProductToCart}
                      disabled={isAnimating}
                    >
                      {isAnimating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <>
                          <ShoppingBag className="h-6 w-6 mr-2" />
                          Add Combo to Cart
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="max-w-md">
                      <h2 className="text-2xl font-bold mb-4">Create Your Custom Blend</h2>
                      <p className="text-gray-300 mb-6">
                        Select two fragrances from our collection to create your unique layered scent. 
                        Each combination creates a distinctive aroma that's uniquely yours.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">1</div>
                          <span>Choose your first fragrance from the left</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">2</div>
                          <span>Select your second fragrance</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">3</div>
                          <span>Choose sizes and add to cart</span>
                        </div>
                      </div>
                      <div className="mt-8 p-4 bg-white/5 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Popular Combinations</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {popularCombinations.slice(0, 4).map((combo, index) => (
                            <div key={index} className="text-gray-400">
                              {combo.name} ({combo.popularity})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Cart />
    </div>
  )
}

// Popular combinations
const popularCombinations = [
  { fragrance1: "Oceane", fragrance2: "Euphoria", name: "Ocean Bloom", popularity: "95%" },
  { fragrance1: "Duskfall", fragrance2: "Obsession", name: "Dark Mystery", popularity: "92%" },
  { fragrance1: "Lavior", fragrance2: "Mehfil", name: "Royal Spice", popularity: "88%" },
  { fragrance1: "Havoc", fragrance2: "Velora", name: "Fresh Woods", popularity: "85%" },
]
