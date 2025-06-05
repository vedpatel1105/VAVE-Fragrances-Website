"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Instagram, ShoppingBag, Heart, User, X, Menu } from "lucide-react"

interface SimpleNavbarProps {
  setIsCartOpen: (isOpen: boolean) => void
  cartItemsCount?: number
}

export default function SimpleNavbar({ setIsCartOpen, cartItemsCount = 0 }: SimpleNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    { href: "/layering", label: "Layering" },
    { href: "/scent-finder", label: "Scent Finder" },
    // { href: "/find-store", label: "Find a Store" },
    // { href: "/gallery", label: "Inspiration" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-xl border-b border-white/20" />
      <div className="relative container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-serif text-white">
            V A V E
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-slate-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <motion.a
              href="https://wa.me/919328701508"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full transition-colors bg-white/10 hover:bg-green-500/20"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 text-white" />
            </motion.a>

            <motion.a
              href="https://instagram.com/vavefragrances"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full transition-colors bg-white/10 hover:bg-pink-500/20"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-white" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20 relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 text-white" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-accent text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                  {cartItemsCount}
                </Badge>
              )}
            </motion.button>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
              <Link href="/wishlist" className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20 block">
                <Heart className="h-5 w-5 text-white" />
              </Link>
            </motion.div>

       

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4"
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-lg p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-sm font-medium text-white/90 hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex justify-start space-x-4 mt-4">
                  <a
                    href="https://wa.me/919328701508"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-green-500/20 block"
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                  </a>
                  <a
                    href="https://instagram.com/V A V E_perfumes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-pink-500/20 block"
                  >
                    <Instagram className="h-5 w-5 text-white" />
                  </a>
                  <Link
                    href="/wishlist"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20 block"
                  >
                    <Heart className="h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
