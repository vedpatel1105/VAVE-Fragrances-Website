"use client"

import { useState, useEffect } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { ChevronRight, ShoppingBag, Undo2, ArrowRight, Eye, Zap, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Cart from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/src/lib/cartStore"

const questions = [
  {
    id: "style",
    title: "What type of fragrance appeals to you most?",
    options: [
      { value: "fresh", label: "Fresh & Aquatic", icon: "🌊", description: "Clean and invigorating like Oceane" },
      { value: "floral", label: "Floral & Sweet", icon: "🌸", description: "Romantic and delicate like Euphoria" },
      { value: "woody", label: "Woody & Aromatic", icon: "🌳", description: "Bold and natural like Havoc" },
      { value: "spicy", label: "Spicy & Oriental", icon: "✨", description: "Rich and exotic like Obsession" },
      { value: "citrus", label: "Citrus & Bright", icon: "🍊", description: "Vibrant and fresh like Duskfall" },
      { value: "gourmand", label: "Sweet & Gourmand", icon: "🍬", description: "Warm and delicious like Velora" },
    ],
  },
  {
    id: "occasion",
    title: "When will you be wearing this fragrance?",
    options: [
      { value: "daily", label: "Daily Wear", icon: "☀️", description: "For work and casual outings" },
      { value: "special", label: "Special Events", icon: "🎭", description: "For celebrations and gatherings" },
      { value: "evening", label: "Evening Wear", icon: "🌙", description: "For romantic dinners and nights out" },
      { value: "formal", label: "Formal Events", icon: "👔", description: "For business and formal occasions" },
    ],
  },
  {
    id: "notes",
    title: "Which fragrance notes do you prefer?",
    options: [
      { value: "vanilla", label: "Vanilla", icon: "🍦", description: "Sweet, warm and comforting" },
      { value: "coffee", label: "Coffee", icon: "☕", description: "Rich, aromatic and energizing" },
      { value: "woody", label: "Woody", icon: "🌲", description: "Natural, earthy and grounding" },
      { value: "smoky", label: "Smoky", icon: "🔥", description: "Mysterious, deep and intense" },
      { value: "chocolate", label: "Chocolate", icon: "🍫", description: "Sweet, rich and indulgent" },
      { value: "sweet", label: "Sweet", icon: "🍯", description: "Delicious, warm and inviting" },
      { value: "strong", label: "Strong", icon: "💪", description: "Bold, powerful and lasting" },
      { value: "heavy", label: "Heavy", icon: "⚓", description: "Rich, deep and substantial" },
      { value: "attraction grabber", label: "Attraction Grabber", icon: "✨", description: "Captivating and alluring" },
      { value: "lavender", label: "Lavender", icon: "💜", description: "Calming, herbal and relaxing" },
      { value: "floral", label: "Floral", icon: "🌺", description: "Romantic, elegant and feminine" },
      { value: "aquatic", label: "Aquatic", icon: "🌊", description: "Fresh, clean and invigorating" },
      { value: "musky", label: "Musky", icon: "🌫️", description: "Sensual, warm and intimate" },
      { value: "ice tea", label: "Ice Tea", icon: "🧊", description: "Refreshing, cool and crisp" },
      { value: "citrus", label: "Citrus", icon: "🍋", description: "Bright, zesty and energizing" },
      { value: "fruity", label: "Fruity", icon: "🍎", description: "Sweet, juicy and playful" },
      { value: "oud", label: "Oud", icon: "🪵", description: "Exotic, rich and luxurious" },
      { value: "saffron", label: "Saffron", icon: "🧡", description: "Warm, spicy and precious" },
      { value: "cardamom", label: "Cardamom", icon: "🌱", description: "Spicy, aromatic and exotic" },
      { value: "bergamot", label: "Bergamot", icon: "🍊", description: "Citrusy, fresh and uplifting" },
      { value: "cinnamon", label: "Cinnamon", icon: "🍂", description: "Warm, spicy and comforting" },
      { value: "nutmeg", label: "Nutmeg", icon: "🌰", description: "Warm, spicy and aromatic" },
      { value: "jasmine", label: "Jasmine", icon: "🌼", description: "Floral, sweet and exotic" },
      { value: "peach", label: "Peach", icon: "🍑", description: "Sweet, juicy and playful" },
      { value: "apple", label: "Apple", icon: "🍏", description: "Crisp, fresh and fruity" },
      { value: "berry", label: "Berry", icon: "🍓", description: "Sweet, tangy and vibrant" },
      { value: "coconut", label: "Coconut", icon: "🥥", description: "Tropical, creamy and exotic" },
      { value: "almond", label: "Almond", icon: "🌰", description: "Nutty, sweet and comforting" },
    ],
    multiSelect: true,
  },

  {
    id: "weather",
    title: "When do you want your fragrance to shine?",
    options: [
      { value: "summer", label: "Hot Summer Days", icon: "🌞", description: "Fresh and light" },
      { value: "spring", label: "Spring Mornings", icon: "🌱", description: "Floral and bright" },
      { value: "fall", label: "Autumn Evenings", icon: "🍂", description: "Warm and cozy" },
      { value: "winter", label: "Winter Nights", icon: "❄️", description: "Rich and deep" },
    ],
  },
  {
    id: "intensity",
    title: "How noticeable should your fragrance be?",
    options: [
      { value: "light", label: "Light", icon: "🍃", description: "Intimate presence" },
      { value: "moderate", label: "Moderate", icon: "🌿", description: "Noticeable but not overwhelming" },
      { value: "strong", label: "Strong", icon: "💫", description: "Makes a statement" },
      { value: "intense", label: "Intense", icon: "🔥", description: "Unforgettable impact" },
    ],
  },
]

const resetButtonVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05 },
}



