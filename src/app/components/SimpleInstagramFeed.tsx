"use client"

import { InstagramEmbed } from 'react-social-media-embed'

interface SimpleInstagramFeedProps {
    maxPosts?: number
}

export default function SimpleInstagramFeed({ maxPosts = 0 }: SimpleInstagramFeedProps) {
    const username = "vavefragrances"
    const samplePosts = [
        "https://www.instagram.com/p/DMS1aDZN6AC/",
        "https://www.instagram.com/p/DLP3Zy_NUrQ/?img_index=1",
        "https://www.instagram.com/p/DLAToK_vUwm/?img_index=1",
        "https://www.instagram.com/p/DKkFjqyvRdT/",
        "https://www.instagram.com/p/DKruTO-PhjG/?img_index=1",
        "https://www.instagram.com/p/DO8m7LMkSP9/",
        "https://www.instagram.com/p/DKpNcU_PXMY/",
        "https://www.instagram.com/p/DK2Ru_ztMBP/",
        "https://www.instagram.com/p/DLVBuf7tdw1/",
        "https://www.instagram.com/p/DK7d5jHS90N/",
        "https://www.instagram.com/p/DLB8wK2TMVX/",
        "https://www.instagram.com/p/DLkLFNCIXSu/"
    ]
    const calculatedMaxPosts = maxPosts > 0 ? maxPosts : samplePosts.length

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {samplePosts.slice(0, calculatedMaxPosts).map((postUrl, index) => (
                        <div key={index} className="flex justify-center transform transition-transform duration-500 hover:-translate-y-2 opacity-90 hover:opacity-100">
                            <InstagramEmbed
                                url={postUrl}
                                width={328}
                                height={460}
                                className='rounded-none bg-zinc-900 border border-white/10 shadow-2xl'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
