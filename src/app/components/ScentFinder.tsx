"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, ShoppingBag, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    text: "What's your preferred fragrance family?",
    options: ["Floral", "Woody", "Oriental", "Fresh"],
  },
  {
    id: 2,
    text: "When do you typically wear perfume?",
    options: ["Day", "Night", "Special Occasions", "All the time"],
  },
  {
    id: 3,
    text: "How would you describe your personality?",
    options: ["Adventurous", "Romantic", "Sophisticated", "Energetic"],
  },
  {
    id: 4,
    text: "Do you prefer strong and bold scents?",
    options: ["Yes", "No"],
  },
  {
    id: 5,
    text: "Do you like the combination of lavender and oud?",
    options: ["Yes", "No"],
  },
  {
    id: 6,
    text: "Are you drawn to floral and sweet fragrances?",
    options: ["Yes", "No"],
  },
  {
    id: 7,
    text: "Do you enjoy fresh and aquatic scents?",
    options: ["Yes", "No"],
  },
]

const perfumes = {
  Havoc: {
    id: 1,
    name: "Havoc",
    traits: ["Woody", "Night", "Sophisticated", "Yes"],
    price: 350,
    priceXL: 450,
    image: "/placeholder.svg?height=500&width=500",
    description: "A bold and sophisticated woody fragrance with notes of cedar and amber.",
    notes: ["Cedar", "Amber", "Musk", "Bergamot"],
    sizes: ["30ml", "50ml"],
  },
  Lavior: {
    id: 2,
    name: "Lavior",
    traits: ["Oriental", "Special Occasions", "Romantic", "Yes"],
    price: 350,
    priceXL: 450,
    image: "/placeholder.svg?height=500&width=500",
    description: "A luxurious oriental fragrance with lavender and vanilla notes.",
    notes: ["Lavender", "Vanilla", "Oud", "Spices"],
    sizes: ["30ml", "50ml"],
  },
  Euphoria: {
    id: 3,
    name: "Euphoria",
    traits: ["Floral", "Day", "Romantic", "Yes"],
    price: 350,
    priceXL: 450,
    image: "/placeholder.svg?height=500&width=500",
    description: "A delicate floral fragrance that evokes romance and joy.",
    notes: ["Rose", "Jasmine", "Peony", "Musk"],
    sizes: ["30ml", "50ml"],
  },
  Oceane: {
    id: 4,
    name: "Oceane",
    traits: ["Fresh", "All the time", "Energetic", "Yes"],
    price: 350,
    priceXL: 450,
    image: "/placeholder.svg?height=500&width=500",
    description: "A refreshing aquatic scent that captures the essence of the ocean.",
    notes: ["Sea Salt", "Citrus", "Aquatic Notes", "White Musk"],
    sizes: ["30ml", "50ml"],
  },
  Duskfall: {
    id: 5,
    name: "Duskfall",
    traits: ["Fresh", "Night", "Adventurous", "Yes"],
    price: 350,
    priceXL: 450,
    image: "/placeholder.svg?height=500&width=500",
    description: "A mysterious and adventurous fragrance perfect for evening wear.",
    notes: ["Vetiver", "Sandalwood", "Citrus", "Spices"],
    sizes: ["30ml", "50ml"],
  },
}

export default function ScentFinder() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [selectedSize, setSelectedSize] = useState("30ml")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const router = useRouter()

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      determinePerfume(newAnswers)
    }
  }

  const determinePerfume = (answers) => {
    let bestMatch = null
    let maxMatches = 0

    Object.entries(perfumes).forEach(([perfumeName, perfume]) => {
      const matches = perfume.traits.filter((trait) => answers.includes(trait)).length
      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = perfumeName
      }
    })

    setResult(bestMatch)

    // Redirect to product page if needed
    // Uncomment the line below to enable direct redirection
    // if (bestMatch) router.push(`/product/${perfumes[bestMatch].id}`);
  }

  const handleAddToCart = () => {
    setAddedToCart(true)
    // In a real implementation, you would add the product to the cart here
    setTimeout(() => {
      setAddedToCart(false)
    }, 3000)
  }

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
    setSelectedSize("30ml")
    setIsWishlisted(false)
    setAddedToCart(false)
  }

  const getPrice = () => {
    if (!result) return 0
    return selectedSize === "30ml" ? perfumes[result].price : perfumes[result].priceXL
  }

  return (
    <section id="scent-finder" className="w-full py-24 gradient-bg">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">Find Your Perfect Scent</h2>
        <div className="max-w-2xl mx-auto">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2">Your perfect scent is:</h3>
                <h2 className="text-3xl font-bold text-accent mb-4">{result}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Based on your answers, we've found your ideal fragrance match!
                </p>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/2 aspect-square">
                  <Image
                    src={perfumes[result].image || "/placeholder.svg?height=500&width=500"}
                    alt={result}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=500&width=500"
                    }}
                  />
                </div>

                <div className="w-full md:w-1/2 p-6">
                  <h3 className="text-xl font-semibold mb-2">{result}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{perfumes[result].description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Key Notes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {perfumes[result].notes.map((note, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Size:</h4>
                    <div className="flex gap-3">
                      {perfumes[result].sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-md text-sm ${
                            selectedSize === size
                              ? "bg-accent text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold">
                      ₹{selectedSize === "30ml" ? perfumes[result].price : perfumes[result].priceXL}
                    </span>
                    <button
                      onClick={handleAddToWishlist}
                      className={`p-2 rounded-full ${
                        isWishlisted
                          ? "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {addedToCart ? "Added!" : "Add to Cart"}
                    </button>
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Zap className="h-4 w-4" />
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow text-center"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
