export interface Product {
  id: number
  name: string
  price: number
  priceXL: number
  image: string
  images: string[]
  description: string
  longDescription: string
  rating: number
  reviews: number
  isNew: boolean
  isBestseller: boolean
  isLimited: boolean
  discount: number
  category: string
  gender: string
  occasion: string[]
  season: string[]
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  sizes: string[]
  intensity: string
  longevity: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Havoc",
    price: 350,
    priceXL: 450,
    image: "/img/havoc50.png",
    images: ["/img/havoc50.png", "/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    description: "A bold and sophisticated woody fragrance with notes of cedar and amber.",
    longDescription:
      "Havoc is a bold and sophisticated woody fragrance that commands attention. With top notes of bergamot and black pepper, a heart of cedar and amber, and a base of musk and vetiver, this scent is perfect for the confident individual who isn't afraid to make a statement.",
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: 0,
    category: "Woody",
    gender: "Unisex",
    occasion: ["Evening", "Special Occasion"],
    season: ["Autumn", "Winter"],
    notes: {
      top: ["Bergamot", "Black Pepper"],
      heart: ["Cedar", "Amber"],
      base: ["Musk", "Vetiver"],
    },
    sizes: ["30ml", "50ml"],
    intensity: "Strong",
    longevity: "8-10 hours",
  },
  {
    id: 2,
    name: "Oceane",
    price: 350,
    priceXL: 450,
    image: "/img/oceane50.png",
    images: ["/img/oceane50.png", "/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    description: "A deep, aquatic fragrance that evokes the mystery of the ocean.",
    longDescription:
      "Oceane captures the essence of the sea with its fresh, aquatic character. Opening with crisp sea salt and citrus notes, it develops into a heart of aquatic accords before settling into a clean base of white musk. This refreshing scent is perfect for those who appreciate the calming power of the ocean.",
    rating: 4.5,
    reviews: 112,
    isNew: false,
    isBestseller: false,
    isLimited: true,
    discount: 10,
    category: "Fresh",
    gender: "Unisex",
    occasion: ["Daytime", "Casual", "Beach"],
    season: ["Spring", "Summer"],
    notes: {
      top: ["Sea Salt", "Citrus"],
      heart: ["Aquatic Notes", "Lotus"],
      base: ["White Musk", "Cedar"],
    },
    sizes: ["30ml", "50ml"],
    intensity: "Light to Moderate",
    longevity: "4-6 hours",
  },
  {
    id: 3,
    name: "Euphoria",
    price: 350,
    priceXL: 450,
    image: "/img/euphoria50.png",
    images: ["/img/euphoria50.png", "/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    description: "An exhilarating blend of fruity and floral notes that lifts your spirits.",
    longDescription:
      "Euphoria is a joyful celebration in a bottle. This uplifting fragrance combines delicate floral notes of rose and jasmine with subtle fruity accords, creating a scent that evokes happiness and romance. Ideal for day wear and special moments when you want to feel your best.",
    rating: 4.9,
    reviews: 156,
    isNew: false,
    isBestseller: true,
    isLimited: false,
    discount: 0,
    category: "Floral",
    gender: "Unisex",
    occasion: ["Daytime", "Casual", "Office"],
    season: ["Spring", "Summer"],
    notes: {
      top: ["Peach", "Bergamot"],
      heart: ["Rose", "Jasmine", "Peony"],
      base: ["Musk", "Amber"],
    },
    sizes: ["30ml", "50ml"],
    intensity: "Moderate",
    longevity: "5-7 hours",
  },
  {
    id: 4,
    name: "Duskfall",
    price: 350,
    priceXL: 450,
    image: "/img/duskfall50.png",
    images: ["/img/duskfall50.png", "/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    description: "A mysterious and alluring scent perfect for evening wear.",
    longDescription:
      "Duskfall captures the mysterious transition from day to night. This enigmatic fragrance opens with bright citrus notes that gradually give way to a heart of spices and woods, finally settling into a deep base of vetiver and sandalwood. Perfect for the adventurous spirit.",
    rating: 4.6,
    reviews: 87,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: 0,
    category: "Woody",
    gender: "Unisex",
    occasion: ["Evening", "Night Out"],
    season: ["All Seasons"],
    notes: {
      top: ["Citrus", "Bergamot"],
      heart: ["Spices", "Cedar"],
      base: ["Vetiver", "Sandalwood"],
    },
    sizes: ["30ml", "50ml"],
    intensity: "Moderate",
    longevity: "6-8 hours",
  },
  {
    id: 5,
    name: "Obsession",
    price: 450,
    priceXL: 550,
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    description: "An intense and captivating fragrance that leaves a lasting impression.",
    longDescription:
      "Obsession is an intense and captivating fragrance designed for those who want to make a lasting impression. With rich notes of vanilla, amber, and exotic spices, this scent creates an aura of mystery and allure that's impossible to ignore. Perfect for evening wear and special occasions.",
    rating: 4.7,
    reviews: 93,
    isNew: true,
    isBestseller: false,
    isLimited: false,
    discount: 0,
    category: "Oriental",
    gender: "Unisex",
    occasion: ["Evening", "Night Out", "Special Occasion"],
    season: ["Autumn", "Winter"],
    notes: {
      top: ["Cardamom", "Bergamot"],
      heart: ["Vanilla", "Cinnamon"],
      base: ["Amber", "Patchouli"],
    },
    sizes: ["30ml", "50ml"],
    intensity: "Strong",
    longevity: "8-10 hours",
  },
  {
    id: 6,
    name: "Velora",
    price: 450,
    priceXL: 550,
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    description: "A luxurious and velvety fragrance with rich floral and amber notes.",
    longDescription:
      "Velora is a luxurious fragrance that wraps you in a velvety embrace of rich florals and warm amber. Opening with delicate iris and violet, it develops into a heart of rose and jasmine before settling into a base of amber and sandalwood. This sophisticated scent is perfect for those who appreciate timeless elegance.",
    rating: 4.8,
    reviews: 78,
    isNew: true,
    isBestseller: false,
    isLimited: true,
    discount: 0,
    category: "Floral",
    gender: "Unisex",
    occasion: ["Evening", "Special Occasion"],
    season: ["Autumn", "Winter"],
    notes: {
      top: ["Iris", "Violet"],
      heart: ["Rose", "Jasmine"],
      base: ["Amber", "Sandalwood"],
    },
    sizes: ["30ml", "50ml"],
    intensity: "Moderate to Strong",
    longevity: "7-9 hours",
  },
]

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductByName = (name: string): Product | undefined => {
  return products.find((product) => product.name.toLowerCase() === name.toLowerCase())
}
