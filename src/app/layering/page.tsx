"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Star, Eye, X } from "lucide-react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"

// All perfumes data with detailed notes
const perfumes = [
  {
    id: 1,
    name: "Havoc",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/havoc30.jpg",
    description: "Fresh and invigorating with citrus notes",
    price: { "30ml": 350, "50ml": 450 },
    category: "Fresh",
    notes: {
      top: ["Bergamot", "Lemon", "Green Apple"],
      heart: ["Lavender", "Geranium", "Mint"],
      base: ["Cedar", "Musk", "Amber"],
    },
  },
  {
    id: 2,
    name: "Lavior",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/lavior30.jpg",
    description: "Luxurious oriental with lavender and vanilla",
    price: { "30ml": 350, "50ml": 450 },
    category: "Oriental",
    notes: {
      top: ["Lavender", "Bergamot", "Cardamom"],
      heart: ["Rose", "Jasmine", "Cinnamon"],
      base: ["Vanilla", "Sandalwood", "Patchouli"],
    },
  },
  {
    id: 3,
    name: "Duskfall",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/duskfall30.jpg",
    description: "Mysterious and alluring for evening wear",
    price: { "30ml": 350, "50ml": 450 },
    category: "Woody",
    notes: {
      top: ["Black Pepper", "Pink Pepper", "Grapefruit"],
      heart: ["Cedar", "Vetiver", "Patchouli"],
      base: ["Oud", "Leather", "Tobacco"],
    },
  },
  {
    id: 4,
    name: "Euphoria",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/euphoria30.jpg",
    description: "Exhilarating blend of fruity and floral notes",
    price: { "30ml": 350, "50ml": 450 },
    category: "Floral",
    notes: {
      top: ["Peach", "Mandarin", "Pomegranate"],
      heart: ["Peony", "Lotus", "Champaca"],
      base: ["Mahogany", "Violet", "Cream"],
    },
  },
  {
    id: 5,
    name: "Oceane",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/oceane30.jpg",
    description: "Deep aquatic fragrance of the ocean",
    price: { "30ml": 350, "50ml": 450 },
    category: "Aquatic",
    notes: {
      top: ["Sea Salt", "Ozonic", "Citrus"],
      heart: ["Water Lily", "Seaweed", "Driftwood"],
      base: ["Ambergris", "Musk", "Cedar"],
    },
  },
  {
    id: 6,
    name: "Velora",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/velora30.jpg",
    description: "Rich velvety fragrance with woody notes",
    price: { "30ml": 350, "50ml": 450 },
    category: "Woody",
    notes: {
      top: ["Saffron", "Nutmeg", "Coriander"],
      heart: ["Rose", "Oud", "Patchouli"],
      base: ["Amber", "Musk", "Sandalwood"],
    },
  },
  {
    id: 7,
    name: "Obsession",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/obsession30.jpg",
    description: "Intense and captivating oriental notes",
    price: { "30ml": 350, "50ml": 450 },
    category: "Oriental",
    notes: {
      top: ["Mandarin", "Vanilla", "Green Notes"],
      heart: ["Spicy Notes", "Floral Notes", "Exotic Fruits"],
      base: ["Amber", "Sandalwood", "Musk"],
    },
  },
  {
    id: 8,
    name: "Mehfil",
    image: "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public/img/mehfil30.jpg",
    description: "Rich festive fragrance with traditional notes",
    price: { "30ml": 350, "50ml": 450 },
    category: "Spicy",
    notes: {
      top: ["Cardamom", "Saffron", "Rose"],
      heart: ["Oud", "Jasmine", "Spices"],
      base: ["Amber", "Musk", "Sandalwood"],
    },
  },
]

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
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [selectedPerfume1, setSelectedPerfume1] = useState<any>(null)
  const [selectedPerfume2, setSelectedPerfume2] = useState<any>(null)
  const [selectedSize1, setSelectedSize1] = useState("30ml")
  const [selectedSize2, setSelectedSize2] = useState("30ml")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNotes, setShowNotes] = useState<{ [key: string]: boolean }>({})

  // Load cart from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }, [])

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
      const totalPrice = selectedPerfume1.price[selectedSize1] + selectedPerfume2.price[selectedSize2]

      const layeredProduct = {
        id: `layered-${selectedPerfume1.id}-${selectedPerfume2.id}-${Date.now()}`,
        name: `${selectedPerfume1.name} + ${selectedPerfume2.name}`,
        price: totalPrice,
        image1: selectedPerfume1.image,
        image2: selectedPerfume2.image,
        quantity: 1,
        type: "layered",
        sizes: {
          perfume1: selectedSize1,
          perfume2: selectedSize2,
        },
        description: `Custom layered fragrance: ${selectedPerfume1.name} (${selectedSize1}) + ${selectedPerfume2.name} (${selectedSize2})`,
      }

      const updatedCart = [...cart, layeredProduct]
      setCart(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))

      toast({
        title: "Layered Fragrance Added! 🎉",
        description: `${layeredProduct.name} has been added to your cart.`,
      })

      setIsCartOpen(true)
      setIsAnimating(false)
    }, 1500)
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const updateQuantity = (id: number, size: string, newQuantity: number) => {
    const updatedCart = cart.map((item) => {
      if (
        item.id === id &&
        ((item.size && item.size === size) ||
          (item.sizes && (item.sizes.perfume1 === size || item.sizes.perfume2 === size)))
      ) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromCart = (id: number, size: string) => {
    const updatedCart = cart.filter((item) => !(item.id === id && (item.size === size || (item.sizes && (item.sizes.perfume1 === size || item.sizes.perfume2 === size)))))
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const checkout = () => {
    if (cart.length === 0) return
    let message = "Hi, I would like to order the following items:\n\n"
    cart.forEach((item) => {
      if (item.type === "layered") {
        message += `${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}\n`
      } else {
        message += `${item.quantity}x ${item.name} (${item.size || "N/A"}) - Rs. ${item.price * item.quantity}\n`
      }
    })
    message += `\nTotal: Rs. ${calculateTotal()}`
    const encodedMessage = encodeURIComponent(message)
    window.location.href = `https://wa.me/919328701508?text=${encodedMessage}`
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
      const totalPrice = perfume1.price["30ml"] + perfume2.price["30ml"]

      const layeredProduct = {
        id: `layered-${perfume1.id}-${perfume2.id}-${Date.now()}`,
        name: `${perfume1.name} + ${perfume2.name}`,
        price: totalPrice,
        image1: perfume1.image,
        image2: perfume2.image,
        quantity: 1,
        type: "layered",
        sizes: {
          perfume1: "30ml",
          perfume2: "30ml",
        },
        description: `Custom layered fragrance: ${perfume1.name} (30ml) + ${perfume2.name} (30ml)`,
      }

      const updatedCart = [...cart, layeredProduct]
      setCart(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))

      toast({
        title: "Popular Combination Added! 🎉",
        description: `${layeredProduct.name} has been added to your cart.`,
      })

      setIsCartOpen(true)
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
                    {perfumes.map((perfume) => (
                      <Card
                        key={perfume.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedPerfume1?.id === perfume.id
                            ? "bg-white/20 border-white shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        onClick={() => setSelectedPerfume1(perfume)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square relative bg-white/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden group">
                            <Image
                              src={perfume.image || "/placeholder.svg"}
                              alt={perfume.name}
                              width={170}
                              height={170}
                              className="object-contain transition-transform duration-500 group-hover:scale-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <h3 className="font-medium text-sm text-center">{perfume.name}</h3>
                          <p className="text-xs text-gray-400 text-center">{perfume.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Size Selection for First Perfume */}
                  {selectedPerfume1 && (
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold mb-3">Size for {selectedPerfume1.name}</h3>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant={selectedSize1 === "30ml" ? "default" : "outline"}
                          onClick={() => setSelectedSize1("30ml")}
                          className="flex-1 transition-all duration-300 hover:scale-105"
                        >
                          30ml - ₹350
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedSize1 === "50ml" ? "default" : "outline"}
                          onClick={() => setSelectedSize1("50ml")}
                          className="flex-1 transition-all duration-300 hover:scale-105"
                        >
                          50ml - ₹450
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Second Perfume Selection */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Second Fragrance</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {perfumes.map((perfume) => (
                      <Card
                        key={perfume.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedPerfume2?.id === perfume.id
                            ? "bg-white/20 border-white shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        onClick={() => setSelectedPerfume2(perfume)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square relative bg-white/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden group">
                            <Image
                              src={perfume.image || "/placeholder.svg"}
                              alt={perfume.name}
                              width={170}
                              height={170}
                              className="object-contain transition-transform duration-500 group-hover:scale-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <h3 className="font-medium text-sm text-center">{perfume.name}</h3>
                          <p className="text-xs text-gray-400 text-center">{perfume.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Size Selection for Second Perfume */}
                  {selectedPerfume2 && (
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold mb-3">Size for {selectedPerfume2.name}</h3>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant={selectedSize2 === "30ml" ? "default" : "outline"}
                          onClick={() => setSelectedSize2("30ml")}
                          className="flex-1 transition-all duration-300 hover:scale-105"
                        >
                          30ml - ₹350
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedSize2 === "50ml" ? "default" : "outline"}
                          onClick={() => setSelectedSize2("50ml")}
                          className="flex-1 transition-all duration-300 hover:scale-105"
                        >
                          50ml - ₹450
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Result Area */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center">Your Custom Fragrance</h2>

                {selectedPerfume1 && selectedPerfume2 ? (
                  <Card className="bg-white/5 border-white/20 shadow-2xl backdrop-blur-sm">
                    <CardContent className="p-8">
                      {/* Selected Fragrances Display */}
                      <div className="flex justify-center items-center space-x-8 mb-8">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center mb-3 transform hover:scale-110 transition-transform duration-300">
                            <Image
                              src={selectedPerfume1.image || "/placeholder.svg"}
                              alt={selectedPerfume1.name}
                              width={170}
                              height={170}
                              className="object-contain"
                            />
                          </div>
                          <h3 className="font-semibold">{selectedPerfume1.name}</h3>
                          <p className="text-sm text-gray-400">{selectedSize1}</p>
                        </div>

                        <div className="text-4xl font-bold text-white/50">×</div>

                        <div className="text-center">
                          <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center mb-3 transform hover:scale-110 transition-transform duration-300">
                            <Image
                              src={selectedPerfume2.image || "/placeholder.svg"}
                              alt={selectedPerfume2.name}
                              width={170}
                              height={170}
                              className="object-contain"
                            />
                          </div>
                          <h3 className="font-semibold">{selectedPerfume2.name}</h3>
                          <p className="text-sm text-gray-400">{selectedSize2}</p>
                        </div>
                      </div>

                      {/* Generated Fragrance Info */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-4">
                          {selectedPerfume1.name} × {selectedPerfume2.name}
                        </h3>
                        <p className="text-gray-300 mb-6">{layeredFragrance?.description}</p>

                        <div className="text-3xl font-bold mb-6">
                          ₹{selectedPerfume1.price[selectedSize1] + selectedPerfume2.price[selectedSize2]}
                        </div>

                        <Button
                          onClick={addLayeredProductToCart}
                          disabled={isAnimating}
                          className="w-full bg-white text-black hover:bg-gray-200 text-lg py-3 transform hover:scale-105 transition-all duration-300"
                        >
                          {isAnimating ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                              Creating Your Fragrance...
                            </div>
                          ) : (
                            <>
                              <ShoppingBag className="h-5 w-5 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Layered Fragrance Notes */}
                      {layeredFragrance && (
                        <div className="bg-white/5 rounded-lg p-6">
                          <h4 className="font-semibold mb-4 text-center">Your Custom Fragrance Notes</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-400 font-medium">Top Notes:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {layeredFragrance.notes.top.map((note: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400 font-medium">Heart Notes:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {layeredFragrance.notes.heart.map((note: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400 font-medium">Base Notes:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {layeredFragrance.notes.base.map((note: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/5 border-white/10 border-dashed backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-4">🧪</div>
                      <h3 className="text-xl font-semibold mb-2">Select Two Fragrances</h3>
                      <p className="text-gray-400">Choose any two fragrances to see your custom blend</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Popular Combinations with enhanced animations */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Popular Combinations</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover our most loved fragrance combinations, carefully crafted by our perfumers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name1: "Oceane", name2: "Euphoria", desc: "Fresh & Floral Harmony", popularity: "95%" },
                { name1: "Duskfall", name2: "Obsession", desc: "Woody & Intense Mystery", popularity: "92%" },
                { name1: "Lavior", name2: "Mehfil", desc: "Oriental & Spicy Elegance", popularity: "88%" },
              ].map((combo, index) => {
                const perfume1 = perfumes.find((p) => p.name === combo.name1)
                const perfume2 = perfumes.find((p) => p.name === combo.name2)
                const comboId = `combo-${index}`
                const comboFragrance = perfume1 && perfume2 ? generateLayeredFragrance(perfume1, perfume2) : null

                return (
                  <Card
                    key={index}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 group transform hover:scale-105 hover:-translate-y-2 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      {/* Images */}
                      <div className="flex justify-center items-center space-x-6 mb-6">
                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={perfume1?.image || "/placeholder.svg"}
                            alt={combo.name1}
                            width={170}
                            height={170}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-2xl font-bold text-white/50 group-hover:rotate-180 transition-transform duration-500">
                          ×
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={perfume2?.image || "/placeholder.svg"}
                            alt={combo.name2}
                            width={170}
                            height={170}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="font-bold text-center mb-2 text-lg">
                        {combo.name1} × {combo.name2}
                      </h3>
                      <p className="text-gray-300 text-center mb-4">{combo.desc}</p>

                      <div className="flex items-center justify-center mb-6">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-300">{combo.popularity} loved</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                          onClick={() => toggleNotes(comboId)}
                        >
                          {showNotes[comboId] ? (
                            <>
                              <X className="h-4 w-4 mr-2" /> Hide Notes
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" /> View Notes
                            </>
                          )}
                        </Button>

                        <Button
                          className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                          onClick={() => addPopularComboToCart(perfume1, perfume2)}
                          disabled={isAnimating}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart - ₹700
                        </Button>
                      </div>

                      {/* Expandable Notes */}
                      {showNotes[comboId] && comboFragrance && (
                        <div className="mt-6 p-4 bg-white/5 rounded-lg space-y-3">
                          <h4 className="font-semibold text-center mb-3">Fragrance Profile</h4>
                          <p className="text-sm text-gray-300 text-center mb-4">{comboFragrance.description}</p>

                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-gray-400 font-medium">Top Notes:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {comboFragrance.notes.top.map((note: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 font-medium">Heart Notes:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {comboFragrance.notes.heart.map((note: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 font-medium">Base Notes:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {comboFragrance.notes.base.map((note: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <Cart />

      <style jsx>{`
	.hover\\:scale-105:hover { transform: scale(1.05); }
	.transition-all { transition: all 0.3s ease; }
	`}</style>
    </div>
  )
}
