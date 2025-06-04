"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, ChevronDown } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import ProductCard from "@/src/app/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

// Mock data for new arrivals
const newArrivals = [
  {
    id: 101,
    name: "Midnight Bloom",
    price: 450,
    image: "/img/new-arrival-1.jpg",
    description: "A captivating floral fragrance with notes of jasmine and vanilla.",
    rating: 4.9,
    reviews: 12,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: null,
    tags: ["floral", "night", "feminine"],
    offers: ["Launch offer: 10% off for first 100 customers", "Free shipping on orders above ₹1000"],
  },
  {
    id: 102,
    name: "Urban Edge",
    price: 550,
    image: "/img/new-arrival-2.jpg",
    description: "A bold and sophisticated scent for the modern man.",
    rating: 4.8,
    reviews: 8,
    isNew: true,
    isBestseller: false,
    isLimited: true,
    discount: null,
    tags: ["woody", "spicy", "masculine"],
    offers: ["Limited edition: Only 500 bottles available", "Free shipping on orders above ₹1000"],
  },
  {
    id: 103,
    name: "Citrus Breeze",
    price: 350,
    image: "/img/new-arrival-3.jpg",
    description: "A refreshing blend of citrus notes perfect for summer days.",
    rating: 4.7,
    reviews: 15,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: 10,
    tags: ["citrus", "fresh", "summer"],
    offers: ["Introductory offer: 10% off", "Free shipping on orders above ₹1000"],
  },
  {
    id: 104,
    name: "Velvet Oud",
    price: 650,
    image: "/img/new-arrival-4.jpg",
    description: "A luxurious oriental fragrance with rich oud and amber notes.",
    rating: 5.0,
    reviews: 6,
    isNew: true,
    isBestseller: false,
    isLimited: true,
    discount: null,
    tags: ["oriental", "oud", "luxury"],
    offers: ["Premium collection: Free gift box", "Free shipping on orders above ₹1000"],
  },
  {
    id: 105,
    name: "Ocean Mist",
    price: 400,
    image: "/img/new-arrival-5.jpg",
    description: "A fresh aquatic scent that captures the essence of the sea.",
    rating: 4.6,
    reviews: 9,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: null,
    tags: ["aquatic", "fresh", "unisex"],
    offers: ["New launch: Free sample with purchase", "Free shipping on orders above ₹1000"],
  },
  {
    id: 106,
    name: "Golden Amber",
    price: 500,
    image: "/img/new-arrival-6.jpg",
    description: "A warm and sensual fragrance with amber and vanilla notes.",
    rating: 4.8,
    reviews: 11,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: 15,
    tags: ["amber", "warm", "evening"],
    offers: ["Early bird offer: 15% off for first week", "Free shipping on orders above ₹1000"],
  },
]

export default function NewArrivalsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

  // Filter categories
  const categories = [
    { id: "floral", label: "Floral" },
    { id: "woody", label: "Woody" },
    { id: "oriental", label: "Oriental" },
    { id: "fresh", label: "Fresh" },
    { id: "citrus", label: "Citrus" },
  ]

  // Filter tags
  const tags = [
    { id: "masculine", label: "Masculine" },
    { id: "feminine", label: "Feminine" },
    { id: "unisex", label: "Unisex" },
    { id: "summer", label: "Summer" },
    { id: "winter", label: "Winter" },
    { id: "evening", label: "Evening" },
    { id: "luxury", label: "Luxury" },
  ]

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Handle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  // Filter products based on selected filters
  const filteredProducts = newArrivals.filter((product) => {
    // Filter by price
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      const productCategories = product.tags.filter((tag) => categories.some((cat) => cat.id === tag))
      if (!productCategories.some((cat) => selectedCategories.includes(cat))) {
        return false
      }
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      const productTags = product.tags.filter((tag) => tags.some((t) => t.id === tag))
      if (!productTags.some((tag) => selectedTags.includes(tag))) {
        return false
      }
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
      default:
        return b.id - a.id
    }
  })

  // Handle adding to cart
  const handleAddToCart = (product: any, quantity: number, size: string) => {
    console.log("Added to cart:", { product, quantity, size })
    // In a real app, this would add the product to the cart
  }

  // Handle adding to wishlist
  const handleAddToWishlist = (product: any) => {
    console.log("Added to wishlist:", product)
    // In a real app, this would add the product to the wishlist
  }

  // Handle quick view
  const handleQuickView = (product: any) => {
    console.log("Quick view:", product)
    // In a real app, this would open a quick view modal
  }

  return (
    <>
      <Navbar setIsCartOpen={() => {}} />
      <main className="container mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">New Arrivals</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover our latest fragrances, crafted with the finest ingredients and designed to make a lasting
            impression.
          </p>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <Button variant="outline" className="mb-4 md:mb-0" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </Button>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sort by:</span>
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-medium mb-4">Tags</h3>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => toggleTag(tag.id)}
                        />
                        <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {tag.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setPriceRange([0, 1000])
                    setSelectedCategories([])
                    setSelectedTags([])
                  }}
                >
                  Reset Filters
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={handleQuickView}
              />
            ))}
          </div>

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No products match your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 1000])
                  setSelectedCategories([])
                  setSelectedTags([])
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
