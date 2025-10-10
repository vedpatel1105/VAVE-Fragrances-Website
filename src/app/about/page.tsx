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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mt-8 mb-6 font-serif text-white"
              >
                About VAVE
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Where fragrance becomes personal expression. We believe every scent tells a story—and that story should be uniquely yours.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-white/5 to-white/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={`${ProductInfo.baseUrl}/about/about.webp`}
                  alt="VAVE Fragrance Creation Process"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Founded in 2025 by two passionate creators, VAVE was born out of a simple yet powerful idea: 
                  to empower people to craft their own signature scent. We believe fragrance is more than just 
                  a product—it's a form of self-expression, a way to tell your story without saying a word.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our journey began with a vision to democratize luxury fragrance, making premium quality 
                  accessible to everyone. We use only the finest ingredients and offer a rich 25% oil 
                  concentration in all our perfumes, ensuring an 8+ hour lasting experience that stays 
                  with you through the day and night.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
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
        <section className="py-20 bg-gradient-to-r from-gray-900/50 to-white/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                Our Values
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do, from ingredient selection to customer experience.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-white mb-4 flex justify-center">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                Our Signature Collection
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Eight carefully crafted fragrances, each designed to layer beautifully with the others, 
                creating endless possibilities for personal expression.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.images["30"][0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {product.tagline}
                      </p>
                      <p className="text-sm text-gray-300 mb-4">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center mt-12"
            >
              <Link href="/collection">
                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Full Collection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Layering Innovation Section */}
        <section className="py-20 bg-gradient-to-r from-white/5 to-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                  The Art of Layering
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our revolutionary layering system allows you to combine any two of our 8 signature 
                  fragrances, creating up to 64 unique scent combinations. This isn't just mixing 
                  perfumes—it's creating your personal olfactory signature.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-white mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">Perfect Harmony:</span> Each fragrance is 
                      designed to complement others, ensuring beautiful combinations every time.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-white mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">Endless Possibilities:</span> From fresh 
                      morning scents to mysterious evening blends, create the perfect fragrance for any moment.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-white mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">Your Signature:</span> No two people will 
                      have the same combination, making your scent truly unique to you.
                    </p>
                  </div>
                </div>
                <Link href="/layering">
                  <Button className="mt-4 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full">
                    <Layers className="h-5 w-5 mr-2" />
                    Try Layering Now
                    <ArrowRight className="h-4 w-4 ml-2" />
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
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:bg-gray-800/70 transition-all duration-300"
                    >
                      <h4 className="text-white font-semibold mb-2">{combo.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        {combo.fragrance1} + {combo.fragrance2}
                      </p>
                      <div className="text-white text-sm font-medium">
                        {combo.popularity} Popular
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quality Promise Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                Our Quality Promise
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Every bottle is crafted with uncompromising attention to detail and the highest quality standards.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Premium Ingredients</h3>
                <p className="text-gray-300">
                  We source only the finest raw materials from trusted suppliers worldwide, 
                  ensuring exceptional quality in every drop.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">25% Oil Concentration</h3>
                <p className="text-gray-300">
                  Our high concentration ensures 8+ hours of lasting fragrance, 
                  making every spray count throughout your day.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Rigorous Testing</h3>
                <p className="text-gray-300">
                  Every batch undergoes extensive quality control testing to ensure 
                  consistency, safety, and exceptional performance.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-white/10 to-white/5">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                Ready to Find Your Signature Scent?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of fragrance enthusiasts who have discovered their perfect scent 
                through VAVE's unique collection and layering system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/collection">
                  <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full text-lg">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Shop Collection
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/scent-finder">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Find My Scent
                    <ArrowRight className="h-4 w-4 ml-2" />
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
