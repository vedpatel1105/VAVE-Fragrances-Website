"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/lib/auth"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Footer from "@/src/app/components/Footer"
import {
  User, Package, Heart, Settings, LogOut, MapPin,
  CheckCircle2, Clock, Truck, XCircle, AlertTriangle,
  ChevronRight, Trash2, Key, Shield, ShoppingBag,
  ChevronDown, ChevronUp, Menu, X, Star, Plus,
  ArrowRight, CreditCard,
} from "lucide-react"
import { profileService, type UserProfile, type Address, type UserOrder } from "@/src/lib/profileService"
import { useToast } from "@/components/ui/use-toast"
import { AddAddressModal } from "@/src/app/components/AddAddressModal"
import { createAvatar } from "@dicebear/core"
import { initials } from "@dicebear/collection"
import { useWishlistStore } from "@/src/store/wishlist"
import { ProductInfo } from "@/src/data/product-info"
import Image from "next/image"
import { useCartStore } from "@/src/lib/cartStore"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/src/lib/supabaseClient"

const SimpleNavbar = dynamic(() => import("@/src/app/components/SimpleNavbar"), { ssr: false })

interface ExtendedUserProfile extends UserProfile { avatarUrl?: string }
type Tab = "profile" | "orders" | "wishlist" | "settings"

const statusConfig: Record<string, { icon: React.ElementType; textColor: string; bgColor: string; label: string }> = {
  pending:    { icon: Clock,         textColor: "text-amber-300",   bgColor: "bg-amber-500/15",   label: "Pending" },
  processing: { icon: Clock,         textColor: "text-sky-300",     bgColor: "bg-sky-500/15",     label: "Processing" },
  confirmed:  { icon: CheckCircle2,  textColor: "text-sky-300",     bgColor: "bg-sky-500/15",     label: "Confirmed" },
  shipped:    { icon: Truck,         textColor: "text-violet-300",  bgColor: "bg-violet-500/15",  label: "Shipped" },
  delivered:  { icon: CheckCircle2,  textColor: "text-emerald-300", bgColor: "bg-emerald-500/15", label: "Delivered" },
  cancelled:  { icon: XCircle,       textColor: "text-rose-300",    bgColor: "bg-rose-500/15",    label: "Cancelled" },
}

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",  label: "Profile",  icon: User },
  { id: "orders",   label: "Orders",   icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
]

// ─── Reusable Card ─────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 lg:p-8 ${className}`}>
      {children}
    </div>
  )
}

// ─── Section Label ─────────────────────────────────────────────
function SectionLabel({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{children}</span>
    </div>
  )
}

