"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Leaf, Recycle, Droplet, Wind, Shield } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Separator } from "@/components/ui/separator"

export default function SustainabilityPage() {
  return (
    <>
      <Navbar setIsCartOpen={() => {}} />
      <main className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8">
            Our Commitment to Sustainability
          </h1>

          <div className="relative aspect-video mb-12 rounded-xl overflow-hidden">
            <Image
              src="/sustainability-hero.jpg"
              alt="Vave Fragrances - Sustainability"
              fill
              className="object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              At Vave, we believe that luxury and sustainability can go hand in hand. We are committed to minimizing
              our environmental impact while creating exceptional fragrances that delight our customers.
            </p>

            <h2>Our Sustainability Journey</h2>
            <p>
              Our sustainability journey began in 2020 when we conducted a comprehensive assessment of our environmental
              footprint. This led to the development of our three-pillar sustainability strategy:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 not-prose">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <Leaf className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Responsible Sourcing</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We carefully select suppliers who share our commitment to ethical and sustainable practices.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <Recycle className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Eco-Friendly Packaging</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We're transitioning to recyclable and biodegradable packaging materials.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <Droplet className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Resource Conservation</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We continuously work to reduce water usage and energy consumption in our operations.
                </p>
              </div>
            </div>

            <h2>Responsible Sourcing</h2>
            <p>
              We believe that exceptional fragrances begin with exceptional ingredients. Our commitment to responsible
              sourcing means:
            </p>

            <ul>
              <li>
                <strong>Ethical Supply Chains</strong> - We work with suppliers who provide fair wages and safe working
                conditions.
              </li>
              <li>
                <strong>Sustainable Harvesting</strong> - We prioritize ingredients that are harvested in ways that
                protect biodiversity and ecosystem health.
              </li>
              <li>
                <strong>Local Partnerships</strong> - Whenever possible, we source ingredients from local communities,
                supporting economic development and reducing transportation emissions.
              </li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/sustainable-sourcing.jpg"
                  alt="Sustainable ingredient sourcing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3>Our Ingredient Promise</h3>
                <p>
                  By 2025, we aim to have 80% of our natural ingredients sourced from certified sustainable suppliers.
                  Currently, we're at 65% and making steady progress toward our goal.
                </p>
                <p>
                  We're also investing in research to develop synthetic alternatives that reduce pressure on natural
                  resources while maintaining the exceptional quality our customers expect.
                </p>
              </div>
            </div>

            <h2>Eco-Friendly Packaging</h2>
            <p>
              Packaging is one of the most visible aspects of our sustainability efforts. We're proud of the progress
              we've made:
            </p>

            <ul>
              <li>
                <strong>Recyclable Glass Bottles</strong> - All our perfume bottles are made from recyclable glass.
              </li>
              <li>
                <strong>FSC-Certified Packaging</strong> - Our boxes are made from FSC-certified paper, ensuring they
                come from responsibly managed forests.
              </li>
              <li>
                <strong>Plastic Reduction</strong> - We've reduced plastic in our packaging by 75% since 2020 and aim to
                be plastic-free by 2026.
              </li>
              <li>
                <strong>Refill Program</strong> - Our refill program allows customers to reuse their bottles, reducing
                waste and saving money.
              </li>
            </ul>

            <Separator className="my-12" />

            <h2>Resource Conservation</h2>
            <p>We're constantly looking for ways to reduce our environmental footprint in our operations:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
              <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                <Wind className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Energy Efficiency</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our production facility uses 100% renewable energy, and we've implemented energy-efficient lighting
                  and equipment throughout our operations.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Water Conservation</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We've implemented water recycling systems that have reduced our water usage by 40% since 2020.
                </p>
              </div>
            </div>

            <h2>Our Certifications</h2>
            <p>
              We're proud to have earned the following certifications that validate our commitment to sustainability:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 not-prose">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
                <h4 className="font-bold">Cruelty-Free</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">PETA Certified</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
                <h4 className="font-bold">Vegan Friendly</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Vegan Society</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
                <h4 className="font-bold">Carbon Neutral</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Climate Partner</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
                <h4 className="font-bold">Sustainable Palm</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">RSPO Certified</p>
              </div>
            </div>

            <h2>Looking Forward</h2>
            <p>
              While we're proud of what we've accomplished, we recognize that sustainability is a journey, not a
              destination. We're committed to continuous improvement and transparency.
            </p>

            <p>Our sustainability goals for the next five years include:</p>

            <ul>
              <li>Achieving carbon neutrality across our entire supply chain by 2027</li>
              <li>Eliminating all single-use plastics from our products and operations by 2026</li>
              <li>Sourcing 100% of our natural ingredients from certified sustainable suppliers by 2028</li>
              <li>Reducing water usage by an additional 30% by 2027</li>
            </ul>

            <div className="text-center my-12">
              <p className="font-serif text-xl italic">
                "We don't inherit the Earth from our ancestors; we borrow it from our children."
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
