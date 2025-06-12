/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import { ProductInfo } from "@/src/data/product-info"
import Image from "next/image"

export default function About() {
  return (
    <>
      <SimpleNavbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 font-serif text-center">About Us</h1>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src={`${ProductInfo.baseUrl}/about/about.webp`}
                alt="Perfume creation process"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <p className="mb-4">
                At VAVE , we believe fragrance is a personal story—one that should be uniquely yours.
              </p>
              <p className="mb-4">
                Founded in 2025 by two passionate creators, VAVE  was born out of a simple yet powerful idea: to empower people to craft their own signature scent. We use only the finest quality ingredients and offer a rich 25% oil concentration in all our perfumes, ensuring an 8+ hour lasting experience that stays with you through the day (and night).
              </p>
              <p>
               We currently offer 8 signature perfumes, each carefully selected not just for their individual brilliance, but for their ability to layer seamlessly with one another. With this unique approach, you can mix and match any two fragrances to create a personalized blend—unlocking up to 64 unique combinations that adapt to your mood, style, or moment.
              </p>
              <p className="mt-4">
                VAVE  is more than perfume. It's self-expression in every drop. Whether you prefer something bold, romantic, fresh, or mysterious—you’re in control of what your scent says about you.
              </p>
              <p className="mt-4">
                Join us in redefining how the world experiences fragrance.

              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
