"use client"

import { useState, useEffect } from "react"

/**
 * SafeHydration wrapper - prevents Next.js hydration conflicts
 * that cause "ghost" rendering of old and new components simultaneously.
 * Only renders children after client mount is confirmed.
 */
export default function SafeHydration({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a matching skeleton to avoid layout shift
    return <div className="w-full h-screen bg-black" aria-hidden="true" />
  }

  return <>{children}</>
}
