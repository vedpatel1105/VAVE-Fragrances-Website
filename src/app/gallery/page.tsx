"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Image from "next/image"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Instagram, ExternalLink } from "lucide-react"

// Add this CSS
const perspectiveStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
`

// Sample gallery images
const galleryImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Havoc Perfume",
    caption: "Havoc - Bold and sophisticated",
    category: "Product",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Oceane Perfume",
    caption: "Oceane - Fresh and aquatic",
    category: "Product",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Euphoria Perfume",
    caption: "Euphoria - Joyful and uplifting",
    category: "Product",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Duskfall Perfume",
    caption: "Duskfall - Mysterious and alluring",
    category: "Product",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Obsession Perfume",
    caption: "Obsession - Intense and captivating",
    category: "Product",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Velora Perfume",
    caption: "Velora - Luxurious and velvety",
    category: "Product",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Perfume Collection",
    caption: "The complete VAVE collection",
    category: "Collection",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Perfume Ingredients",
    caption: "Premium ingredients for exceptional fragrances",
    category: "Ingredients",
  },
  {
    id: 9,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Perfume Making",
    caption: "Crafting perfection",
    category: "Behind the Scenes",
  },
  {
    id: 10,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Perfume Packaging",
    caption: "Elegant packaging for a premium experience",
    category: "Packaging",
  },
  {
    id: 11,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Perfume Event",
    caption: "VAVE launch event",
    category: "Events",
  },
  {
    id: 12,
    src: "/placeholder.svg?height=600&width=600",
    alt: "VAVE Perfume Lifestyle",
    caption: "VAVE - Part of your lifestyle",
    category: "Lifestyle",
  },
]

const categories = [
  "All",
  "Product",
  "Collection",
  "Ingredients",
  "Behind the Scenes",
  "Packaging",
  "Events",
  "Lifestyle",
]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredImages =
    selectedCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

  return (
    <>
      <style jsx global>
        {perspectiveStyles}
      </style>
      <SimpleNavbar setIsCartOpen={() => {}} />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Inspiration Gallery</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of VAVE fragrances through captivating imagery. Get inspired and discover the essence
            of our brand.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-accent text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer transform-gpu perspective-1000"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: -5,
                transition: { duration: 0.2 },
              }}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=600&width=600"
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end transform-gpu"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="p-4 w-full">
                  <p className="text-white font-medium">{image.caption}</p>
                  <p className="text-white/70 text-sm">{image.category}</p>
                </div>
              </div>
              <div
                className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ transform: "translateZ(-20px)" }}
              ></div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Follow us on Instagram for more inspiration and updates
          </p>
          <a
            href="https://instagram.com/vavefragrances"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span>@vavefragrances</span>
          </a>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white z-10"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-square sm:aspect-[4/3] md:aspect-[16/9] w-full">
                <Image
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=600&width=600"
                  }}
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-1">{selectedImage.caption}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedImage.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">VAVE Fragrances</span>
                  <a
                    href="https://instagram.com/vavefragrances"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View on Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
