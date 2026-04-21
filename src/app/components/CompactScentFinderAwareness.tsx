"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Brain, Heart, ArrowRight, Clock, Target, Sparkles, Wand2, ShieldCheck } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Brain className="h-6 w-6" strokeWidth={1} />,
    title: "Smart Matching",
    description: "Our AI understands your scent preferences instantly."
  },
  {
    icon: <Heart className="h-6 w-6" strokeWidth={1} />,
    title: "Curated Style", 
    description: "Matches perfectly tailored to your unique personality."
  },
  {
    icon: <ShieldCheck className="h-6 w-6" strokeWidth={1} />,
    title: "Proven Results",
    description: "95% accuracy in finding your perfect perfume."
  }
]

const quizSteps = [
  {
    step: "01",
    title: "Your Style",
    question: "How do you like to smell?",
    options: ["Fresh & Clean", "Woody & Deep", "Floral & Sweet"],
    icon: "🎨"
  },
  {
    step: "02", 
    title: "Occasion",
    question: "When will you wear this?",
    options: ["Daily Office", "Night Out", "Special Gala"],
    icon: "🌙"
  },
  {
    step: "03",
    title: "Stay Power",
    question: "Strength preference?",
    options: ["Subtle", "Moderate", "Strong Impact"],
    icon: "💫"
  }
]

export default function CompactScentFinderAwareness() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-cycle steps for interactivity preview
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % quizSteps.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isHovered])

  return (
    <section className="w-full py-40 relative bg-zinc-950 overflow-hidden border-t border-white/5">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" 
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Text & Features */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8 border-l border-white/20 pl-6">
                <Wand2 className="h-3 w-3" />
                <span>Personal Consultation</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-tight leading-[1.1]">
                Find Your Scent <br />
                <span className="italic text-white/50">in 2 Minutes.</span>
              </h2>
              <p className="text-white/40 max-w-lg font-light leading-relaxed text-base mb-12">
                Choosing a perfume online is hard. Our smart quiz makes it easy. Answer a few questions about your lifestyle, and we'll show you exactly which Vave scent fits you best.
              </p>

              <div className="space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-6 border-b border-white/5 pb-8 group last:border-0"
                  >
                    <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg mb-2 tracking-wide">{feature.title}</h4>
                      <p className="text-white/30 text-xs font-light">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <Link href="/scent-finder">
              <Button className="h-16 px-12 bg-white text-black hover:bg-zinc-200 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-[0_20px_40px_rgba(255,255,255,0.1)] group">
                Start My Discovery Quiz
                <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right Side: Interactive Card Preview */}
          <div 
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full max-w-[450px] aspect-[4/5] perspective-1000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, rotateY: -10, x: 50 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: 10, x: -50 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-zinc-900 border border-white/10 backdrop-blur-xl p-12 flex flex-col justify-between shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-mono tracking-widest text-white/20">QUESTION {quizSteps[currentStep].step} / 05</div>
                    <div className="text-3xl">{quizSteps[currentStep].icon}</div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-serif text-white mb-12 leading-snug">{quizSteps[currentStep].question}</h3>
                    <div className="space-y-4">
                      {quizSteps[currentStep].options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 10 }}
                          className="w-full text-left p-6 border border-white/5 bg-white/5 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all text-sm font-light flex justify-between items-center group/opt"
                        >
                          {option}
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                    <div className="flex gap-1">
                      {quizSteps.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1 transition-all duration-500 rounded-full ${idx === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/10'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-white/20">2 MINS TOTAL</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Background Cards */}
              <div className="absolute inset-0 bg-white/5 border border-white/5 -translate-x-4 translate-y-4 -z-10" />
              <div className="absolute inset-0 bg-white/5 border border-white/5 -translate-x-8 translate-y-8 -z-20 opacity-50" />
            </div>
          </div>
        </div>

        {/* Floating Background Molecules */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 left-20 w-px h-64 bg-gradient-to-t from-transparent via-white to-transparent"
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-1/2 right-20 w-px h-64 bg-gradient-to-t from-transparent via-white to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
