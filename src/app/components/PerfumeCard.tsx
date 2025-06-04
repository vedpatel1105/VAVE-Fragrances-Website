"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Heart } from "lucide-react"

type PerfumeCardProps = {
  id: number
  name: string
  description: string
  price: number
  image: string
  onAddToWishlist: (id: number) => void
}

export default function PerfumeCard({ id, name, description, price, image, onAddToWishlist }: PerfumeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(255, 0, 0, 0.1)", "rgba(255, 255, 255, 0)", "rgba(0, 255, 0, 0.1)"],
  )

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      setIsLiked(true)
      onAddToWishlist(id)
    }
    if (info.offset.x < -100) {
      setIsLiked(false)
    }
  }

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      style={{ background }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <motion.div style={{ x }}>
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{description}</p>
          <p className="text-lg font-bold">${price.toFixed(2)}</p>
        </div>
      </motion.div>
      <motion.div
        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsLiked(!isLiked)
          onAddToWishlist(id)
        }}
      >
        <Heart className={`h-6 w-6 ${isLiked ? "text-red-500 fill-current" : "text-gray-400"}`} />
      </motion.div>
    </motion.div>
  )
}