export default function ScentFinderPage() {
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [preferences, setPreferences] = useState<Record<string, any>>({})
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
  const [selectedSize, setSelectedSize] = useState("30")
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState<Record<number, boolean>>({})
  const { addItem, setIsOpen } = useCartStore()
  const router = useRouter()

  const handleSelection = (questionId: string, value: string | string[]) => {
    const updatedPreferences = { ...preferences, [questionId]: value }
    setPreferences(updatedPreferences)

    if (questionId === "notes") {
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      findMatchingFragrances(updatedPreferences)
    }
  }

  const handleNoteToggle = (note: string) => {
    setSelectedNotes((prev) => {
      if (prev.includes(note)) {
        return prev.filter((n) => n !== note)
      } else {
        return [...prev, note]
      }
    })
  }

  const gotoProducPage = (id: number) => {
    router.push(`/product/${id}`)
  }

  const handleNotesSubmit = () => {
    const updatedPreferences = { ...preferences, notes: selectedNotes }
    setPreferences(updatedPreferences)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      findMatchingFragrances(updatedPreferences)
    }
  }

  const findMatchingFragrances = (prefs: Record<string, any>) => {
    // Enhanced matching algorithm with weighted scoring
    const matches = ProductInfo.allProductItems.map((product) => {
      let score = 0

      // Primary matches (higher weight)
      if (product.category.toLowerCase() === prefs.style) score += 3
      if (product.specifications.sillage.toLowerCase().includes(prefs.intensity)) score += 2

      // Secondary matches
      if (product.specifications.fragrance_family.toLowerCase().includes(prefs.occasion)) score += 2
      if (product.tagline.toLowerCase().includes(prefs.personality)) score += 1

      // Note matches (highest weight)
      if (prefs.notes && prefs.notes.length > 0) {
        const allNotes = [
          ...product.notes.top,
          ...product.notes.heart,
          ...product.notes.base
        ]
        const noteMatches = prefs.notes.filter((note: string) =>
          allNotes.some(productNote =>
            productNote.toLowerCase().includes(note.toLowerCase())
          )
        ).length
        score += noteMatches * 3
      }

      return {
        product,
        score,
      }
    })

    // Sort by score and get top matches
    const bestMatches = matches
      .sort((a, b) => b.score - a.score)
      .filter((match) => match.score > 0)
      .slice(0, 3)

    if (bestMatches.length > 0) {
      setRecommendedProducts(bestMatches.map((match) => match.product))

      toast({
        title: "Found Your Perfect Matches! 🎉",
        description: `We found ${bestMatches.length} fragrances that match your preferences.`,
      })
    } else {
      toast({
        title: "No exact match found",
        description: "Try adjusting your preferences for more options.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: any) => {
    try {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }))

      const sizeOption = product.sizeOptions.find((s: any) => s.size === selectedSize)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id,
        name: product.name,
        price: price,
        image: product.images[selectedSize][0],
        quantity: 1,
        size: selectedSize,
        type: "single",
      }

      addItem(cartItem)
      setIsOpen(true)

      toast({
        title: "Added to Cart! 🛍️",
        description: `${product.name} (${selectedSize}ml) has been added to your cart.`,
        duration: 3000,
      })

      setTimeout(() => {
        setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }))
      }, 1000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }))
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setPreferences({})
    setRecommendedProducts([])
    setSelectedSize("30")
    setSelectedNotes([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <SimpleNavbar />

      <main className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">
              Find Your Perfect Scent
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Let us guide you to your signature fragrance through an immersive journey of discovery
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {recommendedProducts.length === 0 ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10"
              >
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center">
                  <h2 className="text-3xl font-semibold mb-6 text-white">{questions[currentQuestion].title}</h2>

                  {/* Enhanced progress bar with glass effect */}
                  <div className="relative w-full h-3 bg-white/10 backdrop-blur-sm rounded-full mb-8 overflow-hidden border border-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute h-full bg-gradient-to-r from-gray-600 to-black backdrop-blur-sm"
                    />
                  </div>
                </motion.div>

                {/* Special handling for the notes question with multi-select */}
                {questions[currentQuestion].id === "notes" ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {questions[currentQuestion].options.map((option) => (
                        <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <button
                            onClick={() => handleNoteToggle(option.value)}
                            className={`relative w-full h-auto p-4 flex flex-col items-center gap-2 rounded-xl
                              transition-all duration-300 group border backdrop-blur-xl
                              ${selectedNotes.includes(option.value)
                                ? "bg-white/20 text-white border-white/30 shadow-lg"
                                : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-gray-200 hover:text-white"
                              }`}
                          >
                            <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                              {option.icon}
                            </span>
                            <span className="text-sm font-medium transition-colors">{option.label}</span>
                            {selectedNotes.includes(option.value) && (
                              <span className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-white" />
                              </span>
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleNotesSubmit}
                        disabled={selectedNotes.length === 0}
                        className="bg-white/20 hover:bg-white/30 text-white px-8 py-2 rounded-full backdrop-blur-xl border border-white/20 disabled:opacity-50"
                      >
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Regular option grid for other questions */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.div key={option.value} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={() => handleSelection(questions[currentQuestion].id, option.value)}
                          className="w-full h-auto p-6 flex flex-col items-center gap-3 rounded-xl
                            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                            transition-all duration-300 group text-gray-200 hover:text-white backdrop-blur-xl"
                        >
                          <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                            {option.icon}
                          </span>
                          <span className="text-lg font-medium transition-colors">{option.label}</span>
                          <span className="text-sm text-gray-400 group-hover:text-gray-300">{option.description}</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Enhanced navigation */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="text-white hover:text-gray-200 hover:bg-white/10 backdrop-blur-xl disabled:opacity-50"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {questions.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full backdrop-blur-sm ${index === currentQuestion ? "bg-white/80" : "bg-white/30"
                          }`}
                        animate={{
                          scale: index === currentQuestion ? 1.2 : 1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-white mb-4">Your Perfect Matches</h2>
                  <p className="text-gray-300">Based on your preferences, we recommend these fragrances</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 flex flex-col"
                    >
                      <div 
                        className="relative aspect-square cursor-pointer"
                        onClick={() => gotoProducPage(product.id)}
                      >
                        <Image
                          src={product.images[selectedSize][0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {['top', 'heart', 'base'].map((noteType) => (
                            <div key={noteType} className="text-center">
                              <h5 className="text-xs font-medium uppercase text-gray-400 mb-2">
                                {noteType.charAt(0).toUpperCase() + noteType.slice(1)} Notes
                              </h5>
                              <div className="space-y-1">
                                {product.notes[noteType as keyof typeof product.notes].slice(0, 2).map((note: string, i: number) => (
                                  <div key={i} className="text-xs text-gray-200 bg-white/10 rounded-full px-2 py-1 truncate">
                                    {note}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Size:</h4>
                            <div className="flex gap-2 flex-wrap">
                              {product.sizeOptions.map((size: { size: string; price: number }) => (
                                <button
                                  key={size.size}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSize(size.size);
                                  }}
                                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                                    selectedSize === size.size
                                      ? "bg-white text-black font-medium"
                                      : "bg-white/10 text-white hover:bg-white/20"
                                  }`}
                                >
                                  {size.size}ml
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-xl font-bold text-white">
                              ₹{product.sizeOptions.find((s: { size: string; price: number }) => s.size === selectedSize)?.price || product.price}
                            </span>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={isAddingToCart[product.id]}
                              className="bg-white text-black hover:bg-gray-200"
                            >
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              {isAddingToCart[product.id] ? "Adding..." : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    <Undo2 className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Cart />
      <Footer />
    </div>
  )
}
