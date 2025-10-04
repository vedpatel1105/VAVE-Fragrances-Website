"use client"

import { cn } from "@/src/lib/utils"

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "default" | "primary" | "secondary" | "white"
  className?: string
}

const sizeClasses = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-10 w-10 border-4"
}

const variantClasses = {
  default: "border-current",
  primary: "border-primary",
  secondary: "border-secondary",
  white: "border-white"
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className 
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        "after:absolute after:inset-0 after:rounded-full after:border-t-transparent after:border-l-transparent",
        "after:border-[inherit]",
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}