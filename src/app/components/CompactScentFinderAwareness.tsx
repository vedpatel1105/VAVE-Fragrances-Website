"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Brain, Heart, ArrowRight, Clock, Target } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Brain className="h-5 w-5" strokeWidth={1.5} />,
    title: "Algorithmic Precision",
    description: "Deep AI analysis of personal preferences.",
  },
  {
    icon: <Heart className="h-5 w-5" strokeWidth={1.5} />,
    title: "Curated Selection", 
    description: "Matches perfectly tailored to your unique taste.",
  },
  {
    icon: <Target className="h-5 w-5" strokeWidth={1.5} />,
    title: "Proven Excellence",
    description: "95% accuracy in matching scent profiles.",
  }
]

const quizSteps = [
  {
    step: "01",
    title: "Aesthetic",
    question: "What fragrance appeals to you?",
    icon: "🎨"
  },
  {
    step: "02", 
    title: "Moment",
    question: "When will you wear this?",
    icon: "🌙"
  },
  {
    step: "03",
    title: "Essence", 
    question: "Which notes do you prefer?",
    icon: "🌸"
  },
  {
    step: "04",
    title: "Presence",
    question: "How noticeable should it be?",
    icon: "💫"
  },
  {
    step: "05",
    title: "Revelation",
    question: "Get your perfect match.",
    icon: "✨"
  }
]

const testimonials = [
  {
    name: "A. Verma",
    result: "Discovered: Oceane",
    comment: "An incredibly precise curation. It understood my aesthetic perfectly."
  },
  {
    name: "R. Mehta", 
    result: "Matched: Duskfall",
    comment: "A seamless digital consultation that got it incredibly right."
  }
]

export default function CompactScentFinderAwareness() {
  return (
    <section className="w-full py-32 relative bg-zinc-950 overflow-hidden border-t border-white/5">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24 relative"
          >
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Digital Sommelier</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">The Scent Finder</h3>
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm mb-8">
              A bespoke digital consultation. Answer curated questions to discover your ideal olfactory match without ever leaving your sanctuary.
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-white/50 border border-white/10 w-max mx-auto px-6 py-2 rounded-full bg-white/5">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              <span>A 2-Minute Curation</span>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="h-full bg-zinc-950 border border-white/5 p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/40">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 text-white/60 border border-white/10 group-hover:scale-110 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-serif text-white mb-3 tracking-wide">{feature.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed font-light">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-24"
          >
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 text-center mb-10">The Methodology</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quizSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center group"
                >
                  <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 h-full flex flex-col items-center justify-center hover:border-white/20 transition-all duration-500 hover:bg-white/5">
                    <span className="text-xs font-mono tracking-widest text-white/20 mb-3 block">{step.step}</span>
                    <h5 className="text-sm font-serif text-white mb-2">{step.title}</h5>
                    <p className="text-[9px] uppercase tracking-widest text-white/30">{step.question}</p>
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
            className="mb-20"
          >
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 text-center mb-10">Select Experiences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-transparent border border-white/5 rounded-none p-8 hover:bg-white/5 hover:border-white/10 transition-all duration-500"
                >
                  <div className="flex items-center gap-1 mb-4 text-white/80">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm font-light leading-relaxed italic mb-6">"{testimonial.comment}"</p>
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <span className="text-white font-serif text-lg tracking-wide">{testimonial.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">{testimonial.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <Link href="/scent-finder">
              <Button className="bg-white text-black border border-transparent hover:bg-transparent hover:text-white hover:border-white/20 transition-all duration-500 px-10 py-7 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Search className="h-4 w-4 mr-3" strokeWidth={1.5} />
                Commence Consultation
                <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-2 transition-transform" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

