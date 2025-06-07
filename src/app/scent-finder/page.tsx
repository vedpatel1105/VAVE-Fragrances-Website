"use client"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { ChevronRight, ShoppingBag, Undo2, ArrowRight, Eye, Zap, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Cart from "@/src/app/components/Cart"

const allProducts = [
  {
    id: 1,
    name: "Oceane",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/oceane.jpg",
    description: "Fresh, aquatic and energetic",
    style: "Fresh",
    occasion: "Daily",
    intensity: "Light",
    category: "Fresh Aquatic",
    personality: "Energetic",
    weather: "Summer",
    notes: {
      top: ["Green Apple", "Bergamot", "Lemon Zest"],
      heart: ["Lavender", "Marine Accord", "Clary Sage"],
      base: ["Vetiver", "Tonka Bean", "Musk"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["aquatic", "fresh", "citrus", "lavender", "musky", "fruity"],
  },
  {
    id: 2,
    name: "Euphoria",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/euphoria.jpg",
    description: "Floral, romantic and feminine",
    style: "Floral",
    occasion: "Evening",
    intensity: "Moderate",
    category: "Floral",
    personality: "Romantic",
    weather: "Spring",
    notes: {
      top: ["Pear", "Mandarin Orange", "Peony"],
      heart: ["Osmanthus", "Rose", "Magnolia"],
      base: ["Sandalwood", "Patchouli", "Vanilla"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["floral", "sweet", "vanilla", "fruity", "woody"],
  },
  {
    id: 3,
    name: "Havoc",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/havoc30.jpg",
    description: "Woody, aromatic and masculine",
    style: "Woody",
    occasion: "Daily",
    intensity: "Strong",
    category: "Woody Aromatic",
    personality: "Confident",
    weather: "All-season",
    notes: {
      top: ["Bitter Orange", "Green Apple", "Cardamom"],
      heart: ["Tea Leaf", "Nutmeg", "Geranium"],
      base: ["Cedarwood", "Vetiver", "Musk"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["woody", "cardamom", "musky", "strong", "ice tea", "citrus", "attraction grabber"],
  },
  {
    id: 4,
    name: "Duskfall",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/duskfall.jpg",
    description: "Citrus amber sophistication",
    style: "Citrus",
    occasion: "Evening",
    intensity: "Moderate",
    category: "Citrus Amber",
    personality: "Sophisticated",
    weather: "Fall",
    notes: {
      top: ["Sicilian Orange", "Ginger", "Citron"],
      heart: ["Neroli", "Black Tea", "Ambrox"],
      base: ["Olibanum", "Guaiac Wood", "Ambergris"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["citrus", "woody", "ice tea", "attraction grabber"],
  },
  {
    id: 5,
    name: "Velora",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/velora.jpg",
    description: "Gourmand warmth seduction",
    style: "Gourmand",
    occasion: "Special",
    intensity: "Strong",
    category: "Gourmand",
    personality: "Seductive",
    weather: "Winter",
    notes: {
      top: ["Pink Pepper", "Orange Blossom", "Pear"],
      heart: ["Coffee", "Jasmine", "Almond"],
      base: ["Vanilla", "Patchouli", "Cedarwood"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["coffee", "vanilla", "sweet", "woody", "heavy", "attraction grabber"],
  },
  {
    id: 6,
    name: "Obsession",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/obsession.jpg",
    description: "Spicy intensity addiction",
    style: "Spicy",
    occasion: "Night",
    intensity: "Strong",
    category: "Spicy Oriental",
    personality: "Passionate",
    weather: "Winter",
    notes: {
      top: ["Cardamom", "Red Berries"],
      heart: ["Toffee", "Cinnamon Bark"],
      base: ["Amberwood", "Tonka Bean", "Leather"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["cardamom", "sweet", "chocolate", "heavy", "strong", "attraction grabber"],
  },
  {
    id: 7,
    name: "Mehfil",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/mehfil.jpg",
    description: "Amber sweet opulence",
    style: "Oriental",
    occasion: "Special",
    intensity: "Strong",
    category: "Oriental Amber",
    personality: "Luxurious",
    weather: "Winter",
    notes: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris"],
      base: ["Fir Resin", "Cedarwood", "Musk"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["saffron", "woody", "musky", "heavy", "strong", "attraction grabber"],
  },
  {
    id: 8,
    name: "lavior",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/lavior.jpg",
    description: "Herbal smoky uniqueness",
    style: "Aromatic",
    occasion: "Daily",
    intensity: "Moderate",
    category: "Aromatic Woody",
    personality: "Unique",
    weather: "All-season",
    notes: {
      top: ["Lavender", "Bergamot"],
      heart: ["Clary Sage", "Oud Accord"],
      base: ["Agarwood (Oud)", "Patchouli", "Musk"],
    },
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    noteTypes: ["lavender", "oud", "smoky", "musky", "woody"],
  },
]

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
    ],
    multiSelect: true,
  },
  {
    id: "personality",
    title: "Which best describes your personality?",
    options: [
      { value: "energetic", label: "Energetic & Bold", icon: "⚡", description: "Full of life" },
      { value: "romantic", label: "Romantic & Soft", icon: "💝", description: "Sweet and gentle" },
      { value: "sophisticated", label: "Sophisticated & Elegant", icon: "👑", description: "Refined taste" },
      { value: "adventurous", label: "Adventurous & Free", icon: "🌟", description: "Spontaneous spirit" },
    ],
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
      { value: "light", label: "Subtle & Close", icon: "🍃", description: "Intimate presence" },
      { value: "moderate", label: "Balanced & Present", icon: "🌿", description: "Noticeable but not overwhelming" },
      { value: "strong", label: "Bold & Lasting", icon: "💫", description: "Makes a statement" },
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
  const [cart, setCart] = useState<any[]>([])
  const [selectedSize, setSelectedSize] = useState("30ml")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  const handleSelection = (questionId: string, value: string | string[]) => {
    const updatedPreferences = { ...preferences, [questionId]: value }
    setPreferences(updatedPreferences)

    if (questionId === "notes") {
      // For the notes question, we're just collecting the notes but not advancing yet
      setSelectedNotes(value as string[])
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
    const matches = allProducts.map((product) => {
      let score = 0

      // Primary matches (higher weight)
      if (product.style.toLowerCase() === prefs.style) score += 3
      if (product.intensity.toLowerCase() === prefs.intensity) score += 2

      // Secondary matches
      if (product.occasion.toLowerCase() === prefs.occasion) score += 2
      if (product.personality.toLowerCase() === prefs.personality) score += 1
      if (product.weather.toLowerCase() === prefs.weather) score += 1

      // Note matches (highest weight)
      if (prefs.notes && prefs.notes.length > 0) {
        const noteMatches = prefs.notes.filter((note: string) => product.noteTypes.includes(note.toLowerCase())).length

        score += noteMatches * 3 // Give high weight to note matches
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

  const addToCart = (product: any) => {
    try {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }))

      const sizeOption = product.sizes.find((s: any) => s.size === selectedSize)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
        quantity: 1,
        size: selectedSize,
        type: "single",
      }

      const updatedCart = [...cart, cartItem]
      setCart(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))

      toast({
        title: "Added to Cart! 🛍️",
        description: `${product.name} (${selectedSize}) has been added to your cart.`,
        duration: 3000,
      })

      setTimeout(() => {
        setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }))
      }, 1000)

      // Explicitly open the cart
      setIsCartOpen(true)
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

  // Add checkout and calculate total functions
  const checkout = () => {
    if (cart.length === 0) return
    let message = "Hi, I would like to order the following items:\n\n"
    cart.forEach((item) => {
      message += `${item.quantity}x ${item.name} (${item.size}) - Rs. ${item.price * item.quantity}\n`
    })
    message += `\nTotal: Rs. ${calculateTotal()}`
    const encodedMessage = encodeURIComponent(message)
    window.location.href = `https://wa.me/919328701508?text=${encodedMessage}`
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setPreferences({})
    setRecommendedProducts([])
    setSelectedSize("30ml")
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

      <SimpleNavbar cartItemsCount={cart.length} />

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
                              ${
                                selectedNotes.includes(option.value)
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
                        className={`w-2.5 h-2.5 rounded-full backdrop-blur-sm ${
                          index === currentQuestion ? "bg-white/80" : "bg-white/30"
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
              // Enhanced recommendation display with glass morphism and fragrance notes
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">Your Perfect Matches</h2>
                  <p className="text-gray-300">Based on your preferences, we think you'll love these fragrances</p>
                </div>

                {recommendedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.2 },
                    }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 aspect-square relative rounded-xl overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-xl text-white text-sm rounded-full border border-white/20">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-1 text-white">{product.name}</h3>
                            <p className="text-gray-300 mb-3">{product.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              ₹{product.sizes.find((s: { size: string }) => s.size === selectedSize)?.price || product.sizes[0].price}
                            </div>
                            <div className="text-sm text-gray-400">{selectedSize}</div>
                          </div>
                        </div>

                        {/* Enhanced Fragrance Notes Section */}
                        <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <h4 className="text-sm font-medium uppercase text-gray-300 mb-3 text-center">
                            Fragrance Notes
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <h5 className="text-xs font-medium uppercase text-gray-400 mb-2">Top Notes</h5>
                              <div className="space-y-1">
                                {product.notes.top.map((note: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                  <div key={i} className="text-xs text-gray-200 bg-white/10 rounded-full px-2 py-1">
                                    {note}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-center">
                              <h5 className="text-xs font-medium uppercase text-gray-400 mb-2">Heart Notes</h5>
                              <div className="space-y-1">
                                {product.notes.heart.map((note: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                  <div key={i} className="text-xs text-gray-200 bg-white/10 rounded-full px-2 py-1">
                                    {note}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-center">
                              <h5 className="text-xs font-medium uppercase text-gray-400 mb-2">Base Notes</h5>
                              <div className="space-y-1">
                                {product.notes.base.map((note: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                  <div key={i} className="text-xs text-gray-200 bg-white/10 rounded-full px-2 py-1">
                                    {note}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-white">Select Size</h4>
                            <div className="flex gap-2">
                              {product.sizes.map((size: any) => (
                                <Button
                                  key={size.size}
                                  variant={selectedSize === size.size ? "default" : "outline"}
                                  onClick={() => setSelectedSize(size.size)}
                                  className={
                                    selectedSize === size.size
                                      ? "bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-xl"
                                      : "text-gray-300 border-white/20 hover:border-white/30 hover:bg-white/10 backdrop-blur-xl"
                                  }
                                >
                                  {size.size} - ₹{size.price}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Button
                              className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border border-white/20 text-sm sm:text-base"
                              onClick={() => addToCart(product)}
                              disabled={isAddingToCart[product.id]}
                            >
                              {isAddingToCart[product.id] ? (
                                <span className="flex items-center justify-center">
                                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                  Adding...
                                </span>
                              ) : (
                                <>
                                  <ShoppingBag className="mr-2 h-4 w-4" />
                                  Add to Cart
                                </>
                              )}
                            </Button>

                            <Link
                              href={`/product/${product.id}`}
                              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-md font-medium transition-colors backdrop-blur-xl border border-white/20 text-sm sm:text-base"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Link>

                            <Link
                              href={`/checkout?product=${product.id}&size=${selectedSize}`}
                              className="w-full flex items-center justify-center gap-2 bg-white/30 hover:bg-white/40 text-white py-2 px-4 rounded-md font-medium transition-colors backdrop-blur-xl border border-white/30 text-sm sm:text-base"
                            >
                              <Zap className="h-4 w-4" />
                              Buy Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  className="mt-8 text-center"
                  variants={resetButtonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Button
                    variant="outline"
                    onClick={resetQuiz}
                    className="gap-2 text-white border-white/20 hover:border-white/30 hover:bg-white/10 backdrop-blur-xl"
                  >
                    <Undo2 className="h-4 w-4" />
                    Try Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        total={calculateTotal()}
        updateQuantity={(id, size, qty) => {
          const updatedCart = cart.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity: qty } : item,
          )
          setCart(updatedCart)
          localStorage.setItem("cart", JSON.stringify(updatedCart))
        }}
        removeFromCart={(id, size) => {
          const updatedCart = cart.filter((item) => !(item.id === id && item.size === size))
          setCart(updatedCart)
          localStorage.setItem("cart", JSON.stringify(updatedCart))
        }}
        checkout={checkout}
      />

      <Footer />
    </div>
  )
}
