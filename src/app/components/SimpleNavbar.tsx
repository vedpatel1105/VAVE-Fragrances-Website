"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Menu, X, User, LogOut, MessageCircle, Instagram, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/src/lib/auth"
import { useCartStore } from "@/src/lib/cartStore"
import { useWishlistStore } from "@/src/store/wishlist"
import Cart from "@/src/app/components/Cart"
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

export default function SimpleNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      setIsScrolled(window.scrollY > 0)
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
    { href: "/business", label: "Business" },
    { href: "/influencer-collaboration", label: "Collaborate" },
    { href: "/contact", label: "Contact" }
  ]

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-zinc-950/70 backdrop-blur-xl border-b border-white/5" : "bg-transparent border-b border-transparent"
        }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-white font-bold text-xl">
              {/* logo image */}
              <Image
                src={`${ProductInfo.baseUrl}/logo/logo.png`}
                alt="VAVE Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${isActive(link.href) ? "text-white font-bold" : "text-white/60 hover:text-white"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-5">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 hover:bg-white/5 relative rounded-full h-10 w-10 transition-colors"
                onClick={() => router.push("/wishlist")}
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className="absolute 1 top-1.5 right-1.5 bg-white text-black rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 hover:bg-white/5 relative rounded-full h-10 w-10 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-white text-black rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80 hover:bg-transparent">
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
                <button
                  onClick={() => router.push("/auth/login")}
                  className="hidden lg:block ml-2 px-6 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest transition-all duration-300"
                >
                  Sign In
                </button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/10 lg:hidden rounded-full h-10 w-10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu - Luxury Aesthetic */}
        <div className={`lg:hidden fixed inset-0 top-20 bg-zinc-950/95 backdrop-blur-2xl transition-all duration-500 ease-in-out z-40 overflow-hidden ${isMenuOpen ? "opacity-100 h-[calc(100vh-5rem)] border-t border-white/10" : "opacity-0 h-0 border-transparent overflow-hidden object-bottom"}`}>
          <div className="container mx-auto px-8 h-full flex flex-col justify-center pb-20">
            <div className="flex flex-col gap-6 items-center text-center">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-500 ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${isActive(link.href) ? "text-white" : "text-white/50 hover:text-white"
                    }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-3xl font-serif italic tracking-wide">{link.label}</span>
                </Link>
              ))}
              
              {!user && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/auth/login");
                  }}
                  className={`mt-6 px-10 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 backdrop-blur-md text-xs uppercase tracking-[0.2em] transition-all duration-500 ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{ transitionDelay: `${navLinks.length * 50}ms` }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Cart />
    </>
  )
}
