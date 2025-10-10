"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import dynamic from "next/dynamic"
import Footer from "@/src/app/components/Footer"
import EnhancedProductCard from "./components/EnhancedProductCard"
import { useToast } from "@/components/ui/use-toast"
import Hero from "./components/Hero"
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "../lib/cartStore"
import SimpleInstagramFeed from "./components/SimpleInstagramFeed"
import LayeringAwareness from "./components/LayeringAwareness"
import ScentFinderAwareness from "./components/ScentFinderAwareness"

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
  const { addItem, setIsOpen, getTotalItems } = useCartStore()
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  

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
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Featured Products Section */}
        <section id="featured" className="w-full py-24">
          <div className="container mx-auto px-4 md:px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-serif text-white">Featured Fragrances</h2>
              <div className="w-24 h-1 bg-white mx-auto rounded-full mb-4" />
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover our curated selection of premium fragrances, each crafted to evoke unique emotions and
                memories.
              </p>
            </div>

            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl -z-10" />
              {ProductInfo.allProductItems.map((product) => (
                <div key={product.id} className="transform transition-transform duration-300 hover:-translate-y-2">
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
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <LayeringAwareness />
      <ScentFinderAwareness />

      {/* Instagram Feed Section */}
      <div className="mt-24">
        <SimpleInstagramFeed />
      </div>

      <Footer />

      {isQuickViewOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div className="aspect-square relative">
                <Image
                  src={selectedProduct.images["30"][0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.round(selectedProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedProduct.description}</p>

                {selectedProduct.notes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Key Notes:</h3>
                    <div className="flex flex-wrap gap-2">
                      {[...selectedProduct.notes.top, ...selectedProduct.notes.heart, ...selectedProduct.notes.base].map((note: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Sizes:</h3>
                  <div className="flex gap-3">
                    {selectedProduct.sizeOptions.map((size: any) => (
                      <div key={size.size} className="px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-700">
                        {size.size}ml - ₹{size.price}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      addToCart(selectedProduct, 1, selectedProduct.sizeOptions[0].size)
                      setIsQuickViewOpen(false)
                    }}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => router.push(`/product/${selectedProduct.id}`)}
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
