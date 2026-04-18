/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { motion } from "framer-motion"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { ProductInfo } from "@/src/data/product-info"
import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  Award, 
  Users, 
  Sparkles, 
  Layers, 
  Leaf, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Palette,
  Zap,
  BookOpen,
  ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "../components/Footer"

export default function About() {
  const stats = [
    { number: "8", label: "Signature Fragrances", icon: <Sparkles className="h-6 w-6" /> },
    { number: "64", label: "Unique Combinations", icon: <Layers className="h-6 w-6" /> },
    { number: "25%", label: "Oil Concentration", icon: <Award className="h-6 w-6" /> },
    { number: "8+", label: "Hours Longevity", icon: <Zap className="h-6 w-6" /> },
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion for Quality",
      description: "We use only the finest ingredients and maintain the highest standards in every bottle we create."
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Personal Expression",
      description: "Fragrance is your personal story. We empower you to craft scents that reflect your unique personality."
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Committed to ethical sourcing and environmentally responsible practices in our fragrance creation."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Transparency",
      description: "We believe in complete transparency about our ingredients, processes, and business practices."
    }
  ]

  const featuredProducts = ProductInfo.allProductItems.slice(0, 4)

  return (
    <>
      <SimpleNavbar />
      <div className="min-h-screen bg-zinc-950 text-white selection:bg-white/20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Brand Heritage</h2>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-serif tracking-wide text-white mb-8"
              >
                About VAVE
              </motion.h1>
              <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mb-8" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-sm md:text-base text-white/60 mb-8 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
              >
                Where fragrance becomes personal expression. We believe every scent tells a story—and that story should be uniquely yours.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-b border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center flex flex-col items-center justify-center border-l border-white/5 first:border-l-0"
                >
                  <div className="flex justify-center mb-6 text-white/40">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-serif text-white mb-3 tracking-wide">
                    {stat.number}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative aspect-[4/5] w-full">
                    <Image
                    src={`${ProductInfo.baseUrl}/about/about.webp`}
                    alt="VAVE Fragrance Creation Process"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 p-8 border border-white/10"
                    />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 font-mono">Origins</h2>
                <h3 className="text-3xl md:text-5xl font-serif tracking-wide text-white mb-8 border-b border-white/10 pb-8">
                  Our Story
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  Founded in 2025 by two passionate creators, VAVE was born out of a simple yet powerful idea: 
                  to empower people to craft their own signature scent. We believe fragrance is more than just 
                  a product—it's a form of self-expression, a way to tell your story without saying a word.
                </p>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  Our journey began with a vision to democratize luxury fragrance, making premium quality 
                  accessible to everyone. We use only the finest ingredients and offer a rich 25% oil 
                  concentration in all our perfumes, ensuring an 8+ hour lasting experience that stays 
                  with you through the day and night.
                </p>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  What sets us apart is our unique layering system. We currently offer 8 signature perfumes, 
                  each carefully selected not just for their individual brilliance, but for their ability 
                  to layer seamlessly with one another. This unlocks up to 64 unique combinations that 
                  adapt to your mood, style, or moment.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-24 border-b border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Philosophy</h2>
              <h3 className="text-3xl md:text-5xl font-serif tracking-wide text-white mb-6">
                Our Values
              </h3>
              <p className="text-sm text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                The principles that guide everything we do, from ingredient selection to customer experience.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all duration-500 h-full p-8 flex flex-col justify-center text-center items-center rounded-none group">
                    <div className="text-white/40 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                      {value.icon}
                    </div>
                    <h3 className="text-sm font-mono tracking-widest uppercase text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-white/40 text-[11px] leading-relaxed font-light uppercase tracking-wider">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="py-24 border-b border-white/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 font-mono">The Extrait Portfolio</h2>
              <h3 className="text-3xl md:text-5xl font-serif tracking-wide text-white mb-6">
                Our Signature Collection
              </h3>
              <p className="text-sm text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                Eight carefully crafted fragrances, each designed to layer beautifully with the others, 
                creating endless possibilities for personal expression.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="bg-zinc-950 border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden h-full rounded-none">
                    <div className="aspect-square relative overflow-hidden bg-zinc-900/40 p-4">
                      <Image
                        src={product.images["30"][0]}
                        alt={product.name}
                        fill
                        className="object-cover mix-blend-screen scale-90 group-hover:scale-100 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 border-t border-white/5 text-center flex flex-col justify-between h-[200px]">
                      <div>
                          <h3 className="text-lg font-serif tracking-wide text-white mb-2">
                            {product.name}
                          </h3>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-4">
                            {product.tagline}
                          </p>
                      </div>
                      <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 text-white/60 mb-4">
                            <Star className="h-3 w-3 fill-white/60" />
                            <span className="text-[10px] uppercase font-mono tracking-widest">{product.rating}</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center mt-16"
            >
              <Link href="/collection">
                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-none tracking-widest uppercase text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <BookOpen className="h-4 w-4 mr-3" strokeWidth={1.5} />
                  Explore Portfolio
                  <ArrowRight className="h-4 w-4 ml-3" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Layering Innovation Section */}
        <section className="py-24 border-b border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 font-mono">Sensory Alchemy</h2>
                <h3 className="text-3xl md:text-5xl font-serif tracking-wide text-white mb-6">
                  The Art of Layering
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  Our revolutionary layering system allows you to combine any two of our 8 signature 
                  fragrances, creating up to 64 unique scent combinations. This isn't just mixing 
                  perfumes—it's creating your personal olfactory signature.
                </p>
                <div className="space-y-6 pt-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[11px] uppercase tracking-wider text-white/40 leading-relaxed">
                      <span className="text-white font-mono block mb-1">Architectural Harmony</span> 
                      Each fragrance is designed to complement others.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[11px] uppercase tracking-wider text-white/40 leading-relaxed">
                      <span className="text-white font-mono block mb-1">Infinite Combinations</span> 
                      From fresh morning scents to mysterious evening blends.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[11px] uppercase tracking-wider text-white/40 leading-relaxed">
                      <span className="text-white font-mono block mb-1">Bespoke Signature</span> 
                      Your selected ratio creates a scent uniquely yours.
                    </p>
                  </div>
                </div>
                <Link href="/layering" className="inline-block mt-4">
                  <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-8 py-6 rounded-none tracking-widest uppercase text-xs font-bold transition-all">
                    <Layers className="h-4 w-4 mr-3" strokeWidth={1.5} />
                    Experience Layering
                    <ArrowRight className="h-4 w-4 ml-3" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {ProductInfo.popularCombinations.slice(0, 4).map((combo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="bg-zinc-900/40 border border-white/5 rounded-none p-6 text-center hover:border-white/20 transition-all duration-500"
                    >
                      <h4 className="text-white font-serif tracking-wide mb-3">{combo.name}</h4>
                      <p className="text-[9px] uppercase font-mono tracking-widest text-white/40 mb-4">
                        {combo.fragrance1} <br/>+<br/> {combo.fragrance2}
                      </p>
                      <div className="text-white/60 tracking-widest uppercase text-[10px] pt-4 border-t border-white/5">
                        {combo.popularity} Match
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quality Promise Section */}
        <section className="py-24 border-b border-white/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 font-mono">Assurance</h2>
              <h3 className="text-3xl md:text-5xl font-serif tracking-wide text-white mb-6">
                Our Quality Promise
              </h3>
              <p className="text-sm text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                Every bottle is crafted with uncompromising attention to detail and the highest quality standards.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="bg-zinc-900/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center rounded-none group hover:border-white/20 transition-all duration-500"
              >
                <div className="mb-6 text-white/40 transform group-hover:scale-110 transition-transform duration-500">
                  <Award className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm uppercase font-mono tracking-widest text-white mb-4">Finest Extracts</h3>
                <p className="text-[11px] uppercase tracking-wider text-white/40 leading-relaxed">
                  We source only the rarest raw materials globally, ensuring exceptional pedigree in every drop.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-zinc-900/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center rounded-none group hover:border-white/20 transition-all duration-500"
              >
                <div className="mb-6 text-white/40 transform group-hover:scale-110 transition-transform duration-500">
                  <Zap className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm uppercase font-mono tracking-widest text-white mb-4">Extrait de Parfum</h3>
                <p className="text-[11px] uppercase tracking-wider text-white/40 leading-relaxed">
                  25% concentration creates a monumental sillage, lasting well beyond 12+ hours on skin.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-zinc-900/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center rounded-none group hover:border-white/20 transition-all duration-500"
              >
                <div className="mb-6 text-white/40 transform group-hover:scale-110 transition-transform duration-500">
                  <Shield className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm uppercase font-mono tracking-widest text-white mb-4">Precision Testing</h3>
                <p className="text-[11px] uppercase tracking-wider text-white/40 leading-relaxed">
                  Batches undergo strict maceration times to allow natural oils to achieve perfect equilibrium.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white/[0.01]">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-serif tracking-wide text-white mb-6">
                Ready to Find Your Signature Scent?
              </h2>
              <p className="text-sm text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of fragrance enthusiasts who have discovered their perfect scent 
                through VAVE's unique collection and layering system.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/collection" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-none tracking-widest uppercase text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <ShoppingBag className="h-4 w-4 mr-3" strokeWidth={1.5} />
                    Shop Portfolio
                    <ArrowRight className="h-4 w-4 ml-3" />
                  </Button>
                </Link>
                <Link href="/scent-finder" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:bg-white hover:text-black px-8 py-6 rounded-none tracking-widest uppercase text-xs font-bold transition-all">
                    <Sparkles className="h-4 w-4 mr-3" strokeWidth={1.5} />
                    Take The Quiz
                    <ArrowRight className="h-4 w-4 ml-3" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
