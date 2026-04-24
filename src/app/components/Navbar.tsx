"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, Heart, Instagram, MessageCircle, User, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/src/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import CinematicSearch from "./CinematicSearch"

interface NavbarProps {
  setIsCartOpen: (isOpen: boolean) => void
  cartItemsCount?: number
}

export default function Navbar({ setIsCartOpen, cartItemsCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get cart items count from localStorage
  useEffect(() => {
    const getCartCount = () => {
      try {
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
          const cart = JSON.parse(storedCart)
          return cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
        }
        return 0
      } catch (error) {
        console.error("Error getting cart count:", error)
        return 0
      }
    }

    // Update cart count initially
    const count = getCartCount()
    if (count !== cartItemsCount) {
      // In a real app, you would update the cart count state here
    }

    // Listen for storage events to update cart count when it changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        const count = getCartCount()
        if (count !== cartItemsCount) {
          // In a real app, you would update the cart count state here
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [cartItemsCount])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    { href: "/find-your-scent", label: "Scent Finder" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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
            Vave
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
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
              href="https://instagram.com/Vavefragrances"
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

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full transition-colors bg-white/10 hover:bg-white/20"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-accent text-white text-xs">{getInitials(user.full_name || user.email || "U")}</AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/my-orders")}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href="/auth/login"
                  className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20 block"
                >
                  <User className="h-5 w-5 text-white" />
                </Link>
              </motion.div>
            )}

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
                    className={`block py-4 text-[10px] uppercase tracking-[0.25em] border-b border-white/5 transition-colors ${
                      router.pathname === item.href ? "text-white font-bold" : "text-white/60 hover:text-white"
                    }`}
                    style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="mt-6">
                    <Button
                      onClick={() => { setIsMenuOpen(false); router.push('/auth/login') }}
                      className="w-full py-6 rounded-xl border border-white/20 text-white font-bold text-[10px] tracking-[0.3em] uppercase bg-transparent hover:bg-white hover:text-black transition-all duration-500"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    >
                      Log In / Sign Up
                    </Button>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="mt-6">
                    <Button
                      onClick={() => { setIsMenuOpen(false); handleLogout() }}
                      className="w-full py-6 rounded-xl border border-rose-500/20 text-rose-400 font-bold text-[10px] tracking-[0.3em] uppercase bg-transparent hover:bg-rose-500/10 transition-all duration-500"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
                <div className="flex justify-start space-x-4 mt-8 pt-6 border-t border-white/5">
                  <a
                    href="https://wa.me/919328701508"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-green-500/20 block"
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                  </a>
                  <a
                    href="https://instagram.com/Vave_perfumes"
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
