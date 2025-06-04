"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { useTheme } from "next-themes"

export default function FloatingNav({ setIsCartOpen }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState("default")

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
    { href: "/find-your-scent", label: "Find Your Scent" },
  ]

  const themeOptions = [
    { value: "default", label: "Default", icon: <Droplet className="h-4 w-4" /> },
    { value: "floral", label: "Floral", icon: <Droplet className="h-4 w-4" /> },
    { value: "woody", label: "Woody", icon: <Tree className="h-4 w-4" /> },
    { value: "fresh", label: "Fresh", icon: <Wind className="h-4 w-4" /> },
  ]

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme)
    document.body.className = newTheme !== "default" ? `theme-${newTheme}` : ""
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${
          isScrolled ? "w-11/12 md:w-3/4 lg:w-2/3" : "w-11/12"
        } glass-effect py-2 px-4 transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-serif text-accent hover-lift">
            Olyssé
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link href={item.href} className="text-sm font-medium hover:text-accent transition-colors">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
      
          
           
              <ShoppingBag className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 z-40 bg-background/95 backdrop-blur-md shadow-lg md:hidden"
          >
            <div className="container mx-auto py-4">
              {navItems.map((item) => (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className="block py-2 px-4 text-lg font-medium hover:text-accent transition-colors"
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
