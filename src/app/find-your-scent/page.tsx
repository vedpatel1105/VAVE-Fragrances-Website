/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/src/app/components/Navbar"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    text: "What's your preferred fragrance family?",
    options: ["Floral", "Woody", "Oriental", "Fresh"],
  },
  {
    id: 2,
    text: "When do you typically wear perfume?",
    options: ["Day", "Night", "Special Occasions", "All the time"],
  },
  {
    id: 3,
    text: "How would you describe your personality?",
    options: ["Adventurous", "Romantic", "Sophisticated", "Energetic"],
  },
  {
    id: 4,
    text: "What's your favorite season?",
    options: ["Spring", "Summer", "Autumn", "Winter"],
  },
  {
    id: 5,
    text: "Do you prefer light or intense fragrances?",
    options: ["Light", "Moderate", "Intense", "Varies"],
  },
]

export default function ScentFinder() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const router = useRouter()

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers as any)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Process the answers to determine a scent recommendation
      const recommendation = {
        name: "Havoc",
        description:
          "A bold fragrance with notes of cedar and amber. Perfect for those who enjoy sophisticated scents.",
        image: "/placeholder.svg?height=500&width=500",
      }

      // Redirect to a product page or show a modal with the recommendation
      router.push(`/product/1`)
    }
  }

  return (
    <>
      <Navbar
        setIsCartOpen={(isOpen: boolean) => {
          /* handle cart open state */
        }}
      />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Find Your Perfect Scent</h1>
        <div className="max-w-2xl mx-auto">
          {currentQuestion < questions.length ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h2>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Thank you for completing the scent finder!</h2>
              <p>We&apos;re analyzing your preferences to find your perfect scent.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
