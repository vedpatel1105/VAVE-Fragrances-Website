"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, Pencil, Trash2, Search, Ticket, 
  CheckCircle, X, Save, RefreshCw, AlertCircle,
  Calendar, Percent, DollarSign, Tag, ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { couponService, type Coupon } from "@/src/lib/couponService"
import { productService } from "@/src/lib/productService"
import { adminService } from "@/src/lib/adminService"
import { useAuthStore } from "@/src/lib/auth"
import AdminNavbar from "@/src/app/components/AdminNavbar"
import { useRouter } from "next/navigation"

export default function AdminCouponsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    type: "percentage",
    value: 0,
    min_amount: 0,
    max_discount: 0,
    applies_to: [],
    is_active: true,
    description: "",
    expiry_date: ""
  })

  const loadData = useCallback(async () => {
    try {
      const [couponData, productData] = await Promise.all([
        couponService.getCoupons(),
        productService.getAllProductsAdmin()
      ])
      setCoupons(couponData)
      setProducts(productData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const init = async () => {
      const user = useAuthStore.getState().user
      const isAdmin = await adminService.isAdmin(user)
      if (!isAdmin) {
        router.push('/admin')
        return
      }
      await loadData()
    }
    init()
  }, [loadData, router])

  const handleSave = async () => {
    if (!formData.code?.trim()) {
      toast({ title: "Error", description: "Coupon code is required", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        value: Number(formData.value),
        min_amount: Number(formData.min_amount) || null,
        max_discount: Number(formData.max_discount) || null,
        expiry_date: formData.expiry_date || null,
      } as any

      if (isCreating) {
        await couponService.createCoupon(payload)
        toast({ title: "Success", description: "Coupon created successfully" })
      } else if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, payload)
        toast({ title: "Success", description: "Coupon updated successfully" })
      }
      setIsEditDialogOpen(false)
      await loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      ...coupon,
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : ""
    })
    setIsCreating(false)
    setIsEditDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCoupon(null)
    setFormData({
      code: "",
      type: "percentage",
      value: 0,
      min_amount: 0,
      max_discount: 0,
      applies_to: [],
      is_active: true,
      description: "",
      expiry_date: ""
    })
    setIsCreating(true)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingCoupon) return
    try {
      await couponService.deleteCoupon(deletingCoupon.id)
      setIsDeleteDialogOpen(false)
      setDeletingCoupon(null)
      await loadData()
      toast({ title: "Success", description: "Coupon deleted" })
    } catch (error: any) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    }
  }

  const toggleProductSelection = (productId: string) => {
    setFormData(prev => {
      const current = prev.applies_to || [];
      if (current.includes(productId)) {
        return { ...prev, applies_to: current.filter(id => id !== productId) };
      } else {
        return { ...prev, applies_to: [...current, productId] };
      }
    });
  }

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return <div className="p-8 text-center bg-zinc-950 min-h-screen text-zinc-500 font-serif">Loading Coupon Oracle...</div>

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-6 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-serif tracking-tight text-white">
              Coupon <span className="text-gold">Oracle</span>
            </h1>
            <p className="text-zinc-500 mt-3 font-light tracking-wide uppercase text-xs">
              Govern the rewards and incentives of your elite clientele.
            </p>
          </div>
          <Button 
            onClick={handleCreate} 
            className="bg-gold hover:bg-gold/90 text-black font-bold px-8 h-14 rounded-2xl shadow-[0_10px_20px_-10px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Forge Coupon
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 mb-12 shadow-2xl flex items-center">
            <Search className="h-5 w-5 text-zinc-500 ml-4 mr-4" />
            <Input 
              placeholder="Search by code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-zinc-600 text-lg"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCoupons.map((coupon) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={coupon.id}
              className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${
                coupon.is_active ? 'bg-zinc-900/40 border-white/5 hover:border-gold/30' : 'bg-zinc-950/40 border-white/5 opacity-60'
              }`}
            >
              {/* Ticket Notch Effect */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-zinc-950 border border-white/5" />
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-zinc-950 border border-white/5" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-serif text-gold tracking-tighter mb-1">{coupon.code}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{coupon.description || 'Global Discount'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(coupon)} className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => { setDeletingCoupon(coupon); setIsDeleteDialogOpen(true); }} className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium tracking-wide">Value</span>
                  <span className="text-lg font-bold text-white">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium tracking-wide">Min. Amount</span>
                  <span className="text-xs font-mono text-zinc-300">₹{coupon.min_amount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium tracking-wide">Applies To</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-white/5 rounded-lg text-zinc-400">
                        {coupon.applies_to && coupon.applies_to.length > 0 ? `${coupon.applies_to.length} Products` : 'All Products'}
                    </span>
                </div>
                {coupon.expiry_date && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-medium tracking-wide">Expires</span>
                        <span className="text-xs text-zinc-400">{new Date(coupon.expiry_date).toLocaleDateString()}</span>
                    </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${coupon.is_active ? 'text-emerald-400' : 'text-zinc-600'}`}>
                   {coupon.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-zinc-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Editor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl h-[85vh] p-0 rounded-[2.5rem] border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden !flex !flex-col !gap-0">
            <div className="p-8 border-b border-white/5 bg-white/5 shrink-0 flex justify-between items-center">
              <div>
                <DialogTitle className="text-3xl font-serif text-white tracking-tight">
                  {isCreating ? "Forge New Incentive" : <>Refining: <span className="text-gold">{editingCoupon?.code}</span></>}
                </DialogTitle>
                <p className="text-xs text-zinc-500 mt-2 font-light tracking-widest uppercase">Discount Logic & Targeted Rules</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(false)} className="rounded-full hover:bg-white/10 text-zinc-400">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <div className="space-y-3">
                     <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Unique Code *</Label>
                     <Input 
                       className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-gold/20 focus:border-gold/50 text-white uppercase font-serif text-xl tracking-tighter"
                       value={formData.code} 
                       onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                       placeholder="VAVE25"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Type</Label>
                        <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Value</Label>
                        <Input 
                          type="number"
                          className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                          value={formData.value} 
                          onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} 
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Min. Purchase</Label>
                        <Input 
                          type="number"
                          className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                          value={formData.min_amount} 
                          onChange={(e) => setFormData({ ...formData, min_amount: Number(e.target.value) })} 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Max Discount</Label>
                        <Input 
                          type="number"
                          className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                          value={formData.max_discount} 
                          onChange={(e) => setFormData({ ...formData, max_discount: Number(e.target.value) })} 
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Expiry Date</Label>
                      <Input 
                        type="date"
                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                        value={formData.expiry_date} 
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} 
                      />
                   </div>

                   <div className="flex items-center justify-between p-6 border rounded-2xl bg-white/5 border-white/10">
                      <div>
                        <Label className="text-white">Active Status</Label>
                        <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest">Toggle availability</p>
                      </div>
                      <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
                   </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1 flex items-center gap-2">
                    <ShoppingBag className="h-3 w-3" /> Targeted Products
                  </Label>
                  <p className="text-[10px] text-zinc-600 -mt-4 mb-4">Leave empty to apply this coupon to all items in the store.</p>
                  
                  <div className="max-h-[400px] overflow-y-auto pr-4 space-y-2 custom-scrollbar">
                    {products.map(product => (
                      <div 
                        key={product.id} 
                        onClick={() => toggleProductSelection(product.id.toString())}
                        className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                          formData.applies_to?.includes(product.id.toString()) 
                          ? 'bg-gold/10 border-gold/40' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="h-10 w-10 bg-black/40 rounded-lg overflow-hidden flex-shrink-0">
                           {product.images?.label && <img src={product.images.label} className="w-full h-full object-contain" alt="" />}
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-bold text-white truncate">{product.name}</p>
                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{product.category}</p>
                        </div>
                        {formData.applies_to?.includes(product.id.toString()) && <CheckCircle className="h-4 w-4 text-gold" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end gap-5 bg-white/5 shrink-0">
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl px-8 text-zinc-500 hover:text-white transition-colors">Discard</Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gold hover:bg-gold/90 text-black font-bold rounded-xl px-12 h-14 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSaving ? "Forging..." : (isCreating ? "Seal Coupon" : "Update Rules")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="rounded-[2rem] border-white/10 bg-zinc-950 p-8 max-w-sm text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-serif text-white mb-2">Vanish Coupon?</DialogTitle>
            <p className="text-zinc-500 text-sm mb-8">This action cannot be undone. The code <span className="text-white font-bold">{deletingCoupon?.code}</span> will be lost to the void.</p>
            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1 rounded-xl text-zinc-500" onClick={() => setIsDeleteDialogOpen(false)}>Stay</Button>
              <Button variant="destructive" className="flex-1 rounded-xl bg-red-600" onClick={handleDelete}>Vanish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
