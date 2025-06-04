"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"

export default function OurStoryPage() {
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8">Our Story</h1>

          <div className="relative aspect-video mb-12 rounded-xl overflow-hidden">
            <Image src="/our-story-hero.jpg" alt="Vave Fragrances - Our Story" fill className="object-cover" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>The Beginning</h2>
            <p>
              Vave Fragrances was born from a passion for scents and a dream to create fragrances that tell stories.
              Founded in 2018 by Rahul Sharma, a perfume enthusiast with a background in chemistry, our journey began in
              a small workshop in Mumbai.
            </p>

            <p>
              What started as an experiment with essential oils and natural ingredients quickly evolved into a mission
              to create affordable luxury fragrances that could compete with international brands while maintaining a
              distinctly Indian character.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/founder.jpg"
                  alt="Rahul Sharma, Founder of Vave Fragrances"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3>Our Founder</h3>
                <p>
                  "I believe that fragrance is the most powerful invisible accessory one can wear. It has the ability to
                  evoke emotions, trigger memories, and create lasting impressions. With Vave, I wanted to make this
                  power accessible to everyone."
                </p>
                <p className="font-serif italic">— Rahul Sharma, Founder</p>
              </div>
            </div>

            <h2>Our Philosophy</h2>
            <p>
              At Vave, we believe in the transformative power of scent. Our philosophy is built on three core
              principles:
            </p>

            <ul>
              <li>
                <strong>Quality Without Compromise</strong> - We source the finest ingredients and employ rigorous
                quality control to ensure each bottle meets our exacting standards.
              </li>
              <li>
                <strong>Accessibility</strong> - Luxury fragrances should not be exclusive to a privileged few. We
                strive to make premium scents accessible without compromising on quality.
              </li>
              <li>
                <strong>Sustainability</strong> - We are committed to ethical sourcing and environmentally responsible
                practices throughout our production process.
              </li>
            </ul>

            <Separator className="my-12" />

            <h2>Our Craft</h2>
            <p>
              Creating a fragrance is both an art and a science. Our master perfumers blend traditional techniques with
              modern innovation to create scents that are both timeless and contemporary.
            </p>

            <p>
              Each Vave fragrance undergoes a meticulous development process that can take anywhere from six months to
              two years. From the initial concept to the final formulation, every step is executed with precision and
              passion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2">Ingredient Selection</h4>
                <p className="text-sm">
                  We source ingredients from around the world, selecting only those that meet our strict quality
                  standards.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2">Formulation</h4>
                <p className="text-sm">
                  Our perfumers create dozens of iterations, fine-tuning each formula until it achieves the perfect
                  balance.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2">Maturation</h4>
                <p className="text-sm">
                  Each batch is allowed to mature for several weeks, allowing the ingredients to harmonize and develop
                  complexity.
                </p>
              </div>
            </div>

            <h2>Looking Forward</h2>
            <p>
              As we continue to grow, our commitment to quality and innovation remains unwavering. We're constantly
              exploring new scent profiles, sustainable practices, and ways to enhance the customer experience.
            </p>

            <p>
              We're proud of how far we've come, but even more excited about where we're going. Thank you for being part
              of our journey.
            </p>

            <div className="text-center my-12">
              <p className="font-serif text-xl italic">
                "A fragrance is not just about how it smells, but how it makes you feel."
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
