"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import dynamic from "next/dynamic"
import Footer from "@/src/app/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import EnhancedProductCard from "./components/EnhancedProductCard"
import { useToast } from "@/components/ui/use-toast"
import Hero from "./components/Hero"
import SafeHydration from "./components/SafeHydration"
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "../lib/cartStore"
import SimpleInstagramFeed from "./components/SimpleInstagramFeed"
import CompactLayeringAwareness from "./components/CompactLayeringAwareness"
import CompactScentFinderAwareness from "./components/CompactScentFinderAwareness"

const SimpleNavbar = dynamic(() => import("@/src/app/components/SimpleNavbar"), { ssr: false })
const Cart = dynamic(() => import("@/src/app/components/Cart"), { ssr: false })

// Popular combinations
const popularCombinations = [
  { fragrance1: "Oceane", fragrance2: "Euphoria", name: "Ocean Bloom", popularity: "95%" },
  { fragrance1: "Duskfall", fragrance2: "Obsession", name: "Dark Mystery", popularity: "92%" },
  { fragrance1: "Lavior", fragrance2: "Mehfil", name: "Royal Spice", popularity: "88%" },
  { fragrance1: "Havoc", fragrance2: "Velora", name: "Fresh Woods", popularity: "85%" },
]



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
  const [products, setProducts] = useState<ProductInfo.Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, setIsOpen, getTotalItems } = useCartStore()
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        
        // Always start with static products as fallback
        let loadedProducts = ProductInfo.allProductItems
        
        // Try to get products from cache
        try {
          const cachedProducts = ProductInfo.getAllProductItems()
          if (cachedProducts && cachedProducts.length > 0) {
            loadedProducts = cachedProducts
          }
        } catch (cacheError) {
          console.log("Using static products as fallback")
        }
        
        setProducts(loadedProducts)
      } catch (error) {
        console.error("Error loading products:", error)
        // Final fallback to static products
        setProducts(ProductInfo.allProductItems)
      } finally {
        setIsLoading(false)
      }
    }

    // Load products immediately
    loadProducts()
  }, [])

  

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

 
  return (
    <SafeHydration>
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black overflow-x-hidden">
      <SimpleNavbar />
      <Hero />
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        {/* Featured Products Section */}
        <section id="featured" className="w-full py-32 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="container mx-auto px-4 md:px-6">
            {/* Section Header */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20 relative z-10"
            >
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Our Best Collection</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Featured Fragrances</h3>
              <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
                Explore our best perfumes, each made to bring back special memories and feelings.
              </p>
            </motion.div>

            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
              {isLoading ? (
                // Sharp Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white/5 border border-white/5 p-8 animate-pulse">
                    <div className="aspect-[4/5] bg-white/5 mb-8"></div>
                    <div className="h-6 bg-white/5 w-2/3 mb-4"></div>
                    <div className="h-4 bg-white/5 w-1/2"></div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="transform transition-transform duration-300 hover:-translate-y-2"
                  >
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
                  </motion.div>
                ))
              ) : (
                // Fallback to static products if loading fails
                ProductInfo.allProductItems.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="transform transition-transform duration-300 hover:-translate-y-2"
                  >
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
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
      {/* Removed Layering Section */}
      <div className="mt-40">
        <CompactScentFinderAwareness />
      </div>

      {/* Instagram Feed Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="mt-24"
      >
        <SimpleInstagramFeed />
      </motion.div>

      <Footer />
      <AnimatePresence>
        {isQuickViewOpen && selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-zinc-950 border border-white/5 w-full max-w-7xl flex flex-col md:flex-row relative group/modal"
            >
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-8 right-8 z-20 p-4 text-white/30 hover:text-white transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>

              {/* Gallery Side */}
              <div className="md:w-3/5 aspect-square md:aspect-auto md:h-[80vh] relative p-12 bg-zinc-900/50">
                <Image
                  src={selectedProduct.images[selectedSizes[selectedProduct.id] || "30"][0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain p-20"
                />
              </div>

              {/* Information Side */}
              <div className="md:w-2/5 p-12 md:p-16 flex flex-col justify-center">
                <div className="mb-12">
                   <h2 className="text-5xl font-serif text-white tracking-tight mb-4">{selectedProduct.name}</h2>
                   <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono italic">{selectedProduct.tagline}</p>
                </div>

                <div className="space-y-10 mb-16">
                  <div className="prose prose-sm prose-invert">
                    <p className="text-sm font-light leading-relaxed text-white/50">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5">
                    {Object.entries(selectedProduct.notes).slice(0, 3).map(([key, notes]: [any, any]) => (
                      <div key={key} className="bg-zinc-950 p-4">
                        <span className="text-[8px] uppercase tracking-widest text-white/20 block mb-2">{key}</span>
                        <span className="text-[10px] text-white/60">{notes[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    className="h-16 bg-white text-black hover:bg-zinc-200 rounded-none text-[10px] uppercase tracking-[0.4em] font-bold"
                    onClick={() => {
                      addToCart(selectedProduct, 1, selectedSizes[selectedProduct.id] || selectedProduct.sizeOptions[0].size)
                      setIsQuickViewOpen(false)
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-14 border border-white/5 text-white/40 hover:text-white rounded-none text-[9px] uppercase tracking-[0.3em]"
                    onClick={() => router.push(`/product/${selectedProduct.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      `}</style>
    </main>
    </SafeHydration>
  )
}
