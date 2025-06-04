"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, ShoppingBag, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Define a more structured product data format
interface PerfumeProduct {
  id: number
  name: string
  fullName: string
  description: string
  price: number
  image: string
  sizes: { size: string; price: number }[]
}

// Define our perfume products with complete information
const perfumeProducts: Record<string, PerfumeProduct> = {
  havoc: {
    id: 1,
    name: "Havoc",
    fullName: "Havoc - Bold & Intense",
    description: "A bold and intense fragrance for men with woody and spicy notes.",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
  },
  lavior: {
    id: 2,
    name: "Lavior",
    fullName: "Lavior - Rich Lavender Oud",
    description: "A rich lavender oud perfume with deep oriental notes.",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
  },
  duskfall: {
    id: 3,
    name: "Duskfall",
    fullName: "Duskfall - Cool & Refreshing",
    description: "Refreshing cool water scent for a fresh vibe.",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
  },
  ociene: {
    id: 4,
    name: "Ociene",
    fullName: "Ociene - Sweet & Charming",
    description: "A sweet and charming fragrance for men with vanilla notes.",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
  },
  euphoria: {
    id: 5,
    name: "Euphoria",
    fullName: "Euphoria - Floral & Elegant",
    description: "A delicate floral scent perfect for women.",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    sizes: [
      { size: "30ml", price: 350 },
      { size: "50ml", price: 450 },
    ],
  },
}

// Map keywords to perfume products
const perfumeRecommendations: Record<string, string> = {
  // Havoc - Bold and Intense
  strong: "havoc",
  powerful: "havoc",
  intense: "havoc",
  bold: "havoc",
  spicy: "havoc",
  leathery: "havoc",
  woody: "havoc",
  musky: "havoc",
  smoky: "havoc",
  dark: "havoc",
  rugged: "havoc",
  party: "havoc",
  decent: "havoc",
  jaguar: "havoc",
  earthy: "havoc",
  amber: "havoc",
  masculine: "havoc",

  // Lavior - Rich Lavender Oud
  oriental: "lavior",
  deep: "lavior",
  oud: "lavior",
  warm: "lavior",
  luxurious: "lavior",
  exotic: "lavior",
  aromatic: "lavior",
  sophisticated: "lavior",
  mystical: "lavior",
  incense: "lavior",
  rich: "lavior",
  sensual: "lavior",
  resinous: "lavior",

  // Duskfall - Cool & Refreshing
  cool: "duskfall",
  fresh: "duskfall",
  aquatic: "duskfall",
  oceanic: "duskfall",
  breezy: "duskfall",
  crisp: "duskfall",
  sporty: "duskfall",
  citrusy: "duskfall",
  minty: "duskfall",
  revitalizing: "duskfall",
  icy: "duskfall",
  clean: "duskfall",
  blue: "duskfall",
  airy: "duskfall",
  dynamic: "duskfall",

  // Ociene - Sweet & Charming
  cr7: "ociene",
  sweet: "ociene",
  caramel: "ociene",
  vanilla: "ociene",
  soft: "ociene",
  gourmand: "ociene",
  playful: "ociene",
  fruity: "ociene",
  charming: "ociene",
  comforting: "ociene",
  inviting: "ociene",
  candylike: "ociene",
  smooth: "ociene",
  cozy: "ociene",

  // Euphoria - Floral & Elegant
  floral: "euphoria",
  rose: "euphoria",
  jasmine: "euphoria",
  feminine: "euphoria",
  delicate: "euphoria",
  elegant: "euphoria",
  romantic: "euphoria",
  graceful: "euphoria",
  petalike: "euphoria",
  powdery: "euphoria",
  bright: "euphoria",
  tender: "euphoria",
  gucci: "euphoria",
}

const generalResponses = {
  hi: "Hello! How can I assist you today?",
  hello: "Hi there! Looking for a perfect fragrance?",
  "whats your company about": "Vave is a premium perfume brand offering a wide range of exquisite fragrances.",
  "how does this bot work": "This bot helps you find the perfect fragrance by analyzing scent preferences.",
  "why is this bot used": "This bot is designed to assist you in selecting perfumes based on your preferences.",
  "company detail": "Vave is a luxury fragrance brand committed to delivering high-quality scents.",
  "who are the owner of this company": "Vave is founded by a team of passionate fragrance enthusiasts.",
  custom: (
    <>
      WE CREATE CUSTOMIZED PERFUMES AND ITS PACKAGING AS YOU WANT , JUST SEND US YOUR DESIRED PERFUME NAME AND
      CUSTOMIZATIONS:
      <br />📷 Instagram:{" "}
      <a
        href="https://instagram.com/Vavefragrances"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        Click here
      </a>
    </>
  ),
  "contact details": (
    <>
      You can reach us on:
      <br />📷 Instagram:{" "}
      <a
        href="https://instagram.com/Vavefragrances"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        Click here
      </a>
      <br />🐦 Twitter:{" "}
      <a
        href="https://twitter.com/Vavefragrances"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        Click here
      </a>
      <br />📞 WhatsApp:{" "}
      <a href="https://wa.me/9328701508" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
        Message us
      </a>
      <br />
      ✉️ Email:{" "}
      <a href="mailto:Vavefragrances@gmail.com" className="text-blue-400 underline">
        contact@Vave.com
      </a>
    </>
  ),
}

