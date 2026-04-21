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
  const [products, setProducts] = useState<ProductInfo.Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, setIsOpen } = useCartStore()
  const router = useRouter()

  const [isAddingToCart, setIsAddingToCart] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const items = await ProductInfo.loadProducts()
        setProducts(items)
      } catch (err) {
        console.error("Failed to load products:", err)
        setProducts(ProductInfo.getAllProductItems())
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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
    const matches = products.map((product) => {
      let score = 0
      let matchedPreferences = []

      // Primary matches (higher weight)
      if (product.category.toLowerCase() === prefs.style) {
        score += 3
        matchedPreferences.push('style')
      }
      if (product.specifications.sillage.toLowerCase().includes(prefs.intensity)) {
        score += 2
        matchedPreferences.push('intensity')
      }

      // Secondary matches
      if (product.specifications.fragrance_family.toLowerCase().includes(prefs.occasion)) {
        score += 2
        matchedPreferences.push('occasion')
      }
      if (product.tagline.toLowerCase().includes(prefs.personality)) {
        score += 1
        matchedPreferences.push('personality')
      }

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
        )
        if (noteMatches.length > 0) {
          score += noteMatches.length * 3
          matchedPreferences.push('notes')
        }
      }

      return {
        product,
        score,
        matchedPreferences
      }
    })

    // Sort by score
    const sortedMatches = matches.sort((a, b) => b.score - a.score)
    
    // Get exact matches (score > 0)
    let bestMatches = sortedMatches.filter(match => match.score > 0)

    // If we don't have 3 matches, add random products that match at least one preference
    if (bestMatches.length < 3) {
      const remainingMatches = sortedMatches
        .filter(match => !bestMatches.includes(match) && match.matchedPreferences.length > 0)
        
      // Add random products from remaining matches until we have 3
      while (bestMatches.length < 3 && remainingMatches.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingMatches.length)
        bestMatches.push(remainingMatches.splice(randomIndex, 1)[0])
      }

      // If we still don't have 3, add random products
      if (bestMatches.length < 3) {
        const unusedProducts = products
          .filter(product => !bestMatches.some(match => match.product.id === product.id))
        
        while (bestMatches.length < 3 && unusedProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * unusedProducts.length)
          bestMatches.push({
            product: unusedProducts.splice(randomIndex, 1)[0],
            score: 0,
            matchedPreferences: []
          })
        }
      }
    }

    // Take only the top 3
    bestMatches = bestMatches.slice(0, 3)

    setRecommendedProducts(bestMatches.map(match => match.product))

    // Customized toast message based on match quality
    const perfectMatches = bestMatches.filter(match => match.score > 5).length
    const partialMatches = bestMatches.filter(match => match.score > 0 && match.score <= 5).length

    let toastMessage = ""
    if (perfectMatches === 3) {
      toastMessage = "We found your perfect matches! 🎉"
    } else if (perfectMatches > 0 || partialMatches > 0) {
      toastMessage = "We found some great matches based on your preferences! ✨"
    } else {
      toastMessage = "Here are some fragrances you might enjoy! 🌟"
    }

    toast({
      title: toastMessage,
      description: `We've selected 3 fragrances for you to explore.`,
    })
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
    <div className="min-h-screen bg-zinc-950 relative text-white">
      {/* Animated background particles mapped out for luxury darkness */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <SimpleNavbar />

      <main className="container mx-auto px-4 pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24 relative">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Digital Sommelier</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Find Your Perfect Scent</h1>
            <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mb-8" />
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
              Let us guide you to your signature fragrance through an immersive journey of discovery.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {recommendedProducts.length === 0 ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 bg-zinc-950 p-8 md:p-12 shadow-2xl border border-white/5 rounded-none"
              >
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center">
                  <h2 className="text-xl md:text-2xl font-serif tracking-wide mb-8 text-center text-white">{questions[currentQuestion].title}</h2>

                  {/* Enhanced progress bar */}
                  <div className="relative w-full h-1 bg-white/5 rounded-none mb-10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute h-full bg-white"
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
                            className={`relative w-full h-auto p-4 flex flex-col items-center gap-3 rounded-none
                              transition-all duration-300 group border
                              ${selectedNotes.includes(option.value)
                                ? "bg-white/10 text-white border-white/40 shadow-lg"
                                : "bg-zinc-900/40 hover:bg-white/5 border-white/5 hover:border-white/20 text-white/60 hover:text-white"
                              }`}
                          >
                            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100">
                              {option.icon}
                            </span>
                            <span className="text-[10px] uppercase font-mono tracking-widest transition-colors">{option.label}</span>
                            {selectedNotes.includes(option.value) && (
                              <span className="absolute top-2 right-2">
                                <Check className="h-3 w-3 text-white" />
                              </span>
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-10">
                      <Button
                        onClick={handleNotesSubmit}
                        disabled={selectedNotes.length === 0}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-none tracking-widest uppercase text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        Continue Phase
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Regular option grid for other questions */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.div key={option.value} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={() => handleSelection(questions[currentQuestion].id, option.value)}
                          className="w-full h-auto p-8 flex flex-col items-center gap-4 rounded-none
                            bg-zinc-900/40 hover:bg-white/5 border border-white/5 hover:border-white/20
                            transition-all duration-500 group text-white/60 hover:text-white"
                        >
                          <span className="text-3xl transform group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100 mb-2">
                            {option.icon}
                          </span>
                          <span className="text-xs uppercase font-mono tracking-widest transition-colors">{option.label}</span>
                          <span className="text-[10px] text-white/40 group-hover:text-white/60 font-light text-center leading-relaxed">
                            {option.description}
                          </span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Enhanced navigation */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="text-white/40 hover:text-black hover:bg-white rounded-none tracking-widest uppercase text-[10px] font-mono disabled:opacity-10 disabled:hover:bg-transparent disabled:hover:text-white/40 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="h-3 w-3 rotate-180 mr-2" />
                    Previous Stage
                  </Button>

                  <div className="flex gap-3">
                    {questions.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-none ${index === currentQuestion ? "bg-white" : "bg-white/20"
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
                <div className="text-center mb-12">
                  <h2 className="text-2xl font-serif text-white mb-4 tracking-wide">Your Perfect Matches</h2>
                  <p className="text-white/40 tracking-widest text-xs uppercase font-mono">Based on your olfactory profile</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-zinc-950 overflow-hidden border border-white/5 flex flex-col group rounded-none hover:border-white/20 transition-all duration-500"
                    >
                      <div 
                        className="relative aspect-square cursor-pointer bg-zinc-900/40 p-6"
                        onClick={() => gotoProducPage(product.id)}
                      >
                        <Image
                          src={product.images[selectedSize][0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover mix-blend-screen p-4 group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      <div className="p-8 flex flex-col flex-1 border-t border-white/5">
                        <h3 className="text-xl font-serif tracking-wide text-white mb-2 text-center">{product.name}</h3>
                        <p className="text-white/40 text-xs text-center mb-6 line-clamp-2 uppercase tracking-widest">{product.category}</p>

                        <div className="grid grid-cols-3 gap-2 mb-8">
                          {['top', 'heart', 'base'].map((noteType) => (
                            <div key={noteType} className="text-center">
                              <h5 className="text-[9px] uppercase tracking-widest text-white/40 mb-2">
                                {noteType.charAt(0).toUpperCase() + noteType.slice(1)} Notes
                              </h5>
                              <div className="space-y-1">
                                {product.notes[noteType as keyof typeof product.notes].slice(0, 2).map((note: string, i: number) => (
                                  <div key={i} className="text-[10px] text-white/70 truncate uppercase tracking-wider">
                                    {note}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto space-y-6">
                          <div>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {product.sizeOptions.map((size: { size: string; price: number }) => (
                                <button
                                  key={size.size}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSize(size.size);
                                  }}
                                  className={`px-4 py-2 text-[10px] uppercase font-mono tracking-widest transition-all rounded-none border ${
                                    selectedSize === size.size
                                      ? "bg-white text-black border-white"
                                      : "bg-transparent text-white/60 border-white/10 hover:border-white/40"
                                  }`}
                                >
                                  {size.size}ml
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <span className="text-lg font-mono text-white">
                              ₹{product.sizeOptions.find((s: { size: string; price: number }) => s.size === selectedSize)?.price || product.price}
                            </span>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={isAddingToCart[product.id]}
                              className="bg-white text-black hover:bg-gray-200 rounded-full text-[10px] uppercase tracking-widest font-bold h-10 px-6 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow"
                            >
                              <ShoppingBag className="h-3 w-3 mr-2" strokeWidth={1.5} />
                              {isAddingToCart[product.id] ? "Adding..." : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white hover:text-black rounded-none tracking-widest uppercase font-mono text-xs px-8 py-6 transition-colors"
                  >
                    <Undo2 className="h-4 w-4 mr-3" strokeWidth={1.5}/>
                    Restart Consultation
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      
      <Footer />
    </div>
  )
}
