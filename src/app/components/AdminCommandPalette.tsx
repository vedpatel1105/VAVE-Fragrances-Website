"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Package, Users, BarChart3, ShoppingBag, Settings, LogOut, FileText } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AdminCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Toggle on CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const actions = [
    { label: "View Ledger (Orders)", icon: Package, href: "/admin/orders", desc: "Manage and update customer orders" },
    { label: "Product Management", icon: ShoppingBag, href: "/admin/products", desc: "Add, edit, or remove inventory" },
    { label: "Analytics Dashboard", icon: BarChart3, href: "/admin/analytics", desc: "View Meta ads and sales stats" },
    { label: "Client Directory", icon: Users, href: "/admin/users", desc: "Manage team access and VIPs" },
    { label: "System Status", icon: Settings, href: "/admin", desc: "Configuration setup" },
  ]

  const filteredActions = query 
    ? actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase()))
    : actions

  const handleSelect = (href: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(href)
  }

  const handleLogout = async () => {
    setIsOpen(false)
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(255,215,0,0.05)] overflow-hidden flex flex-col max-h-[70vh]"
        >
          <div className="flex items-center px-6 h-16 border-b border-white/5 relative bg-white/5">
            <Search className="h-5 w-5 text-gold mr-4" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-600 font-serif text-xl h-full"
              placeholder="Where to, Governor?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
              Esc
            </div>
          </div>

          <div className="p-4 overflow-y-auto space-y-2">
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
              Quick Navigation
            </div>
            {filteredActions.length === 0 ? (
              <div className="py-12 text-center text-zinc-600 italic">No modules matched your search.</div>
            ) : (
              filteredActions.map((action, i) => {
                const Icon = action.icon
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(action.href)}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group text-left border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg text-zinc-400 group-hover:text-gold group-hover:bg-gold/10 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-white font-medium mb-1">{action.label}</div>
                        <div className="text-xs text-zinc-500">{action.desc}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Jump To ↵
                    </div>
                  </button>
                )
              })
            )}

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                Session Actions
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-4 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group text-left text-zinc-400 border border-transparent hover:border-red-500/20"
              >
                <div className="p-2 bg-white/5 rounded-lg mr-4 group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="h-5 w-5" />
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
