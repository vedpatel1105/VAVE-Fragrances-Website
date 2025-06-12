"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Star, Eye, X } from "lucide-react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"
import { useCartStore } from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Layering</h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 mb-4">What is Layering?</p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Layering is the art of combining two different fragrances to create your own unique scent. Simply
                choose any two of our perfumes and wear them together - the scents will blend on your skin to form
                a completely new fragrance that's uniquely yours. It's like being your own perfumer!
              </p>
            </div>
          </div>

          {/* Main Layering Section with enhanced layout */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                          <h3 className="font-medium text-center">{perfume.name}</h3>
                          <p className="text-sm text-gray-400 text-center">{perfume.category}</p>
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
                          <h3 className="font-medium text-center">{perfume.name}</h3>
                          <p className="text-sm text-gray-400 text-center">{perfume.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="space-y-8">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-center">Your Layered Fragrance</h2>
                  {layeredFragrance ? (
                    <div className="space-y-6">
                      <p className="text-gray-300 text-center">{layeredFragrance.description}</p>

                      {/* Size Selection */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">First Fragrance Size</label>
                          <div className="flex gap-2">
                            {selectedPerfume1.sizeOptions.map((size: any) => (
                              <button
                                key={size.size}
                                onClick={() => setSelectedSize1(size.size)}
                                className={`px-4 py-2 rounded-lg text-sm ${
                                  selectedSize1 === size.size
                                    ? "bg-white text-black"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                              >
                                {size.size}ml
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Second Fragrance Size</label>
                          <div className="flex gap-2">
                            {selectedPerfume2.sizeOptions.map((size: any) => (
                              <button
                                key={size.size}
                                onClick={() => setSelectedSize2(size.size)}
                                className={`px-4 py-2 rounded-lg text-sm ${
                                  selectedSize2 === size.size
                                    ? "bg-white text-black"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                              >
                                {size.size}ml
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Fragrance Notes</h3>
                          <button
                            onClick={() => toggleNotes("notes")}
                            className="text-sm text-gray-400 hover:text-white"
                          >
                            {showNotes["notes"] ? "Hide Notes" : "Show Notes"}
                          </button>
                        </div>
                        {showNotes["notes"] && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Top Notes</h4>
                              <div className="flex flex-wrap gap-2">
                                {layeredFragrance.notes.top.map((note: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                                  >
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Heart Notes</h4>
                              <div className="flex flex-wrap gap-2">
                                {layeredFragrance.notes.heart.map((note: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                                  >
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Base Notes</h4>
                              <div className="flex flex-wrap gap-2">
                                {layeredFragrance.notes.base.map((note: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                                  >
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        className={`w-full py-6 text-lg ${
                          isAnimating ? "animate-pulse" : ""
                        }`}
                        onClick={addLayeredProductToCart}
                        disabled={isAnimating}
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Add Layered Fragrance to Cart
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      Select two fragrances to create your layered scent
                    </div>
                  )}
                </div>

                {/* Popular Combinations */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-center">Popular Combinations</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {popularCombinations.map((combo, index) => {
                      const perfume1 = ProductInfo.allProductItems.find((p) => p.name === combo.fragrance1)
                      const perfume2 = ProductInfo.allProductItems.find((p) => p.name === combo.fragrance2)
                      return (
                        <Card
                          key={index}
                          className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                          onClick={() => {
                            if (perfume1 && perfume2) {
                              setSelectedPerfume1(perfume1)
                              setSelectedPerfume2(perfume2)
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-4">
                                <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-white">
                                  <Image
                                    src={perfume1?.images["30"][0] || "/placeholder.svg"}
                                    alt={perfume1?.name || ""}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-white">
                                  <Image
                                    src={perfume2?.images["30"][0] || "/placeholder.svg"}
                                    alt={perfume2?.name || ""}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium">{combo.name}</h3>
                                <p className="text-sm text-gray-400">
                                  {combo.fragrance1} + {combo.fragrance2}
                                </p>
                                <p className="text-sm text-green-400">{combo.popularity} loved</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
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
