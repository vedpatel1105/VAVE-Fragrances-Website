"use client"

import { Instagram } from 'lucide-react'
import Image from 'next/image'
import { ProductInfo } from '@/src/data/product-info'

interface SimpleInstagramFeedProps {
    maxPosts?: number
}

export default function SimpleInstagramFeed({ maxPosts = 0 }: SimpleInstagramFeedProps) {
    const username = "vavefragrances"
    
    // Extract exactly one representative image for 30ml and one for 50ml per product
    const allImages = ProductInfo.getAllProductItems().flatMap(product => {
        const images = [];
        if (product.images["30"] && product.images["30"].length > 0) {
            images.push(product.images["30"][1] || product.images["30"][0]);
        }
        if (product.images["50"] && product.images["50"].length > 0) {
            // Use index 0 (bottle.jpg) for 50ml to ensure the 50ml bottle size is visually represented
            images.push(product.images["50"][0]);
        }
        return images;
    });

    // Remove duplicates to ensure visual variety
    const uniqueImages = Array.from(new Set(allImages));
    const displayImages = uniqueImages.slice(0, maxPosts > 0 ? maxPosts : 18);

    return (
        <section className="w-full py-32 bg-zinc-950 relative border-t border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 relative">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Social Journal</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">The Instagram Context</h3>
                    <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm mb-10">
                        Join our visual journal. Explore the craftsmanship, aesthetic, and stories behind our Extraits de Parfum.
                    </p>
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all duration-500 font-bold text-[10px] uppercase tracking-[0.2em] group shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:scale-110 transition-transform duration-300"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        Follow @{username}
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-2">
                    {displayImages.map((imgUrl, index) => {
                        return (
                            <a
                                key={index}
                                href={`https://instagram.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative aspect-square overflow-hidden bg-zinc-900"
                            >
                                <Image 
                                    src={imgUrl} 
                                    alt={`Instagram journal entry ${index}`} 
                                    fill 
                                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 ease-[0.25,0.4,0.25,1]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                    <Instagram className="text-white w-8 h-8 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" strokeWidth={1} />
                                    <span className="text-white text-[10px] uppercase tracking-[0.2em] font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 text-center px-2">
                                        View
                                    </span>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
