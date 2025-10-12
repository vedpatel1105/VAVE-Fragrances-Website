"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Brain, Heart, Sparkles, ArrowRight, Clock, Target, Users } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Smart Matching",
    description: "AI analyzes your preferences",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Personalized Results", 
    description: "Tailored to your taste",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "95% Success Rate",
    description: "Users love their matches",
  }
]

const quizSteps = [
  {
    step: "1",
    title: "Your Style",
    question: "What type of fragrance appeals to you?",
    icon: "🎨"
  },
  {
    step: "2", 
    title: "Your Occasion",
    question: "When will you wear this fragrance?",
    icon: "🌙"
  },
  {
    step: "3",
    title: "Your Notes", 
    question: "Which fragrance notes do you prefer?",
    icon: "🌸"
  },
  {
    step: "4",
    title: "Your Intensity",
    question: "How noticeable should your fragrance be?",
    icon: "💫"
  },
  {
    step: "5",
    title: "Your Result",
    question: "Get your perfect scent match!",
    icon: "✨"
  }
]

const testimonials = [
  {
    name: "Aisha Verma",
    result: "Discovered Oceane!",
    comment: "The quiz understood my vibe perfectly!"
  },
  {
    name: "Rohan Mehta", 
    result: "Matched with Duskfall",
    comment: "Didn't expect an online quiz to get it this right!"
  }
]

export default function CompactScentFinderAwareness() {
  return (
    <section className="w-full py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
              Find Your Perfect Scent
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Answer just 4-5 simple questions and discover your ideal fragrance without even smelling it. 
              Our smart algorithm matches your preferences to find your perfect scent.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Clock className="h-4 w-4" />
              <span>Takes only 2 minutes</span>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-white text-center mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {quizSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-all duration-300">
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">Step {step.step}</div>
                    <div className="text-xs text-gray-300">{step.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <h3 className="text-xl font-semibold text-white text-center mb-6">What Our Users Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>★</span>
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm">{testimonial.name}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">"{testimonial.comment}"</p>
                  <div className="text-white text-xs font-medium">{testimonial.result}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center"
          >
            <Link href="/scent-finder">
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-lg font-semibold">
                <Search className="h-5 w-5 mr-2" />
                Find My Scent
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-3">
              Answer 4-5 questions and discover your perfect fragrance
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
