"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // Custom easing for premium, cinematic feel
      }}
      className="min-h-screen bg-black"
    >
      {children}
    </motion.div>
  )
}
