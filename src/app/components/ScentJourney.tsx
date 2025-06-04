"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
]

export default function ScentJourney() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer])
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Here you would typically send the answers to an API for processing
      console.log("Journey complete:", answers)
    }
  }

  return (
    <section id="scent-journey" className="w-full py-24 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 font-serif text-dark"
        >
          Discover Your Perfect Scent
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {currentQuestion < questions.length ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Thank you for completing the journey!</h3>
                  <p>We're analyzing your preferences to find your perfect scent.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
