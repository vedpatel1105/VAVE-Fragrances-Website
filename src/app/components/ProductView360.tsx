"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface ProductView360Props {
  images: string[]
  productName: string
  autoRotate?: boolean
  autoRotateSpeed?: number
}

export default function ProductView360({
  images,
  productName,
  autoRotate = false,
  autoRotateSpeed = 3000,
}: ProductView360Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle auto-rotation
  useEffect(() => {
    if (isAutoRotating) {
      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, autoRotateSpeed)
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current)
      }
    }
  }, [isAutoRotating, images.length, autoRotateSpeed])

  // Stop auto-rotation when user interacts
  useEffect(() => {
    if (isDragging && isAutoRotating) {
      setIsAutoRotating(false)
    }
  }, [isDragging, isAutoRotating])

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    if (isAutoRotating) setIsAutoRotating(false)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    if (isAutoRotating) setIsAutoRotating(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        prevImage()
      } else {
        nextImage()
      }
      setStartX(e.clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const deltaX = e.touches[0].clientX - startX
    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        prevImage()
      } else {
        nextImage()
      }
      setStartX(e.touches[0].clientX)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating)
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative aspect-square rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productName} - View ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
                onClick={() => {
                  setCurrentIndex(index)
                  if (isAutoRotating) setIsAutoRotating(false)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-black/70 transition-colors"
        onClick={prevImage}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-black/70 transition-colors"
        onClick={nextImage}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        className={`absolute top-2 right-2 p-2 rounded-full shadow-md ${
          isAutoRotating ? "bg-accent text-white" : "bg-white/80 dark:bg-black/50 text-gray-800 dark:text-white"
        }`}
        onClick={toggleAutoRotate}
      >
        <RotateCw className="h-5 w-5" />
      </button>

      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
