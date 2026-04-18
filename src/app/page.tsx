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
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <SimpleNavbar />
      <Hero />
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-zinc-950">
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
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Signature Collection</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Featured Fragrances</h3>
              <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
                Discover our curated selection of premium fragrances, each crafted to evoke unique emotions and
                memories.
              </p>
            </motion.div>

            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                    <div className="aspect-square bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <CompactLayeringAwareness />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <CompactScentFinderAwareness />
      </motion.div>

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-zinc-950 border border-white/5 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
            >
            <button
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Image side */}
            <div className="md:w-1/2 p-12 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950 relative">
              <div className="aspect-[4/5] relative w-full h-full max-h-[60vh] drop-shadow-2xl">
                <Image
                  src={selectedProduct.images["30"][0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain mix-blend-screen"
                />
              </div>
            </div>

            {/* Content side */}
            <div className="md:w-1/2 p-10 md:p-14 overflow-y-auto bg-zinc-950 border-l border-white/5">
              <h2 className="text-4xl font-serif text-white tracking-wide mb-3">{selectedProduct.name}</h2>
              <div className="flex items-center mb-8 gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= Math.round(selectedProduct.rating) ? "text-white/80 fill-white/80" : "text-white/20"}`}
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>

              <p className="text-sm font-light leading-relaxed text-white/50 mb-10">{selectedProduct.description}</p>

              {selectedProduct.notes && (
                <div className="mb-10">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Key Notes</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...selectedProduct.notes.top, ...selectedProduct.notes.heart, ...selectedProduct.notes.base].map((note: string, index: number) => (
                      <span key={index} className="px-4 py-1.5 bg-transparent border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-white/60">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Available Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.sizeOptions.map((size: any) => (
                    <div key={size.size} className="px-5 py-2 rounded-full border border-white/10 text-xs font-mono text-white/70">
                      {size.size}ml - ₹{size.price}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button
                  className="flex-1 h-14 bg-white text-black hover:bg-gray-200 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  onClick={() => {
                    addToCart(selectedProduct, 1, selectedProduct.sizeOptions[0].size)
                    setIsQuickViewOpen(false)
                  }}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Add to Cart
                </Button>
                <Button
                  className="flex-1 h-14 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300"
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
      <Cart />
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      `}</style>
    </main>
  )
}
