"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { analytics } from "@/src/lib/analytics"

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      analytics.trackPageView(url)
    }
  }, [pathname, searchParams])

  return null
}