// ─── Field ─────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">{label}</label>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore()
  const { addItem, setIsOpen } = useCartStore()

  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [changingPwd, setChangingPwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ next: "", confirm: "" })

  const [profile, setProfile] = useState<ExtendedUserProfile>({
    id: "", full_name: "", email: "", phone: "", is_active: true,
  })
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<UserOrder[]>([])

  useEffect(() => {
    const gen = async () => {
      if (profile.email) {
        const av = createAvatar(initials, { seed: profile.email, backgroundColor: ["18181b"], radius: 50 })
        const uri = await av.toDataUri()
        setProfile(p => ({ ...p, avatarUrl: uri }))
      }
    }
    gen()
  }, [profile.email])

  useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      try {
        const [p, a, o] = await Promise.all([
          profileService.getProfile(),
          profileService.getAddresses(),
          profileService.getOrders(),
        ])
        setProfile(prev => ({ ...prev, ...p }))
        setAddresses((a ?? []).filter(Boolean))
        setOrders(o ?? [])
      } catch {}
    })()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login")
  }, [isAuthenticated, isLoading, router])

  const completionSteps = [
    { label: "Add your full name",      done: !!profile.full_name?.trim(), tab: "profile"  as Tab },
    { label: "Add your phone number",   done: !!profile.phone?.trim(),     tab: "profile"  as Tab },
    { label: "Save a delivery address", done: addresses.length > 0,        tab: "profile"  as Tab },
    { label: "Save items to wishlist",  done: wishlistItems.length > 0,    tab: "wishlist" as Tab },
  ]
  const pct = Math.round((completionSteps.filter(s => s.done).length / completionSteps.length) * 100)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true)
    try {
      const u = await profileService.updateProfile({ full_name: profile.full_name, phone: profile.phone })
      setProfile(p => ({ ...p, ...u }))
      toast({ title: "Profile saved!" })
    } catch { toast({ title: "Save failed", variant: "destructive" }) }
    finally { setIsSaving(false) }
  }

  const handleAddAddress = async (addr: Omit<Address, "id" | "created_at">) => {
    if (addr.is_default) await Promise.all(addresses.map(a => profileService.updateAddress(a.id, { is_default: false })))
    await profileService.addAddress(addr)
    setAddresses((await profileService.getAddresses()).filter(Boolean))
    toast({ title: "Address added!" })
  }

  const handleUpdateAddress = async (id: string, updates: Partial<Omit<Address, "id" | "user_id" | "created_at">>) => {
    if (updates.is_default) await Promise.all(addresses.filter(a => a.id !== id).map(a => profileService.updateAddress(a.id, { is_default: false })))
    await profileService.updateAddress(id, updates)
    setAddresses((await profileService.getAddresses()).filter(Boolean))
    toast({ title: "Address updated!" })
  }

  const handleAddToCart = (product: ProductInfo.Product, size: string) => {
    const opt = product.sizeOptions.find(s => s.size === size)
    addItem({ id: product.id.toString(), name: product.name, price: opt?.price ?? product.price, image: product.images[size as "30" | "50"][0], images: product.images, quantity: 1, size, type: "single" })
    setIsOpen(true)
    toast({ title: `${product.name} added to cart` })
  }

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwdForm.next !== pwdForm.confirm) { toast({ title: "Passwords don't match", variant: "destructive" }); return }
    if (pwdForm.next.length < 6) { toast({ title: "Min 6 characters required", variant: "destructive" }); return }
    try {
      const { error } = await supabase.auth.updateUser({ password: pwdForm.next })
      if (error) throw error
      toast({ title: "Password updated!" })
      setChangingPwd(false); setPwdForm({ next: "", confirm: "" })
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }) }
  }

  const handleLogout = async () => { await logout(); router.push("/") }

  if (isLoading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
    </div>
  )

  // ─── Sidebar content (shared for desktop + mobile drawer) ────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Avatar block */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl -m-2" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-white/10">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback className="bg-zinc-800 text-white font-serif text-xl">
                {(profile.full_name || user?.email || "V").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg text-white leading-tight truncate">
              {profile.full_name || "Your Name"}
            </p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{profile.email || user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[
          { label: "Orders",    value: orders.length },
          { label: "Wishlist",  value: wishlistItems.length },
          { label: "Addresses", value: addresses.length },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-zinc-900 border border-white/5 p-3 text-center">
            <p className="text-xl font-serif text-white">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV.map(item => {
          const active = activeTab === item.id
          const badge = item.id === "orders" ? orders.length : item.id === "wishlist" ? wishlistItems.length : 0
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setDrawerOpen(false) }}
              className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white text-zinc-950 shadow-lg shadow-white/5"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-zinc-950" : "text-zinc-500 group-hover:text-white"}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${active ? "bg-zinc-950/10 text-zinc-950" : "bg-zinc-800 text-zinc-400"}`}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Profile completion */}
      {pct < 100 && (
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Complete profile
            </p>
            <span className="text-xs font-mono font-bold text-amber-300">{pct}%</span>
          </div>
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
            />
          </div>
          <div className="space-y-1.5">
            {completionSteps.filter(s => !s.done).map(s => (
              <button key={s.label} onClick={() => { setActiveTab(s.tab); setDrawerOpen(false) }}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white w-full transition-colors">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shrink-0" />
                {s.label}
                <ChevronRight className="h-3 w-3 ml-auto text-zinc-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {pct === 100 && (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-300 font-medium">Profile complete!</p>
        </div>
      )}

      {/* Sign out */}
      <button onClick={handleLogout} className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all">
        <LogOut className="h-4 w-4 shrink-0" />
        Sign Out
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <SimpleNavbar />

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden sticky top-16 z-30 bg-zinc-950/90 backdrop-blur border-b border-white/5 flex items-center px-4 py-3 gap-3">
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-xl bg-zinc-900 border border-white/10">
          <Menu className="h-4 w-4 text-white" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white capitalize">{activeTab}</p>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback className="bg-zinc-800 text-white text-xs font-serif">
            {(profile.full_name || "V").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.aside
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-zinc-950 border-r border-white/10 p-6 overflow-y-auto lg:hidden">
              <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5">
                <X className="h-4 w-4 text-zinc-400" />
              </button>
              <div className="mt-4"><SidebarContent /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-16 flex gap-10">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start h-fit">
          <SidebarContent />
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* ════════════ PROFILE ════════════ */}
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-6">

                <div className="mb-2">
                  <h1 className="text-3xl lg:text-4xl font-serif text-white">My Profile</h1>
                  <p className="text-sm text-zinc-500 mt-1">Manage your personal information and addresses</p>
                </div>

                {/* Personal Info */}
                <Card>
                  <SectionLabel icon={User}>Personal Information</SectionLabel>
                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Full Name">
                        <Input
                          value={profile.full_name}
                          onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                          placeholder="Your full name"
                          className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus:border-white/30 focus:ring-1 focus:ring-white/20 text-sm transition-all"
                        />
                      </Field>
                      <Field label="Phone Number">
                        <Input
                          value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus:border-white/30 focus:ring-1 focus:ring-white/20 text-sm transition-all"
                        />
                      </Field>
                    </div>
                    <Field label="Email Address">
                      <div className="relative">
                        <Input
                          value={profile.email || user?.email || ""}
                          disabled
                          className="bg-zinc-900/50 border-white/5 text-zinc-500 h-12 rounded-xl cursor-not-allowed text-sm pr-32"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 bg-zinc-800 px-2 py-1 rounded-lg">locked</span>
                      </div>
                    </Field>
                    <div className="flex justify-end pt-2">
                      <Button type="submit" disabled={isSaving}
                        className="bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-8 rounded-xl text-sm font-semibold shadow-lg shadow-white/5 transition-all">
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Addresses */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <SectionLabel icon={MapPin}>Delivery Addresses</SectionLabel>
                    <div className="-mt-6">
                      <AddAddressModal onAddAddress={handleAddAddress} userId={profile.id} />
                    </div>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 border border-dashed border-white/10 rounded-xl text-center">
                      <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
                        <MapPin className="h-6 w-6 text-zinc-600" />
                      </div>
                      <p className="text-white font-medium mb-1">No addresses saved</p>
                      <p className="text-sm text-zinc-500 mb-5">Add one and checkout becomes instant</p>
                      <AddAddressModal onAddAddress={handleAddAddress} userId={profile.id} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map(a => (
                        <div key={a.id} className="group relative rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 p-5 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white capitalize">{a.type || "Home"}</span>
                              {a.is_default && (
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-white text-zinc-950 px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <AddAddressModal onAddAddress={handleAddAddress} onUpdateAddress={handleUpdateAddress} userId={profile.id} editAddress={a} isEdit />
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed">{a.address}, {a.city}</p>
                          <p className="text-sm text-zinc-500">{a.state} — {a.pincode}</p>
                          {!a.is_default && (
                            <button onClick={() => handleUpdateAddress(a.id, { is_default: true })}
                              className="mt-3 text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" /> Set as default
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* ════════════ ORDERS ════════════ */}
            {activeTab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-serif text-white">My Orders</h1>
                  <p className="text-sm text-zinc-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
                </div>

                {orders.length === 0 ? (
                  <Card className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-5">
                      <ShoppingBag className="h-7 w-7 text-zinc-600" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-serif text-zinc-300 mb-2">No orders yet</h2>
                    <p className="text-sm text-zinc-500 mb-7">Your orders will appear here once placed</p>
                    <Button onClick={() => router.push("/collection")}
                      className="bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-8 rounded-xl text-sm font-semibold">
                      Shop Collection
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => {
                      const st = statusConfig[order.status?.toLowerCase()] ?? statusConfig.pending
                      const StatusIcon = st.icon
                      const isExp = expandedOrder === order.id
                      const items: any[] = Array.isArray(order.items) ? order.items : []
                      let shipping: any = {}
                      try { shipping = typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address } catch {}
                      const total = (order as any).total_amount ?? order.total

                      return (
                        <div key={order.id} className={`rounded-2xl border transition-all overflow-hidden ${isExp ? "border-white/20 bg-white/[0.05]" : "border-white/8 bg-white/[0.03] hover:border-white/15"}`}>
                          <button onClick={() => setExpandedOrder(isExp ? null : order.id)}
                            className="w-full flex items-center gap-4 p-5 text-left">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${st.bgColor}`}>
                              <StatusIcon className={`h-5 w-5 ${st.textColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-white">#{order.id.slice(0, 8).toUpperCase()}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${st.bgColor} ${st.textColor}`}>{st.label}</span>
                              </div>
                              <p className="text-xs text-zinc-500">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                {" · "}{items.length} item{items.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-serif text-lg font-medium text-white">₹{total}</span>
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-zinc-900 transition-transform ${isExp ? "rotate-180" : ""}`}>
                                <ChevronDown className="h-4 w-4 text-zinc-500" />
                              </div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExp && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                                <div className="border-t border-white/10 p-5 space-y-5">

                                  {/* Items list */}
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3">Items Ordered</p>
                                    <div className="rounded-xl border border-white/5 overflow-hidden">
                                      {items.map((item: any, i: number) => (
                                        <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < items.length - 1 ? "border-b border-white/5" : ""}`}>
                                          <div>
                                            <p className="text-sm font-medium text-white">{item.name}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{item.size}ml · Qty {item.quantity}</p>
                                          </div>
                                          <p className="text-sm font-semibold text-white font-mono">₹{item.price * item.quantity}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Price summary */}
                                  <div className="rounded-xl bg-zinc-900 border border-white/5 p-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm text-zinc-400">
                                        <span>Subtotal</span><span className="font-mono">₹{(order as any).subtotal_amount ?? total}</span>
                                      </div>
                                      <div className="flex justify-between text-sm text-zinc-400">
                                        <span>Shipping</span>
                                        <span className="font-mono">{(order as any).shipping_amount === 0 ? "Free" : `₹${(order as any).shipping_amount ?? 30}`}</span>
                                      </div>
                                      <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="font-mono font-serif text-base">₹{total}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping + Payment */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {shipping?.address && (
                                      <div className="rounded-xl bg-zinc-900 border border-white/5 p-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5"><MapPin className="h-3 w-3" />Shipping To</p>
                                        <p className="text-sm font-medium text-white">{shipping.name}</p>
                                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{shipping.address}, {shipping.city}, {shipping.state} — {shipping.pincode}</p>
                                        {shipping.phone && <p className="text-xs text-zinc-500 mt-1">{shipping.phone}</p>}
                                      </div>
                                    )}
                                    <div className="rounded-xl bg-zinc-900 border border-white/5 p-4">
                                      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5"><CreditCard className="h-3 w-3" />Payment</p>
                                      <p className="text-sm font-medium text-white">{order.payment_method || "Cash on Delivery"}</p>
                                      <p className="text-xs text-zinc-500 mt-1">
                                        {new Date(order.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════ WISHLIST ════════════ */}
            {activeTab === "wishlist" && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-serif text-white">Wishlist</h1>
                  <p className="text-sm text-zinc-500 mt-1">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""}</p>
                </div>

                {wishlistItems.length === 0 ? (
                  <Card className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-5">
                      <Heart className="h-7 w-7 text-zinc-600" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-serif text-zinc-300 mb-2">Nothing saved yet</h2>
                    <p className="text-sm text-zinc-500 mb-7">Save fragrances you love to revisit them later</p>
                    <Button onClick={() => router.push("/collection")}
                      className="bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-8 rounded-xl text-sm font-semibold">
                      Browse Collection
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {wishlistItems.map(item => {
                      const product = ProductInfo.allProductItems.find(p => p.id.toString() === item.id)
                      return (
                        <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.03] hover:border-white/15 p-4 flex items-center gap-4 transition-all group">
                          <div className="relative h-20 w-16 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/5">
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-lg text-white leading-tight">{item.name}</h3>
                            {product && <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-wider">{product.tagline || product.category}</p>}
                            <p className="text-sm font-mono font-semibold text-white mt-1.5">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {product && (
                              <select
                                className="bg-zinc-900 border border-white/10 text-white text-xs rounded-lg px-2 py-2 outline-none hover:border-white/30 transition-colors"
                                value={selectedSizes[item.id] || product.sizeOptions[0].size}
                                onChange={e => setSelectedSizes(prev => ({ ...prev, [item.id]: e.target.value }))}
                              >
                                {product.sizeOptions.map(s => <option key={s.size} value={s.size}>{s.size}ml</option>)}
                              </select>
                            )}
                            {product && (
                              <Button size="sm"
                                onClick={() => handleAddToCart(product, selectedSizes[item.id] || product.sizeOptions[0].size)}
                                className="bg-white text-zinc-950 hover:bg-zinc-100 rounded-lg text-xs h-9 px-4 font-semibold hidden sm:flex">
                                Add to Cart
                              </Button>
                            )}
                            <button onClick={() => { removeFromWishlist(item.id); toast({ title: "Removed" }) }}
                              className="p-2.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════ SETTINGS ════════════ */}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="mb-2">
                  <h1 className="text-3xl lg:text-4xl font-serif text-white">Settings</h1>
                  <p className="text-sm text-zinc-500 mt-1">Manage your account preferences</p>
                </div>

                {/* Change Password */}
                <Card>
                  <div className="flex items-start justify-between">
                    <div>
                      <SectionLabel icon={Key}>Change Password</SectionLabel>
                    </div>
                    <button onClick={() => setChangingPwd(!changingPwd)}
                      className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors -mt-1">
                      {changingPwd ? "Cancel" : "Change"}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-400 -mt-3 mb-2">Update your password to keep your account secure.</p>
                  <AnimatePresence>
                    {changingPwd && (
                      <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleChangePwd} className="overflow-hidden">
                        <div className="pt-5 border-t border-white/10 mt-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="New Password">
                              <Input type="password" value={pwdForm.next} onChange={e => setPwdForm(p => ({ ...p, next: e.target.value }))}
                                placeholder="Min 6 characters"
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus:border-white/30 focus:ring-1 focus:ring-white/20 text-sm" />
                            </Field>
                            <Field label="Confirm Password">
                              <Input type="password" value={pwdForm.confirm} onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))}
                                placeholder="Repeat password"
                                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus:border-white/30 focus:ring-1 focus:ring-white/20 text-sm" />
                            </Field>
                          </div>
                          <Button type="submit"
                            className="bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-8 rounded-xl text-sm font-semibold">
                            Update Password
                          </Button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Account details */}
                <Card>
                  <SectionLabel icon={Shield}>Account Details</SectionLabel>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Email",     value: profile.email || user?.email || "—" },
                      { label: "Status",    value: "Active" },
                      { label: "Orders",    value: `${orders.length}` },
                      { label: "Addresses", value: `${addresses.length}` },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl bg-zinc-900 border border-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1.5">{item.label}</p>
                        <p className="text-sm font-semibold text-white truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sign out */}
                <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <SectionLabel icon={LogOut}>Sign Out</SectionLabel>
                    <p className="text-sm text-zinc-400 -mt-3">You'll be redirected to the homepage after signing out.</p>
                  </div>
                  <Button onClick={handleLogout} variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white hover:text-zinc-950 rounded-xl h-11 px-8 text-sm font-semibold transition-all shrink-0">
                    Sign Out
                  </Button>
                </Card>

                {/* Danger zone */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6 lg:p-8">
                  <SectionLabel icon={AlertTriangle}>Danger Zone</SectionLabel>
                  <p className="text-sm text-zinc-400 mb-5 -mt-3">
                    Permanently deletes your account, orders, addresses, and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="ghost"
                    onClick={() => toast({ title: "Contact Support", description: "Email support@vavefragrances.com to request account deletion.", variant: "destructive" })}
                    className="border border-rose-500/30 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl h-11 px-8 text-sm font-semibold">
                    Delete My Account
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  )
}
