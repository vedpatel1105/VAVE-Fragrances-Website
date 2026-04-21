"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { useToast } from "@/components/ui/use-toast"
import Cart from "@/src/app/components/Cart"
import EnhancedProductCard from "@/src/app/components/EnhancedProductCard"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductInfo } from "@/src/data/product-info"
import { useWishlistStore } from "@/src/store/wishlist"
import { useCartStore } from "@/src/lib/cartStore"

type Size = "30" | "50"

export default function CollectionPage() {
  const { toast } = useToast()
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: Size }>({})
  const [products, setProducts] = useState<ProductInfo.Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, setIsOpen, getTotalItems } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

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

  const handleAddToCart = (product: ProductInfo.Product, quantity: number, size: Size) => {
    try {
      const sizeOption = product.sizeOptions.find((s) => s.size === size)
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

  const handleSizeSelect = (productId: string | number, size: Size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
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

  return (
    <div className="min-h-screen bg-zinc-950">
      <SimpleNavbar />
      
      <main className="container mx-auto px-4 pt-32 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center text-[10px] uppercase font-mono tracking-widest text-white/30 mb-8 mt-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 mx-3 text-white/10" strokeWidth={1} />
          <span className="text-white">Our Collection</span>
        </div>

        {/* Collection Header */}
        <div className="text-center mb-24 relative">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">The Complete Library</h2>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Our Collection</h1>
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mb-8" />
          <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm">
            Discover our entire library of premium Extraits de Parfum. Each composition is an intricate balance of rare ingredients, crafted to evolve beautifully on your skin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-zinc-900/20 border border-white/5 animate-pulse min-h-[500px]" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="h-full"
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
                    handleAddToCart(product, quantity, selectedSizes[product.id] || product.sizeOptions[0].size as Size)
                  }
                  onAddToWishlist={handleAddToWishlist}
                  inWishlist={isInWishlist(product.id.toString())}
                  selectedSize={selectedSizes[product.id] || product.sizeOptions[0].size as Size}
                  onSizeSelect={(size) => handleSizeSelect(product.id, size as Size)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-gray-400">
              No products available at the moment.
            </div>
          )}
        </div>
      </main>

      
      <Footer />
    </div>
  )
}

