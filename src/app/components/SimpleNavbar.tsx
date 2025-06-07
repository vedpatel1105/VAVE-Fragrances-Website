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


export default function SimpleNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-white">VAVE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
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

            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-white"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={user.full_name || ""} />
                    <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
      )}

      {/* Cart Component */}
      <Cart />
    </nav>
  )
}
