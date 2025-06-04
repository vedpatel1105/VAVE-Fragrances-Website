"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function InteractiveBackground({ scrollY }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId
    const ripples = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const drawRipples = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ripples.forEach((ripple, index) => {
        ripple.radius += ripple.speed
        ripple.opacity -= 0.01

        if (ripple.opacity <= 0) {
          ripples.splice(index, 1)
        } else {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(212, 175, 55, ${ripple.opacity})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })

      animationFrameId = requestAnimationFrame(drawRipples)
    }

    drawRipples()

    const handleMouseMove = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        opacity: 0.5,
        speed: 3,
      })
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ transform: `translateY(${scrollY * 0.5}px)` }}
    />
  )
}
