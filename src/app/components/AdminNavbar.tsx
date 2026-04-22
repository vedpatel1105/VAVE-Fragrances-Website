"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Package, ShoppingBag, Users, LogOut, BarChart3, Command, Ticket } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { adminService } from "@/src/lib/adminService"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdminCommandPalette from "./AdminCommandPalette"

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin')
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      })
    }
  }

  const [userRole, setUserRole] = useState<'user' | 'admin' | 'viewer'>('user')

  useEffect(() => {
    adminService.getCurrentUserRole().then(role => setUserRole(role))
  }, [])

  const navItems = [
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, roles: ['admin', 'viewer'] },
    { href: "/admin/orders", label: "Orders", icon: Package, roles: ['admin'] },
    { href: "/admin/products", label: "Products", icon: ShoppingBag, roles: ['admin'] },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket, roles: ['admin'] },
    { href: "/admin/users", label: "Users", icon: Users, roles: ['admin'] },
  ].filter(item => item.roles.includes(userRole))

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/orders" className="text-xl font-serif text-white tracking-wide flex items-center gap-2">
            Vave <span className="text-gold italic text-sm font-sans tracking-widest uppercase">Elite</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 rounded-xl text-[11px] uppercase tracking-widest font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <Icon className="h-4 w-4 mr-2 text-zinc-500 group-hover:text-gold transition-colors" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] uppercase tracking-widest text-white transition-colors flex items-center border border-white/5"
            >
              <LogOut className="h-4 w-4 mr-2 text-zinc-400" />
              Sign Out
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full transition-colors bg-white/5 hover:bg-white/10 text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center p-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-3 text-zinc-500 group-hover:text-gold transition-colors" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AdminCommandPalette />
    </motion.nav>
  )
}
 