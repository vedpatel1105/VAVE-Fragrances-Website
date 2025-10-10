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
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Follow Our Journey</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                    Stay connected with us on Instagram for the latest updates, behind-the-scenes content, and fragrance inspiration.
                </p>
                <a
                    href={`https://instagram.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                    <div key={index} className="flex justify-center">
                        <InstagramEmbed
                            url={postUrl}
                            width={328}
                            height={460}
                            className='rounded-lg bg-transparent border-none'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
