"use client"

import { Instagram, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { ProductInfo } from '@/src/data/product-info'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { siteSettingsService, type SiteSettings } from '@/src/lib/siteSettingsService'

interface SimpleInstagramFeedProps {
    maxPosts?: number
}

export default function SimpleInstagramFeed({ maxPosts = 0 }: SimpleInstagramFeedProps) {
    const [settings, setSettings] = useState<SiteSettings>({ instagram_handle: 'vavefragrances', instagram_widget_code: null })

    useEffect(() => {
        siteSettingsService.getSettings().then(setSettings)
    }, [])

    const username = settings.instagram_handle
    
    // Create mock posts using product images
    const posts = ProductInfo.getAllProductItems().flatMap(product => {
        return [
            {
                image: product.images["30"][1] || product.images["30"][0],
                likes: Math.floor(Math.random() * 500) + 100,
                comments: Math.floor(Math.random() * 50) + 10
            },
            {
                image: product.images["50"][0],
                likes: Math.floor(Math.random() * 500) + 100,
                comments: Math.floor(Math.random() * 50) + 10
            }
        ];
    }).slice(0, maxPosts > 0 ? maxPosts : 12);

    return (
        <section className="w-full py-32 bg-zinc-950 relative border-t border-white/5 overflow-hidden">
            {/* Artistic Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
                VAVE SOCIAL VAVE SOCIAL
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-[10px] uppercase tracking-[0.4em] text-amber-500/60 mb-4 font-mono">Curated Gallery</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight">As Seen on Instagram</h3>
                            <p className="text-white/40 font-light leading-relaxed text-sm">
                                Tag us <span className="text-white font-medium">#VaveFragrances</span> for a chance to be featured in our monthly social journal.
                            </p>
                        </motion.div>
                    </div>
                    
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-none hover:bg-white hover:text-black transition-all duration-700 text-[10px] uppercase tracking-[0.3em] font-bold"
                    >
                        <Instagram className="w-4 h-4" />
                        Follow @{username}
                    </a>
                </div>

                {settings.instagram_widget_code ? (
                  <div 
                    className="w-full min-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: settings.instagram_widget_code }} 
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {posts.map((post, index) => (
                          <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: (index % 4) * 0.1 }}
                          >
                              <a
                                  href={`https://instagram.com/${username}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative block aspect-square overflow-hidden bg-zinc-900 border border-white/5"
                              >
                                  <Image 
                                      src={post.image} 
                                      alt={`Instagram post ${index}`} 
                                      fill 
                                      className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                                  />
                                  
                                  {/* Overlay on Hover */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-sm">
                                      <div className="flex gap-6 text-white scale-90 group-hover:scale-100 transition-transform duration-500">
                                          <div className="flex items-center gap-2">
                                              <Heart className="w-5 h-5 fill-white" />
                                              <span className="text-sm font-bold">{post.likes}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <MessageCircle className="w-5 h-5 fill-white" />
                                              <span className="text-sm font-bold">{post.comments}</span>
                                          </div>
                                      </div>
                                      <div className="mt-8 px-6 py-2 border border-white/20 text-white text-[8px] uppercase tracking-[0.3em] font-bold">
                                          View on Instagram
                                      </div>
                                  </div>

                                  {/* Subtle Logo Overlay */}
                                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                      <Instagram className="w-4 h-4 text-white/50" />
                                  </div>
                              </a>
                          </motion.div>
                      ))}
                  </div>
                )}

            </div>
        </section>
    )
}
