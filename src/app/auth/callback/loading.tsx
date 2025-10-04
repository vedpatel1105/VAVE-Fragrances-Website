"use client"

import { LoadingSpinner } from "@/src/components/ui/loading-spinner"

export default function AuthCallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <LoadingSpinner size="lg" variant="white" />
    </div>
  )
}