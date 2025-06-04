"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, ShoppingBag, X } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

export default function Header({ setIsCartOpen }: { setIsCartOpen: (open: boolean) => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/#featured", label: "Featured" },
    { href: "/#collections", label: "Collections" },
    { href: "/#virtual-try-on", label: "Virtual Try-On" },
    { href: "/#scent-journey", label: "Scent Journey" },
    { href: "/categories", label: "Categories" },
  ]

  return (
    <>
      {/* Floating Header */}
      <motion.header
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-4 left-4 z-50 w-auto px-4 md:px-6 h-14 flex items-center justify-between rounded-full shadow-lg 
        transition-all duration-300 ${
          isScrolled ? "bg-cream/80 dark:bg-gray-900/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold font-serif text-gold"
            >
              Olyssé
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href} className="text-sm font-medium hover:text-gold transition-colors">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Icons & Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
         

          {/* Shopping Cart */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-gold/10 rounded-full transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gold/10 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu (Dropdown) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 bg-background/95 backdrop-blur-md shadow-lg rounded-xl p-4 md:hidden"
          >
            <div className="flex flex-col items-center space-y-4">
              {navItems.map((item) => (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className="text-lg font-medium hover:text-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
