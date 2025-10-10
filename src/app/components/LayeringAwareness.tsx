"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Layers, Palette, Zap, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCartStore } from "@/src/lib/cartStore"
import { useToast } from "@/components/ui/use-toast"
import { ProductInfo } from "@/src/data/product-info"
import PopularCombination from "./PopularCombination"

const layeringSteps = [
  {
    step: "1",
    title: "Choose Your Base",
    description: "Select your primary fragrance as the foundation",
    icon: <Layers className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: "2",
    title: "Add Your Accent",
    description: "Pick a complementary scent to layer on top",
    icon: <Palette className="h-6 w-6" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    step: "3",
    title: "Create Magic",
    description: "Watch as the scents blend into something uniquely yours",
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-yellow-500 to-orange-500"
  }
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

export default function LayeringAwareness() {
  const [currentStep, setCurrentStep] = useState(0)
  const { addItem, setIsOpen, getTotalItems } = useCartStore()
  const { toast } = useToast()
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
  // Get layered fragrance
  const layeredFragrance = generateLayeredFragrance(selectedFragrance1, selectedFragrance2)


  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Smooth Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Layers className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Fragrance Layering</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Become Your Own Perfumer
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the art of fragrance layering - combine any two of our scents to create a completely unique
              fragrance that's exclusively yours. It's like being your own perfumer!
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {layeringSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="relative"
                >
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{step.step}</div>
                      <h4 className="text-xl font-semibold text-white mb-3">{step.title}</h4>
                      <p className="text-gray-300">{step.description}</p>
                    </CardContent>
                  </Card>

                  {/* Connecting Line */}
                  {index < layeringSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
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
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Link href="/layering">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Layering Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-gray-400 mt-4">
              No experience needed - our tool guides you through every step
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
