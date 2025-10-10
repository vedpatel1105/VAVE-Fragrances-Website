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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
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

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-white hover:text-white/80 transition-colors hover:underline ${isActive(link.href) ? "font-medium underline" : ""
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 relative"
                onClick={() => router.push("/wishlist")}
              >
                <Heart className="h-6 w-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 relative"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80"
                  onClick={() => router.push("/auth/login")}
                >
                  Sign In
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-white hover:text-white/80 py-2 ${isActive(link.href) ? "font-medium" : ""
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
      <Cart />
    </>
  )
}
