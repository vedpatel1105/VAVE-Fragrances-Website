"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Brain, Heart, Sparkles, ArrowRight, Clock, Target, Users } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Smart Matching",
    description: "Our AI analyzes your preferences to find your perfect scent",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Personalized Results",
    description: "Get recommendations tailored specifically to your taste",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "95% Success Rate",
    description: "Our users love their recommendations 95% of the time",
    color: "from-green-500 to-emerald-500"
  }
]

const quizSteps = [
  {
    step: "1",
    title: "Your Style",
    question: "What type of fragrance appeals to you most?",
    options: ["Fresh & Aquatic", "Floral & Sweet", "Woody & Aromatic", "Spicy & Oriental"],
    icon: "🎨"
  },
  {
    step: "2",
    title: "Your Occasion",
    question: "When will you be wearing this fragrance?",
    options: ["Daily Wear", "Special Events", "Evening Wear", "Formal Events"],
    icon: "🌙"
  },
  {
    step: "3",
    title: "Your Notes",
    question: "Which fragrance notes do you prefer?",
    options: ["Vanilla", "Woody", "Floral", "Citrus", "Spicy", "Aquatic"],
    icon: "🌸"
  },
  {
    step: "4",
    title: "Your Intensity",
    question: "How noticeable should your fragrance be?",
    options: ["Light & Intimate", "Moderate", "Strong", "Intense"],
    icon: "💫"
  }
]

const testimonials = [
  {
    name: "Aisha Verma",
    result: "Discovered my perfect scent — Oceane!",
    rating: 5,
    comment: "I loved how the quiz understood my vibe! Oceane feels so fresh and elegant — totally me."
  },
  {
    name: "Rohan Mehta",
    result: "Matched perfectly with Duskfall",
    rating: 5,
    comment: "Didn’t expect an online quiz to get it this right! Duskfall is now my go-to fragrance."
  },
  {
    name: "Priya Sharma",
    result: "Absolutely loving Havoc!",
    rating: 5,
    comment: "The fragrance quiz made it so easy to find a scent that matches my personality. Havoc is just perfect!"
  }
];


export default function ScentFinderAwareness() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Smooth Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-pink-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Search className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Scent Finder</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Perfect Scent
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Take our personalized quiz and discover fragrances that match your unique style,
              personality, and preferences. It only takes 2 minutes!
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group h-full">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quiz Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quizSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{step.icon}</div>
                      <div className="text-2xl font-bold text-white mb-2">{step.step}</div>
                      <h4 className="text-lg font-semibold text-white mb-3">{step.title}</h4>
                      <p className="text-sm text-gray-400 mb-4">{step.question}</p>
                      <div className="space-y-2">
                        {step.options.slice(0, 2).map((option, idx) => (
                          <div key={idx} className="text-xs bg-white/10 rounded-full px-3 py-1 text-gray-300">
                            {option}
                          </div>
                        ))}
                        {step.options.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{step.options.length - 2} more options
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">What Our Customers Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Sparkles key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.result}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border-white/20 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4">Ready to Find Your Scent?</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      Join thousands of customers who have discovered their perfect fragrance through our
                      personalized quiz. It's quick, fun, and incredibly accurate!
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="text-white">Takes only 2 minutes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-white">95% customer satisfaction</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Target className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-white">Personalized recommendations</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-white font-medium">Start Your Journey</p>
                        <p className="text-gray-400 text-sm">Find your perfect match</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <Link href="/scent-finder">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Take the Quiz Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-gray-400 mt-4">
              Free, fun, and takes less than 2 minutes
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
