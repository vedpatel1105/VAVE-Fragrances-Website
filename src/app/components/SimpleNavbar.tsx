"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Menu, X, User, LogOut, Heart, Package, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/src/lib/auth"
import { useCartStore } from "@/src/lib/cartStore"
import { useWishlistStore } from "@/src/store/wishlist"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createAvatar } from "@dicebear/core"
import { initials } from "@dicebear/collection"
import { ProductInfo } from "@/src/data/product-info"
import { motion, AnimatePresence } from "framer-motion"

export default function SimpleNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { items, setIsOpen } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const router = useRouter()

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
      const currentScrollY = window.scrollY
      if (currentScrollY <= 0) {
        setIsVisible(true)
        setIsScrolled(false)
      } else {
        setIsScrolled(true)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: "/collection", label: "Collection", icon: ShoppingBag },
    { href: "/layering", label: "Layering", icon: Package },
    { href: "/scent-finder", label: "Scent Finder", icon: Heart },
    { href: "/about", label: "About", icon: User },
    { href: "/business", label: "Business", icon: Package },
    { href: "/influencer-collaboration", label: "Collaborate", icon: ChevronRight },
    { href: "/contact", label: "Contact", icon: ChevronRight },
  ]

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled ? "bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="text-white font-bold text-xl z-10">
              <Image
                src={`${ProductInfo.baseUrl}/logo/logo.png`}
                alt="VAVE Logo"
                width={120}
                height={40}
                className="h-7 md:h-8 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive(link.href) ? "text-white font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 hover:bg-white/5 relative rounded-full h-10 w-10 transition-colors"
                onClick={() => router.push("/wishlist")}
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-white text-black rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 hover:bg-white/5 relative rounded-full h-10 w-10 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-white text-black rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {/* User (desktop) */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80 hover:bg-transparent hidden lg:flex">
                      <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-zinc-800 text-xs">{user.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-white rounded-xl shadow-2xl">
                    <DropdownMenuLabel className="text-xs uppercase tracking-widest text-zinc-500">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-white">
                      <User className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")} className="hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-white">
                      <Heart className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem onClick={logout} className="hover:bg-red-950/30 text-red-400 cursor-pointer focus:bg-red-950/30 focus:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)}
                    className="px-4 py-2 text-white/60 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push(`/auth/signup?redirect=${encodeURIComponent(pathname)}`)}
                    className="px-6 py-2 rounded-full bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {!user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/10 lg:hidden rounded-full h-10 w-10 ml-1"
                  onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)}
                  aria-label="Sign in"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              )}

              {/* Hamburger (mobile only) */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/10 lg:hidden rounded-full h-10 w-10 ml-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Full-screen mobile menu overlay ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[45] lg:hidden bg-zinc-950 flex flex-col overflow-y-auto"
          >
            {/* Spacer for the fixed navbar */}
            <div className="h-16 shrink-0" />

            {/* User info block (if logged in) */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mx-5 mt-5 rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center gap-3"
              >
                <Avatar className="h-12 w-12 border border-white/20 shrink-0">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-zinc-800 text-sm font-serif">
                    {(user.full_name || user.email || "V")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.full_name || "Welcome back"}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setIsMenuOpen(false); router.push("/profile") }}
                  className="ml-auto shrink-0 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-white/10 rounded-lg px-3 py-1.5"
                >
                  Profile
                </button>
              </motion.div>
            )}

            {/* Nav links */}
            <nav className="flex-1 px-5 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between w-full py-4 border-b border-white/5 group transition-colors ${
                      isActive(link.href) ? "text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <span className="text-xl font-serif italic">{link.label}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isActive(link.href) ? "text-white" : "text-white/20"}`} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom action area */}
            <div className="px-5 pb-8 pt-4 space-y-3 shrink-0 border-t border-white/5">
              {user ? (
                <button
                  onClick={() => { logout(); setIsMenuOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`) }}
                    className="py-4 rounded-xl border border-white/10 text-white font-semibold text-sm tracking-wide hover:bg-white/5 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push(`/auth/signup?redirect=${encodeURIComponent(pathname)}`) }}
                    className="py-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm tracking-wide hover:bg-zinc-100 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
