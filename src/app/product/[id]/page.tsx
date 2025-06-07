"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  Share2,
  Minus,
  Plus,
  Droplets,
  Clock,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Thermometer,
  Sun,
  Package,
  Maximize2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { useToast } from "@/components/ui/use-toast"
import Footer from "@/src/app/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { CartItem, Product } from "@/src/types/cart"
import { addToCart, updateCartItemQuantity, removeFromCart, calculateTotal, loadCart } from "@/src/utils/cartUtils"
import Cart from "@/src/app/components/Cart" // Make sure this import is present

// All perfumes data with updated fragrance notes
const baseUrl = "https://zdvvvqrrcowzjjpklmcz.supabase.co/storage/v1/object/public/vave-products-img-public"
const perfumes = [
  {
    id: 8,
    name: "Havoc", 
    tagline: "Woody • Aromatic • Masculine",
    price: 350, // Fixed price
    priceXL: 450, // Fixed price
    images: {
      "30ml": [`${baseUrl}/img/havoc.jpg`, `${baseUrl}/img/havoc30.jpg`, `${baseUrl}/img/havoc30.jpg`, `${baseUrl}/img/havoc30.jpg`],
      "50ml": [`${baseUrl}/img/havoc.jpg`, `${baseUrl}/img/havoc50.jpg`, `${baseUrl}/img/havoc50.jpg`, `${baseUrl}/img/havoc50.jpg`],
    },
    description: "A bold and sophisticated woody aromatic fragrance for the modern man.",
    longDescription: `
      <p>Havoc is a bold statement of confidence and charisma. This fragrance opens with invigorating top notes of bitter orange, green apple, and cardamom, creating an immediate fresh impression.</p>
      
      <p>The heart reveals a sophisticated blend of tea leaf, nutmeg, and geranium, balanced with aromatic accords that evoke a sense of refined masculinity.</p>
      
      <p>As it settles, the base notes of cedarwood, vetiver, and musk provide a warm, enduring foundation that ensures this scent makes a lasting impression.</p>
      
      <p>Crafted for the modern man who appreciates subtle complexity, Havoc is perfect for both everyday wear and special occasions.</p>
    `,
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: null,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
     
    ],
    sizeOptions: [
      { size: "30ml", price: 350 }, // Fixed price
      { size: "50ml", price: 450 }, // Fixed price
    ],
    specifications: {
      fragrance_family: "Woody Aromatic",
      concentration: "25% Perfume Oil",
      longevity: "8+ hours",
      sillage: "Moderate to Strong",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Bitter Orange", "Green Apple", "Cardamom"],
      heart: ["Tea Leaf", "Nutmeg", "Geranium"],
      base: ["Cedarwood", "Vetiver", "Musk"],
    },
    layeringOptions: [
      { id: 1, name: "Oceane", description: "Creates a refreshing aquatic blend" },
      { id: 2, name: "Euphoria", description: "Adds a floral dimension to the freshness" },
      { id: 5, name: "Mehfil", description: "Creates a sophisticated spicy-fresh blend" },
    ],
  },
  {
    id: 4,
    name: "Lavior",
    tagline: "Herbal • Smoky • Unique",
    price: 350,
    priceXL: 450,
    images: {
      "30ml": [`${baseUrl}/img/lavior.jpg`, `${baseUrl}/img/lavior30.jpg`, `${baseUrl}/img/lavior30.jpg`, `${baseUrl}/img/lavior30.jpg`],
      "50ml": [`${baseUrl}/img/lavior.jpg`, `${baseUrl}/img/lavior50.jpg`, `${baseUrl}/img/lavior50.jpg`, `${baseUrl}/img/lavior50.jpg`],
    },
    description: "A distinctive herbal and smoky fragrance with unique character.",
    longDescription: `
      <p>Lavior is a distinctive fragrance that combines herbal freshness with smoky depth. This unique scent creates an aura of sophistication and mystery.</p>
      
      <p>The opening notes of lavender and bergamot create a fresh, aromatic introduction that gradually transitions to a heart of clary sage and oud accord.</p>
      
      <p>The base notes of agarwood (oud), patchouli, and musk provide depth and longevity, ensuring this fragrance leaves a memorable impression throughout the day and into the evening.</p>
      
      <p>Perfect for those who appreciate refined elegance with a touch of mystery, lavior is ideal for special occasions and evening wear.</p>
    `,
    rating: 4.7,
    reviews: 98,
    isNew: false,
    isBestseller: false,
    isLimited: false,
    discount: 0,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Glycerin",
      "Coumarin",
      "Premix",
      "Benzyl Benzoate",
      "Geraniol",
      "Citronellol",
      "Eugenol",
    ],
    sizeOptions: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    specifications: {
      fragrance_family: "Woody Aromatic",
      concentration: "25% Perfume Oil",
      longevity: "8+ hours",
      sillage: "Strong",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Lavender", "Bergamot"],
      heart: ["Clary Sage", "Oud Accord"],
      base: ["Agarwood (Oud)", "Patchouli", "Musk"],
    },
    layeringOptions: [
      { id: 7, name: "Velora", description: "Creates a rich, luxurious oriental blend" },
      { id: 6, name: "Obsession", description: "Intensifies the oriental character" },
      { id: 3, name: "Duskfall", description: "Adds mystery and depth" },
    ],
  },
  {
    id: 3,
    name: "Duskfall",
    tagline: "Citrus • Amber • Sophisticated",
    price: 350,
    priceXL: 450,
    images: {
      "30ml": [`${baseUrl}/img/duskfall.jpg`, `${baseUrl}/img/duskfall30.jpg`, `${baseUrl}/img/duskfall30.jpg`, `${baseUrl}/img/duskfall30.jpg`],
      "50ml": [`${baseUrl}/img/duskfall.jpg`, `${baseUrl}/img/duskfall50.jpg`, `${baseUrl}/img/duskfall50.jpg`, `${baseUrl}/img/duskfall50.jpg`],
    },
    description: "A sophisticated citrus amber fragrance for the discerning individual.",
    longDescription: `
      <p>Duskfall captures the sophisticated transition from day to night. This enigmatic fragrance opens with bright citrus notes of Sicilian orange, ginger, and citron.</p>
      
      <p>The heart reveals a complex blend of neroli, black tea, and ambrox, adding depth and character to this sophisticated scent.</p>
      
      <p>As the fragrance settles, the base notes of olibanum, guaiac wood, and ambergris emerge, providing a rich, enduring foundation.</p>
      
      <p>Perfect for the sophisticated individual who appreciates complexity and refinement, Duskfall is ideal for evening events and special occasions.</p>
    `,
    rating: 4.6,
    reviews: 87,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: 0,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
      
    ],
    sizeOptions: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    specifications: {
      fragrance_family: "Citrus Amber",
      concentration: "25% Perfume Oil",
      longevity: "8+ hours",
      sillage: "Moderate to Strong",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Sicilian Orange", "Ginger", "Citron"],
      heart: ["Neroli", "Black Tea", "Ambrox"],
      base: ["Olibanum", "Guaiac Wood", "Ambergris"],
    },
    layeringOptions: [
      { id: 6, name: "Obsession", description: "Creates an intense, bold evening scent" },
      { id: 2, name: "Euphoria", description: "Adds a floral brightness to the mystery" },
      { id: 4, name: "lavior", description: "Enhances the oriental character" },
    ],
  },
  {
    id: 2,
    name: "Euphoria",
    tagline: "Floral • Romantic • Feminine",
    price: 350,
    priceXL: 450,
    images: {
      "30ml": [`${baseUrl}/img/euphoria.jpg`, `${baseUrl}/img/euphoria30.jpg`, `${baseUrl}/img/euphoria30.jpg`, `${baseUrl}/img/euphoria30.jpg`],
      "50ml": [`${baseUrl}/img/euphoria.jpg`, `${baseUrl}/img/euphoria50.jpg`, `${baseUrl}/img/euphoria50.jpg`, `${baseUrl}/img/euphoria50.jpg`],
    },
    description: "A romantic floral fragrance that celebrates feminine beauty.",
    longDescription: `
      <p>Euphoria is a joyful celebration of femininity in a bottle. This uplifting fragrance combines delicate floral notes with subtle fruity accords, creating a scent that evokes happiness and romance.</p>
      
      <p>The opening notes of pear, mandarin orange, and peony create a bright, cheerful introduction that transitions into a heart of osmanthus, rose, and magnolia, adding a sophisticated floral dimension.</p>
      
      <p>The base notes of sandalwood, patchouli, and vanilla provide a warm foundation that ensures the fragrance has lasting power while maintaining its uplifting character.</p>
      
      <p>Ideal for day wear and special moments when you want to feel your best, Euphoria is perfect for those who appreciate the beauty of floral fragrances with a modern twist.</p>
    `,
    rating: 4.9,
    reviews: 156,
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: 0,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
     
    ],
    sizeOptions: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    specifications: {
      fragrance_family: "Floral Fruity",
      concentration: "25% Perfume Oil",
      longevity: "8+ hours",
      sillage: "Moderate",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Pear", "Mandarin Orange", "Peony"],
      heart: ["Osmanthus", "Rose", "Magnolia"],
      base: ["Sandalwood", "Patchouli", "Vanilla"],
    },
    layeringOptions: [
      { id: 1, name: "Oceane", description: "Creates a fresh, uplifting blend" },
      { id: 3, name: "Duskfall", description: "Adds mystery to the floral character" },
      { id: 7, name: "Velora", description: "Enhances the richness of the florals" },
    ],
  },
  {
    id: 1,
    name: "Oceane",
    tagline: "Fresh • Aquatic • Sporty",
    price: 350,
    priceXL: 450,
    images: {
      "30ml": [`${baseUrl}/img/oceane.jpg`, `${baseUrl}/img/oceane30.jpg`, `${baseUrl}/img/oceane30.jpg`, `${baseUrl}/img/oceane30.jpg`],
      "50ml": [`${baseUrl}/img/oceane.jpg`, `${baseUrl}/img/oceane50.jpg`, `${baseUrl}/img/oceane50.jpg`, `${baseUrl}/img/oceane50.jpg`],
    },
    description: "A fresh aquatic fragrance that captures the essence of the ocean.",
    longDescription: `
      <p>Oceane captures the essence of the sea with its fresh, aquatic character. This refreshing fragrance transports you to the serene shores of a pristine beach.</p>
      
      <p>Opening with crisp green apple, bergamot, and lemon zest, it creates an immediate sense of freshness and clarity that's invigorating and uplifting.</p>
      
      <p>The heart of lavender, marine accord, and clary sage adds depth and complexity, while the base of vetiver, tonka bean, and musk provides a clean, lasting finish.</p>
      
      <p>Perfect for those who appreciate the energizing power of the ocean, Oceane is ideal for daytime wear, especially during warmer months or whenever you need a refreshing boost.</p>
    `,
    rating: 4.5,
    reviews: 112,
    isNew: false,
    isBestseller: false,
    isLimited: true,
    discount: 10,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
      
    ],
    sizeOptions: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
    specifications: {
      fragrance_family: "Fresh Aquatic",
      concentration: "25% Perfume Oil",
      longevity: "8+ hours",
      sillage: "Moderate",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Green Apple", "Bergamot", "Lemon Zest"],
      heart: ["Lavender", "Marine Accord", "Clary Sage"],
      base: ["Vetiver", "Tonka Bean", "Musk"],
    },
    layeringOptions: [
      { id: 8, name: "Havoc", description: "Creates a fresh, masculine blend" },
      { id: 2, name: "Euphoria", description: "Adds floral brightness to the aquatic base" },
      { id: 7, name: "Velora", description: "Creates an interesting contrast of fresh and warm" },
    ],
  },
  {
    id: 7,
    name: "Velora",
    tagline: "Gourmand • Warm • Seductive",
    price: 450,
    priceXL: 550,
    images: {
      "30ml": [`${baseUrl}/img/velora.jpg`, `${baseUrl}/img/velora30.jpg`, `${baseUrl}/img/velora30.jpg`, `${baseUrl}/img/velora30.jpg`],
      "50ml": [`${baseUrl}/img/velora.jpg`, `${baseUrl}/img/velora50.jpg`, `${baseUrl}/img/velora50.jpg`, `${baseUrl}/img/velora50.jpg`],
    },
    description: "A seductive gourmand fragrance with warm, inviting notes.",
    longDescription: `
      <p>Velora is a luxurious fragrance that envelops you in a warm embrace of gourmand notes. This sophisticated scent exudes elegance and seduction.</p>
      
      <p>The opening notes of pink pepper, orange blossom, and pear create a spicy-sweet, intriguing introduction that transitions into a heart of coffee, jasmine, and almond, adding depth and character.</p>
      
      <p>The base notes of vanilla, patchouli, and cedarwood provide a warm, sensual foundation that ensures the fragrance has remarkable longevity and presence.</p>
      
      <p>Perfect for those who appreciate depth and sophistication in their fragrances, Velora is ideal for evening events, special occasions, and moments when you want to make a lasting impression.</p>
    `,
    rating: 4.8,
    reviews: 92,
    isNew: true,
    isBestseller: false,
    isLimited: true,
    discount: 0,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
     
    ],
    sizeOptions: [
      { size: "30ml", price: 450 },
      { size: "50ml", price: 550 },
    ],
    specifications: {
      fragrance_family: "Gourmand",
      concentration: "25% Perfume Oil",
      longevity: "8+ hours",
      sillage: "Strong",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Pink Pepper", "Orange Blossom", "Pear"],
      heart: ["Coffee", "Jasmine", "Almond"],
      base: ["Vanilla", "Patchouli", "Cedarwood"],
    },
    layeringOptions: [
      { id: 4, name: "lavior", description: "Creates a rich, complex oriental blend" },
      { id: 6, name: "Obsession", description: "Intensifies the warm, spicy character" },
      { id: 2, name: "Euphoria", description: "Adds a floral brightness to the warmth" },
    ],
  },
  {
    id: 6,
    name: "Obsession",
    tagline: "Spicy • Intense • Addictive",
    price: 450,
    priceXL: 550,
    images: {
      "30ml": [`${baseUrl}/img/obsession.jpg`, `${baseUrl}/img/obsession30.jpg`, `${baseUrl}/img/obsession30.jpg`, `${baseUrl}/img/obsession30.jpg`],
      "50ml": [`${baseUrl}/img/obsession.jpg`, `${baseUrl}/img/obsession50.jpg`, `${baseUrl}/img/obsession50.jpg`, `${baseUrl}/img/obsession50.jpg`],
    },
    description: "An intense and addictive spicy fragrance that commands attention.",
    longDescription: `
      <p>Obsession is an intense and captivating fragrance that leaves a lasting impression. This rich spicy scent is designed for those who aren't afraid to stand out.</p>
      
      <p>The opening notes of cardamom and red berries create a spicy, warm introduction that immediately commands attention and transitions into a heart of toffee and cinnamon bark, adding a sweet and spicy dimension.</p>
      
      <p>The base notes of amberwood, tonka bean, and leather provide a sensual, long-lasting foundation that ensures this fragrance remains memorable throughout the day and night.</p>
      
      <p>Perfect for those who appreciate bold, statement fragrances, Obsession is ideal for evening events and special occasions when you want to make an unforgettable impression.</p>
    `,
    rating: 4.7,
    reviews: 85,
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: 0,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
    
    ],
    sizeOptions: [
      { size: "30ml", price: 450 },
      { size: "50ml", price: 550 },
    ],
    specifications: {
      fragrance_family: "Spicy Oriental",
      concentration: "25% Perfume Oil",
      longevity: "10+ hours",
      sillage: "Very Strong",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Cardamom", "Red Berries"],
      heart: ["Toffee", "Cinnamon Bark"],
      base: ["Amberwood", "Tonka Bean", "Leather"],
    },
    layeringOptions: [
      { id: 3, name: "Duskfall", description: "Creates a mysterious, intense evening scent" },
      { id: 7, name: "Velora", description: "Enhances the rich, warm character" },
      { id: 5, name: "Mehfil", description: "Creates a complex, spicy oriental masterpiece" },
    ],
  },
  {
    id: 5,
    name: "Mehfil",
    tagline: "Amber • Sweet • Opulent",
    price: 450,
    priceXL: 550,
    images: {
      "30ml": [`${baseUrl}/img/mehfil.jpg`, `${baseUrl}/img/mehfil30.jpg`, `${baseUrl}/img/mehfil30.jpg`, `${baseUrl}/img/mehfil30.jpg`],
      "50ml": [`${baseUrl}/img/mehfil.jpg`, `${baseUrl}/img/mehfil50.jpg`, `${baseUrl}/img/mehfil50.jpg`, `${baseUrl}/img/mehfil50.jpg`],
    },
    description: "An opulent amber fragrance with sweet, rich character.",
    longDescription: `
      <p>Mehfil captures the essence of opulence with its rich, amber character. This luxurious fragrance is a tribute to indulgence and celebration.</p>
      
      <p>The opening notes of saffron and jasmine create a warm, floral introduction that evokes the atmosphere of a lavish gathering, transitioning into a heart of amberwood and ambergris, adding depth and richness.</p>
      
      <p>The base notes of fir resin, cedarwood, and musk provide a rich, long-lasting foundation that ensures this fragrance remains memorable throughout special occasions.</p>
      
      <p>Perfect for those who appreciate richness and depth in their fragrances, Mehfil is ideal for special celebrations and moments when you want to make a sophisticated statement.</p>
    `,
    rating: 4.9,
    reviews: 110,
    isNew: true,
    isBestseller: true,
    isLimited: false,
    discount: 0,
    ingredients: [
      "Ethanol",
      "Parfum (Fragrance)",
      "Aqua (Water)",
      "Premix",
      "Glycerin",
    ],
    sizeOptions: [
      { size: "30ml", price: 450 },
      { size: "50ml", price: 550 },
    ],
    specifications: {
      fragrance_family: "Amber",
      concentration: "25% Perfume Oil",
      longevity: "10+ hours",
      sillage: "Very Strong",
      launch_year: "2025",
    },
    fragranceNotes: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris"],
      base: ["Fir Resin", "Cedarwood", "Musk"],
    },
    layeringOptions: [
      { id: 6, name: "Obsession", description: "Creates an intense, rich oriental masterpiece" },
      { id: 8, name: "Havoc", description: "Adds freshness to the rich spicy character" },
      { id: 4, name: "lavior", description: "Enhances the oriental character with herbal notes" },
    ],
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState("30ml")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false)

  // Find the current product based on the ID in the URL
  const productId = Number(params.id)
  const product = perfumes.find((p) => p.id === productId) || perfumes[0]

  // Load cart from localStorage on component mount
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

  // Handle keyboard navigation in fullscreen gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreenGallery) return

      if (e.key === "Escape") {
        setIsFullscreenGallery(false)
      } else if (e.key === "ArrowRight") {
        handleNextImage()
      } else if (e.key === "ArrowLeft") {
        handlePrevImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreenGallery, currentImage])

  // Prevent body scroll when fullscreen gallery is open
  useEffect(() => {
    if (isFullscreenGallery) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreenGallery])

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images[selectedSize as "30ml" | "50ml"].length)
  }

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images[selectedSize as "30ml" | "50ml"].length) % product.images[selectedSize as "30ml" | "50ml"].length)
  }

  const addToCart = () => {
    try {
      setIsAnimating(true)

      setTimeout(() => {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.size === selectedSize)
        const currentPrice = selectedSize === "30ml" ? 350 : 450 // Fixed price values

        let updatedCart
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updatedCart = [...cart]
          updatedCart[existingItemIndex].quantity += quantity
        } else {
          // Add new item to cart
          updatedCart = [
            ...cart,
            {
              id: product.id,
              name: product.name,
              price: currentPrice,
              image: product.images[selectedSize as "30ml" | "50ml"][0],
              quantity: quantity,
              size: selectedSize,
              type: "single" as const, // Ensure literal type
            },
          ]
        }

        setCart(updatedCart)
        localStorage.setItem("cart", JSON.stringify(updatedCart))

        toast({
          title: "Added to Cart",
          description: `${quantity} × ${product.name} (${selectedSize}) has been added to your cart.`,
        })

        setIsAnimating(false)
      }, 800)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setIsAnimating(false)
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = () => {
    addToCart()
    router.push("/checkout")
  }

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  // Update the share function to include the current URL and handle more share methods
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        // Use native share if available (mobile devices)
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard with enhanced feedback
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied!",
          description: "Share link has been copied to your clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "Please try copying the URL manually",
        variant: "destructive"
      })
    }
  }

  // Filter out the current product from recommendations
  const recommendations = perfumes.filter((p) => p.id !== product.id).slice(0, 4)

  // Image labels for better context
  const imageLabels = ["Front View", "Side View", "Back View", "Lifestyle"]

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const updateQuantity = (id: number, size: string, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromCart = (id: number, size: string) => {
    const updatedCart = cart.filter((item) => !(item.id === id && item.size === size))
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black"
    >
      <SimpleNavbar />

      {/* Update container max width and padding */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center text-sm text-gray-400 mb-6"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/collection" className="hover:text-white transition-colors">
            Collection
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">{product.name}</span>
        </motion.div>

        {/* Main Product Section - Update grid columns */}
        <div className="relative">
          {/* Background Glass Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-white/5 backdrop-blur-md border border-white/10"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-4 lg:p-8">
            {/* Product Images - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full space-y-4"
            >
              {/* Main Image - Updated to fit edge to edge */}
              <div
                className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 backdrop-blur-md border border-white/20 shadow-lg group cursor-pointer"
                onClick={() => setIsFullscreenGallery(true)}
              >
                <Image
                  src={product.images[selectedSize as "30ml" | "50ml"][currentImage]}
                  alt={`${product.name} ${selectedSize} - ${imageLabels[currentImage]}`}
                  fill
                  className="object-cover w-full h-full" // Changed from object-contain to object-cover
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge className="bg-white text-black hover:bg-gray-200 px-3 py-1 text-xs rounded-full font-medium">
                        NEW
                      </Badge>
                    </motion.div>
                  )}
                  {product.isBestseller && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Badge className="bg-gray-800 text-white hover:bg-gray-700 px-3 py-1 text-xs rounded-full font-medium">
                        BESTSELLER
                      </Badge>
                    </motion.div>
                  )}
                  {product.isLimited && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Badge className="bg-gray-600 text-white hover:bg-gray-500 px-3 py-1 text-xs rounded-full font-medium">
                        LIMITED EDITION
                      </Badge>
                    </motion.div>
                  )}
                  {product.discount && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Badge className="bg-black text-white hover:bg-gray-900 px-3 py-1 text-xs rounded-full font-medium">
                        {product.discount}% OFF
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Wishlist Button - Fixed Position */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToWishlist()
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 ${
                    isWishlisted ? "bg-white text-black" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${
                      isWishlisted ? "fill-current scale-110" : "scale-100"
                    }`}
                  />
                </motion.button>

                {/* Size Badge */}
                <div className="absolute bottom-4 right-4 z-10">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                    <Badge className="bg-black/70 hover:bg-black text-white px-4 py-2 text-sm rounded-full font-bold backdrop-blur-sm">
                      {selectedSize}
                    </Badge>
                  </motion.div>
                </div>

                {/* Fullscreen indicator */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Navigation Arrows */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-300"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>

              {/* Thumbnail Grid - Updated spacing */}
              <div className="grid grid-cols-4 gap-4 px-1">
                {product.images[selectedSize as "30ml" | "50ml"].map((image, index) => (
                  <motion.button
                    key={`${selectedSize}-thumb-${index}`}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      currentImage === index 
                        ? "ring-2 ring-white/80 scale-105 z-10" 
                        : "ring-1 ring-white/20 hover:ring-white/40"
                    }`}
                    onClick={() => setCurrentImage(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${imageLabels[index]}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                        {imageLabels[index]}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Details - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full flex flex-col"
            >
              {/* Product Title and Tagline */}
              <div className="mb-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {product.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-gray-300"
                >
                  {product.tagline}
                </motion.p>
              </div>

              {/* Rating and Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col md:flex-row md:items-center justify-between mb-8"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.svg
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + star * 0.1 }}
                        className={`h-5 w-5 ${
                          star <= Math.round(product.rating) ? "text-white fill-white" : "text-gray-600"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.934l-6.18 3.254 1.18-6.875L.5 7.938l6.902-1.004L10 .79l2.598 6.144 6.902  1.004-4.5 4.375 1.18 6.875L10 15.934z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-300">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2 text-white">
                  ₹{selectedSize === "30ml" ? "350" : "450"}
                </div>
              </motion.div>

              {/* Size Selection - Always Buttons, Responsive */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3 text-gray-200 uppercase tracking-wider">
                  Select Size
                </h3>
                <div className="flex gap-4 flex-col xs:flex-row sm:flex-row">
                  {product.sizeOptions.map((option, index) => (
                    <button
                      key={option.size}
                      onClick={() => {
                        setSelectedSize(option.size)
                        setCurrentImage(0)
                      }}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-300 text-base font-bold ${
                        selectedSize === option.size
                          ? "border-white bg-white/10 text-white"
                          : "border-gray-600 text-gray-300 hover:border-gray-400"
                      }`}
                      style={{ minWidth: 100 }}
                    >
                      <div>{option.size}</div>
                      <div className="text-sm font-normal">₹{option.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mb-8"
              >
                <h3 className="text-sm font-medium mb-4 text-gray-200 uppercase tracking-wider">Fragrance Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["top", "heart", "base"].map((noteType, index) => (
                    <motion.div
                      key={noteType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="rounded-xl p-4 text-white bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <h4 className="text-xs uppercase mb-2 opacity-80 font-medium">
                        {noteType === "top" ? "Top Notes" : noteType === "heart" ? "Heart Notes" : "Base Notes"}
                      </h4>
                      <ul className="space-y-1">
                        {product.fragranceNotes[noteType as keyof typeof product.fragranceNotes].map(
                          (note, noteIndex) => (
                            <motion.li
                              key={noteIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2 + index * 0.1 + noteIndex * 0.05 }}
                              className="text-sm font-medium"
                            >
                              {note}
                            </motion.li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Product Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">High Concentration</h4>
                    <p className="text-sm text-gray-300">25% Perfume Oil</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">Long Lasting</h4>
                    <p className="text-sm text-gray-300">8+ hours longevity</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="mb-8"
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-300">{product.description}</p>
                  <AnimatePresence>
                    {showFullDescription && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-white flex items-center text-sm font-medium hover:text-gray-300 transition-colors"
                >
                  {showFullDescription ? "Show Less" : "Read More"}
                  {showFullDescription ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </motion.button>
              </motion.div>

              {/* Quantity Selector and Add to Cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden flex justify-between items-center">
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="p-4 w-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-6 w-6 text-white" />
                    </motion.button>
                    <div className="px-8 py-4 min-w-[80px] text-center font-bold text-2xl text-white">
                      {quantity}
                    </div>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 w-20 transition-colors flex justify-center"
                    >
                      <Plus className="h-6 w-6 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Updated Cart and Buy Now Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 px-4">
                  <motion.button
                    onClick={addToCart}
                    className="flex-1 py-4 px-6 rounded-xl flex items-center justify-center font-medium text-black bg-white hover:bg-gray-200 relative overflow-hidden transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isAnimating}
                  >
                    {isAnimating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        ADDING TO CART...
                      </span>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        ADD TO CART
                      </>
                    )}

                    {isAnimating && (
                      <motion.span
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          scale: [1, 1.5, 1.8],
                          opacity: [0.7, 0.5, 0],
                        }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-6 rounded-xl flex items-center justify-center font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BUY NOW
                  </motion.button>
                </div>
              </motion.div>

              {/* Layering Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mb-8 p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                <div className="flex items-center mb-4">
                  <Sparkles className="h-5 w-5 mr-2 text-white" />
                  <h3 className="font-medium text-white">Perfect Layering Combinations</h3>
                </div>
                <div className="space-y-4">
                  {product.layeringOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7 + index * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                    >
                      <div>
                        <span className="font-medium text-white">{option.name}</span>
                        <p className="text-xs text-gray-300">{option.description}</p>
                      </div>
                      <Link href={`/product/${option.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-white text-black hover:bg-gray-200 transition-colors"
                        >
                          VIEW
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/layering">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-white text-white hover:bg-white hover:text-black transition-colors"
                    >
                      EXPLORE ALL LAYERING OPTIONS
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Product Details Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
                className="mb-8"
              >
                <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
                  {["specifications", "ingredients", "how-to-apply", "warnings", "storage"].map((tab, index) => (
                    <motion.button
                      key={tab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 text-sm font-medium capitalize whitespace-nowrap ${
                        activeTab === tab ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab.replace("-", " ")}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "specifications" && (
                    <motion.div
                      key="specifications"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 border-b border-gray-700 pb-2">
                            <div className="font-medium capitalize text-gray-300">{key.replace("_", " ")}</div>
                            <div className="text-white">{value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "ingredients" && (
                    <motion.div
                      key="ingredients"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="mb-4 text-gray-300">Our fragrances are crafted with the finest ingredients:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.ingredients.map((ingredient, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center p-2 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <Check className="h-4 w-4 mr-2 text-white" />
                            <span className="text-sm text-gray-300">{ingredient}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "how-to-apply" && (
                    <motion.div
                      key="how-to-apply"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3">How to Apply Your Fragrance</h4>
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start p-3 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white">
                              1
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Apply to Pulse Points</h5>
                              <p className="text-sm text-gray-300">
                                Spray on wrists, neck, behind ears, and inside elbows where blood vessels are close to
                                the skin.
                              </p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start p-3 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white">
                              2
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Don't Rub</h5>
                              <p className="text-sm text-gray-300">
                                Let the fragrance dry naturally. Rubbing can break down the fragrance molecules.
                              </p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start p-3 rounded-lg bg-white/5 backdrop-blur-md"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-white">
                              3
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Layer for Intensity</h5>
                              <p className="text-sm text-gray-300">
                                For stronger scent, apply to clothing or hair from 6 inches away.
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "warnings" && (
                    <motion.div
                      key="warnings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3">Important Warnings</h4>
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">
                              For external use only. Avoid contact with eyes.
                            </span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Discontinue use if skin irritation occurs.</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Keep away from heat, sparks, and open flames.</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <AlertTriangle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Keep out of reach of children and pets.</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "storage" && (
                    <motion.div
                      key="storage"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3">Storage Advice</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Thermometer className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Temperature</h5>
                            </div>
                            <p className="text-sm text-gray-300">
                              Store in a cool place, ideally between 15-20°C (59-68°F).
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Sun className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Light</h5>
                            </div>
                            <p className="text-sm text-gray-300">Keep away from direct sunlight and UV rays.</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Droplets className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Humidity</h5>
                            </div>
                            <p className="text-sm text-gray-300">
                              Avoid humid areas like bathrooms. Store in dry conditions.
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                          >
                            <div className="flex items-center mb-2">
                              <Package className="h-5 w-5 text-white mr-2" />
                              <h5 className="font-medium text-white">Original Box</h5>
                            </div>
                            <p className="text-sm text-gray-300">Keep in original packaging when not in use.</p>
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
                        >
                          <div className="flex items-start">
                            <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-white mb-1">Pro Tip</h5>
                              <p className="text-sm text-gray-300">
                                Properly stored fragrances can last 3-5 years. Always cap tightly after use to prevent
                                evaporation.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Share Button - Fixed Position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">SHARE</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* You May Also Like Section - Update layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 lg:mt-24"
        >
          <h2 className="text-2xl font-bold mb-8 text-white px-4">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {recommendations.map((perfume, index) => (
              <motion.div
                key={perfume.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
                onClick={() => router.push(`/product/${perfume.id}`)}
              >
                {/* Image Container - Update sizing */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
                  <Image
                    src={perfume.images["30ml"][0]}
                    alt={perfume.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                
                {/* Product Info - Update spacing */}
                <div className="mt-4 space-y-2 px-2">
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white">{perfume.name}</h3>
                  <p className="text-xs sm:text-sm text-white/80">{perfume.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-white">₹{perfume.price}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-3 w-3 ${
                            star <= Math.round(perfume.rating) ? "text-white fill-white" : "text-gray-600"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.934l-6.18 3.254 1.18-6.875L.5 7.938l6.902-1.004L10 .79l2.598 6.144 6.902  1.004-4.5 4.375 1.18 6.875L10 15.934z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreenGallery && (
          <motion.div

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <div className="absolute top-4 right-4 z-10">
              <motion.button
                onClick={() => setIsFullscreenGallery(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {product.images[selectedSize as "30ml" | "50ml"].map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-2 h-2 rounded-full ${
                    currentImage === index ? "bg-white" : "bg-white/40"
                  } transition-colors duration-200`}
                />
              ))}
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <motion.button
                onClick={handlePrevImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <motion.button
                onClick={handleNextImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="flex flex-col items-center max-w-[90vw] max-h-[90vh]">
              <div className="relative w-full h-full">
                <Image
                  src={product.images[selectedSize as "30ml" | "50ml"][currentImage]}
                  alt={`${product.name} ${selectedSize} - ${imageLabels[currentImage]}`}
                  width={1200}
                  height={1200}
                  className="object-contain w-full h-full transform scale-110 transition-transform duration-500"
                />
              </div>
              <p className="text-white mt-4 text-lg font-medium">{imageLabels[currentImage]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart />

      <Footer />
    </motion.div>
  )
}
