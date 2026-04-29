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
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Logic-based recommendation
      const family = newAnswers[0];
      let recommendationSlug = "havoc"; // Default
      
      if (family === "Floral") recommendationSlug = "vave-noir";
      if (family === "Woody") recommendationSlug = "the-boss";
      if (family === "Oriental") recommendationSlug = "saffron-wood";
      if (family === "Fresh") recommendationSlug = "havoc";

      router.push(`/product/${recommendationSlug}`)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white/10 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
      
      <Navbar
        setIsCartOpen={() => {}}
      />
      
      <div className="container mx-auto px-6 py-40 max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6 font-mono"
          >
            Digital Sommelier
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-white tracking-tight"
          >
            Find Your Signature
          </motion.h1>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <AnimatePresence mode="wait">
            {currentQuestion < questions.length ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                    Question {questions[currentQuestion].id} of {questions.length}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                  {questions[currentQuestion].text}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="group relative p-6 text-left border border-white/5 bg-white/[0.02] hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
                    >
                      <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] font-bold">
                        {option}
                      </span>
                      <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                        <ArrowRight size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-8" />
                <h2 className="text-2xl font-serif text-white mb-4">Analyzing Your Essence</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Curating your personalized recommendation...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono">
            Vave Fragrances • Olfactory Intelligence v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

import { ArrowRight } from "lucide-react"
