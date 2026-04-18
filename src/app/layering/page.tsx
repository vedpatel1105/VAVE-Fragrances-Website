"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Star, Eye, X, Zap } from "lucide-react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"
import { ProductInfo } from "@/src/data/product-info"
import { motion } from "framer-motion"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import PopularCombination from "../components/PopularCombination"
import { useCartStore } from "@/src/lib/cartStore"

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
  const [products, setProducts] = useState<ProductInfo.Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, setIsOpen } = useCartStore()

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

  const [selectedPerfume1, setSelectedPerfume1] = useState<any>(null)
  const [selectedPerfume2, setSelectedPerfume2] = useState<any>(null)
  const [selectedSize1, setSelectedSize1] = useState("30")
  const [selectedSize2, setSelectedSize2] = useState("30")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNotes, setShowNotes] = useState<{ [key: string]: boolean }>({})

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
        size: `${selectedSize1}ml + ${selectedSize2}`,
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

  const layeredFragrance =
    selectedPerfume1 && selectedPerfume2 ? generateLayeredFragrance(selectedPerfume1, selectedPerfume2) : null

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      <SimpleNavbar />

      <main className="container mx-auto px-4 pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24 relative">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Scent Alchemy</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">The Art of Layering</h1>
            <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mb-8" />
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
                Layering is the art of combining two different fragrances to create your own bespoke signature. Simply choose any two of our Extraits and wear them together. The oils will merge on your skin to form a completely new composition.
            </p>
          </div>

          {/* Main Layering Section with enhanced layout */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Selection Area */}
              <div className="space-y-8">
                {/* First Perfume Selection */}
                <div>
                  <h2 className="text-lg font-serif mb-8 text-center text-white tracking-wide">Select Foundational Note</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-zinc-900/40 border border-white/5 rounded-none animate-pulse" />
                      ))
                    ) : products.map((perfume) => (
                      <Card
                        key={perfume.id}
                        className={`cursor-pointer transition-all duration-500 hover:scale-105 rounded-none ${
                          selectedPerfume1?.id === perfume.id
                            ? "bg-white/10 border-white/40 shadow-lg"
                            : "bg-zinc-950 border-white/5 hover:border-white/20 hover:bg-zinc-900/40"
                        }`}
                        onClick={() => setSelectedPerfume1(perfume)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square relative mb-4">
                            <Image
                              src={perfume.images["30"][0]}
                              alt={perfume.name}
                              fill
                              className="object-cover mix-blend-screen"
                            />
                          </div>
                          <h3 className="font-serif tracking-wide text-center text-sm md:text-base text-white">{perfume.name}</h3>
                          <p className="text-[9px] uppercase tracking-widest text-white/40 text-center mt-1">{perfume.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Second Perfume Selection */}
                <div>
                  <h2 className="text-lg font-serif mb-8 text-center text-white tracking-wide">Select Accentuating Note</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-zinc-900/40 border border-white/5 rounded-none animate-pulse" />
                      ))
                    ) : products.map((perfume) => (
                      <Card
                        key={perfume.id}
                        className={`cursor-pointer transition-all duration-500 hover:scale-105 rounded-none ${
                          selectedPerfume2?.id === perfume.id
                            ? "bg-white/10 border-white/40 shadow-lg"
                            : "bg-zinc-950 border-white/5 hover:border-white/20 hover:bg-zinc-900/40"
                        }`}
                        onClick={() => setSelectedPerfume2(perfume)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square relative mb-4">
                            <Image
                              src={perfume.images["30"][0]}
                              alt={perfume.name}
                              fill
                              className="object-cover mix-blend-screen"
                            />
                          </div>
                          <h3 className="font-serif tracking-wide text-center text-sm md:text-base text-white">{perfume.name}</h3>
                          <p className="text-[9px] uppercase tracking-widest text-white/40 text-center mt-1">{perfume.category}</p>
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
                    className="bg-zinc-950 rounded-none p-8 md:p-10 border border-white/5 shadow-2xl"
                  >
                    <h2 className="text-2xl font-serif tracking-wide mb-8 text-center text-white">Your Custom Blend</h2>
                    
                    {/* Selected Fragrances Side-by-Side */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {/* First Perfume */}
                      <div className="bg-zinc-900/40 rounded-none p-4 md:p-6 border border-white/5 relative flex flex-col items-center">
                        <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-white/30 hidden md:block">Base</span>
                        <div className="w-24 h-24 md:w-32 md:h-32 relative mb-4">
                          <Image
                            src={selectedPerfume1.images["30"][0]}
                            alt={selectedPerfume1.name}
                            fill
                            className="object-cover mix-blend-screen"
                          />
                        </div>
                        <h3 className="font-serif tracking-wide text-center text-white">{selectedPerfume1.name}</h3>
                      </div>

                      {/* Second Perfume */}
                      <div className="bg-zinc-900/40 rounded-none p-4 md:p-6 border border-white/5 relative flex flex-col items-center">
                        <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-white/30 hidden md:block">Accent</span>
                        <div className="w-24 h-24 md:w-32 md:h-32 relative mb-4">
                          <Image
                            src={selectedPerfume2.images["30"][0]}
                            alt={selectedPerfume2.name}
                            fill
                            className="object-cover mix-blend-screen"
                          />
                        </div>
                        <h3 className="font-serif tracking-wide text-center text-white">{selectedPerfume2.name}</h3>
                      </div>
                    </div>

                    {/* The Alchemy Result (Notes) */}
                    {layeredFragrance && (
                      <div className="mb-8 p-6 bg-white/[0.02] border justify-center border-white/5 flex flex-col items-center text-center">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">The Alchemy</h4>
                        <p className="text-white/60 text-sm font-light leading-relaxed mb-6 italic max-w-sm">"{layeredFragrance.description}"</p>
                        
                        <div className="w-full grid grid-cols-3 gap-2 text-center items-start">
                          <div>
                            <h4 className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Top Notes</h4>
                            <div className="flex flex-col gap-1 items-center">
                              {layeredFragrance.notes.top.slice(0, 2).map((note: string, idx: number) => (
                                <span key={idx} className="text-[10px] text-white/70">{note}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Heart Notes</h4>
                            <div className="flex flex-col gap-1 items-center">
                              {layeredFragrance.notes.heart.slice(0, 2).map((note: string, idx: number) => (
                                <span key={idx} className="text-[10px] text-white/70">{note}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Base Notes</h4>
                            <div className="flex flex-col gap-1 items-center">
                              {layeredFragrance.notes.base.slice(0, 2).map((note: string, idx: number) => (
                                <span key={idx} className="text-[10px] text-white/70">{note}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuration & Purchase */}
                    <div className="grid grid-cols-2 gap-4 mb-8 text-white">
                      <div>
                        <Select value={selectedSize1} onValueChange={setSelectedSize1}>
                          <SelectTrigger className="w-full bg-zinc-900 border border-white/10 rounded-none h-12 text-xs font-mono text-white hover:border-white/30 transition-colors focus:ring-0">
                            <SelectValue placeholder="Base Size" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-white/10">
                            {selectedPerfume1.sizeOptions.map((option: { size: string; price: number }) => (
                              <SelectItem key={option.size} value={option.size} className="text-xs font-mono text-white/80 focus:bg-white focus:text-black cursor-pointer rounded-none">
                                {option.size}ml - ₹{option.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select value={selectedSize2} onValueChange={setSelectedSize2}>
                          <SelectTrigger className="w-full bg-zinc-900 border border-white/10 rounded-none h-12 text-xs font-mono text-white hover:border-white/30 transition-colors focus:ring-0">
                            <SelectValue placeholder="Accent Size" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-white/10">
                            {selectedPerfume2.sizeOptions.map((option: { size: string; price: number }) => (
                              <SelectItem key={option.size} value={option.size} className="text-xs font-mono text-white/80 focus:bg-white focus:text-black cursor-pointer rounded-none">
                                {option.size}ml - ₹{option.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
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
                          <ShoppingBag className="h-4 w-4 mr-3" strokeWidth={1.5} />
                          Secure Allocation
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-zinc-950 p-12 border border-white/5 h-full flex flex-col items-center justify-center text-center shadow-2xl"
                  >
                    <div className="max-w-md">
                      <h2 className="text-2xl font-serif tracking-wide text-white mb-6">Create Your Custom Blend</h2>
                      <p className="text-white/40 text-sm font-light leading-relaxed mb-10">
                        Select two Extraits from our collection to create your bespoke layered scent. 
                        Each combination acts dynamically, producing an evolving signature.
                      </p>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-white/40">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center text-[10px]">01</div>
                          <span className="text-left w-full">Select the foundational note</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-white/40">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center text-[10px]">02</div>
                          <span className="text-left w-full">Select the accentuating note</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-white/40">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center text-[10px]">03</div>
                          <span className="text-left w-full">Configure sizes and acquire</span>
                        </div>
                      </div>
                      <div className="mt-12 pt-8 border-t border-white/5 w-full">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/30 mb-6">Currently Trending</h3>
                        <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest">
                          {popularCombinations.slice(0, 4).map((combo, index) => (
                            <div key={index} className="text-white/60 border border-white/5 p-3 hover:border-white/20 transition-colors">
                              {combo.name}
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

      {/* Popular Combinations Section */}
      <PopularCombination />

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
