"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X, User, LogOut, MessageCircle, Instagram, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/src/lib/auth"
import { useCartStore } from "@/src/app/components/Cart"
import Cart from "@/src/app/components/Cart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'
import Image from "next/image"
import { ProductInfo } from "@/src/data/product-info"
import { motion, AnimatePresence } from "framer-motion"


export default function SimpleNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { setIsOpen, getTotalItems } = useCartStore()

  useEffect(() => {
    const generateAvatar = async () => {
      if (user?.email) {
        const avatar = createAvatar(initials, {
          seed: user.email,
          backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
          radius: 50
        })
        const svg = await avatar.toDataUri()
        setAvatarUrl(svg)
      }
    }
    generateAvatar()
  }, [user?.email])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    { href: "/layering", label: "Layering" },
    { href: "/scent-finder", label: "Scent Finder" },
    // { href: "/find-store", label: "Find a Store" },
    // { href: "/gallery", label: "Inspiration" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* logo image */}
            <Image
              src={`${ProductInfo.baseUrl}/logo/logo.webp`}
              alt="VAVE Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="https://wa.me/919328701508"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-colors bg-white/10 hover:bg-green-500/20"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/vavefragrances/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-colors bg-white/10 hover:bg-pink-500/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <Link
                href="/wishlist"
                className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"
              >
                <Heart className="h-5 w-5 text-white" />
              </Link>
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getTotalItems()}
              </span>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={user.full_name || ""} />
                    <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>

                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user.full_name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={async () => {
                          await logout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-gray-300 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    href="/auth/login"
                    className="text-white hover:text-gray-300 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
                <div className="flex justify-start space-x-4 mt-4">
                  <a
                    href="https://wa.me/919328701508"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-green-500/20"
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                  </a>
                  <a
                    href="https://www.instagram.com/vavefragrances/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-pink-500/20"
                  >
                    <Instagram className="h-5 w-5 text-white" />
                  </a>
                  <Link
                    href="/wishlist"
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"
                  >
                    <Heart className="h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Component */}
      <Cart />
    </nav>
  )
}
