"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { supabase } from "@/src/lib/supabaseClient"

interface GalleryImage {
  id: string
  url: string
  title?: string
  order_index: number
}

export default function ProductGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('vave_gallery')
          .select('*')
          .order('order_index', { ascending: true })
        
        if (error) throw error
        setImages(data || [])
      } catch (err) {
        console.error("Error fetching gallery:", err)
        // Fallback to empty if table doesn't exist
        setImages([])
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  if (loading) return (
    <div className="w-full h-[60vh] bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (images.length === 0) return null

  return (
    <section className="w-full py-32 bg-zinc-950 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 font-mono font-bold">Visual Narrative</h2>
            <h3 className="text-4xl md:text-7xl font-serif text-white tracking-tighter leading-[0.9]">
              The Boutique <br />
              <span className="italic text-white/30">Gallery.</span>
            </h3>
          </div>
          <div className="md:text-right">
            <p className="text-white/40 text-xs uppercase tracking-widest font-light max-w-xs ml-auto">
              A curated collection of our finest moments and architectural scents.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className={`relative overflow-hidden group bg-zinc-900 ${
                index % 5 === 0 ? "md:col-span-2 md:row-span-2 aspect-video md:aspect-auto" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={image.url}
                alt={image.title || "Vave Boutique Gallery"}
                fill
                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                {image.title && (
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="text-white font-serif text-2xl italic tracking-wide"
                  >
                    {image.title}
                  </motion.p>
                )}
                <div className="h-px w-0 group-hover:w-full bg-gold/50 transition-all duration-700 mt-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