const basicTags = ["Contact Details", "Why Is This Bot Used", "How Does This Bot Work", "Whats your company about"]

interface Message {
  text: string | React.ReactNode
  sender: "user" | "bot"
  perfumeId?: string
}

export default function PerfumeBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addToCart = (perfumeId: string, size: string) => {
    // In a real app, this would add the item to the cart
    // For now, we'll just show a confirmation message
    const perfume = perfumeProducts[perfumeId]
    const sizeOption = perfume.sizes.find((s) => s.size === size)
    const price = sizeOption ? sizeOption.price : perfume.price

    setMessages((prev) => [
      ...prev,
      {
        text: `Added ${perfume.fullName} (${size}) to your cart for ₹${price}. Would you like to checkout now?`,
        sender: "bot",
      },
    ])

    // You could redirect to checkout or show a cart modal here
  }

  const getResponse = (text: string): Message => {
    const lowerText = text.toLowerCase()

    // Check for general responses first
    if (generalResponses[lowerText]) {
      return { text: generalResponses[lowerText], sender: "bot" }
    }

    // Check for perfume recommendations
    for (const keyword in perfumeRecommendations) {
      if (lowerText.includes(keyword)) {
        const perfumeId = perfumeRecommendations[keyword]
        const perfume = perfumeProducts[perfumeId]

        // Set default selected size
        if (!selectedSize[perfumeId]) {
          setSelectedSize((prev) => ({ ...prev, [perfumeId]: perfume.sizes[0].size }))
        }

        // Return a rich response with product card
        return {
          text: (
            <div className="flex flex-col space-y-3">
              <p>
                I recommend <strong>{perfume.fullName}</strong>. {perfume.description}
              </p>

              <div className="bg-gray-800 rounded-lg p-3 mt-2">
                <div className="flex items-center space-x-3">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image src={perfume.image || "/placeholder.svg"} alt={perfume.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{perfume.fullName}</h4>
                    <p className="text-xs text-gray-300 line-clamp-1">{perfume.description}</p>

                    <div className="flex items-center mt-1 space-x-2">
                      {perfume.sizes.map((size) => (
                        <button
                          key={size.size}
                          onClick={() => setSelectedSize((prev) => ({ ...prev, [perfumeId]: size.size }))}
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            selectedSize[perfumeId] === size.size
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {size.size} - ₹{size.price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    className="w-full text-xs py-1 h-8"
                    onClick={() => addToCart(perfumeId, selectedSize[perfumeId] || perfume.sizes[0].size)}
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                  <Link href={`/product/${perfume.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs py-1 h-8">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ),
          sender: "bot",
          perfumeId,
        }
      }
    }

    return {
      text: "I'm not sure, but you might love exploring our collection. Try describing the type of scent you're looking for, like 'fresh', 'woody', or 'floral'.",
      sender: "bot",
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }])
      setTimeout(() => {
        const response = getResponse(input)
        setMessages((prev) => [...prev, response])
      }, 500)
      setInput("")
    }
  }

  const handleTagSelection = (tag: string) => {
    setInput(tag)
  }

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-navy text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-96 h-[500px] bg-black text-white rounded-xl shadow-xl flex flex-col border border-gray-300 z-50">
          <div className="bg-navy text-white p-4 font-semibold text-center rounded-t-xl">Vave Fragrance Advisor</div>
          <div className="flex-grow overflow-y-auto p-4 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Welcome to Vave Fragrance Advisor!</p>
                <p className="mt-2 text-xs">
                  Describe the type of scent you're looking for, or ask me about our fragrances.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg p-3 max-w-[85%] ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-gray-700">
            <select
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm mb-2"
              onChange={(e) => handleTagSelection(e.target.value)}
              value=""
            >
              <option value="">Common Questions</option>
              {basicTags.map((tag, index) => (
                <option key={index} value={tag.toLowerCase()}>
                  {tag}
                </option>
              ))}
              <option value="floral">I like floral scents</option>
              <option value="woody">I prefer woody fragrances</option>
              <option value="fresh">Something fresh and clean</option>
              <option value="sweet">I enjoy sweet scents</option>
              <option value="spicy">Looking for something spicy</option>
            </select>
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about perfumes..."
              className="flex-grow p-2 rounded-l border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
