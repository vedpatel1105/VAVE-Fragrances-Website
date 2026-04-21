"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Pencil, Trash2, Eye, EyeOff,
  Package, AlertCircle, CheckCircle, X, Save,
  ChevronDown, Image as ImageIcon, Info, DollarSign, 
  Beaker, Sparkles, Wand2, ArrowLeft, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { productService, type DBProduct, type ProductUpdateInput } from "@/src/lib/productService"
import { adminService } from "@/src/lib/adminService"
import { formatCurrency } from "@/lib/utils"
import AdminNavbar from "@/src/app/components/AdminNavbar"
import ProductImageUpload from "../components/ProductImageUpload"
import { useRouter } from "next/navigation"

// Categories used across the site
const CATEGORIES = ["Eau de Parfum", "Eau de Toilette", "Body Mist", "Attar", "Gift Set"] as const

interface ProductFormData {
  name: string
  slug: string
  category: string
  tagline: string
  brand: string
  gender: 'men' | 'women' | 'unisex' | 'other'
  strength: string
  collection: string
  sku: string
  description: string
  long_description: string
  variants: { size: string, price: number, stock: number, sku: string }[]
  images_v2: { url: string, is_primary: boolean, order: number }[]
  is_new: boolean
  is_bestseller: boolean
  is_limited: boolean
  is_hidden: boolean
  discount: number | null
  ingredients: string
  notes_top: string[]
  notes_heart: string[]
  notes_base: string[]
}

const emptyFormData: ProductFormData = {
  name: "",
  slug: "",
  category: "",
  tagline: "",
  brand: "Vave Fragrances",
  gender: "unisex",
  strength: "EDP",
  collection: "",
  sku: "",
  description: "",
  long_description: "",
  variants: [
    { size: "30ml", price: 0, stock: 0, sku: "" },
    { size: "50ml", price: 0, stock: 0, sku: "" }
  ],
  images_v2: [],
  is_new: false,
  is_bestseller: false,
  is_limited: false,
  is_hidden: false,
  discount: null,
  ingredients: "",
  notes_top: [],
  notes_heart: [],
  notes_base: [],
}

function productToFormData(product: DBProduct): ProductFormData {
  // Map legacy images if v2 doesn't exist
  let images_v2 = product.images_v2 || [];
  if (images_v2.length === 0 && product.images) {
    if (product.images.label) images_v2.push({ url: product.images.label, is_primary: true, order: 0 });
    product.images["30"]?.forEach((url, i) => images_v2.push({ url, is_primary: false, order: images_v2.length }));
    product.images["50"]?.forEach((url, i) => images_v2.push({ url, is_primary: false, order: images_v2.length }));
  }

  // Map legacy variants if v2 doesn't exist
  let variants = product.variants || [];
  if (variants.length === 0) {
    variants = [
      { size: "30ml", price: product.price_30ml || 0, stock: product.stock_30ml || 0, sku: "" },
      { size: "50ml", price: product.price_50ml || 0, stock: product.stock_50ml || 0, sku: "" }
    ];
  }

  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    tagline: product.tagline || "",
    brand: product.brand || "Vave Fragrances",
    gender: product.gender || "unisex",
    strength: product.strength || "EDP",
    collection: product.collection || "",
    sku: product.sku || "",
    description: product.description || "",
    long_description: product.long_description || "",
    variants,
    images_v2,
    is_new: product.is_new,
    is_bestseller: product.is_bestseller,
    is_limited: product.is_limited,
    is_hidden: product.is_hidden ?? false,
    discount: product.discount,
    ingredients: product.ingredients?.join(", ") || "",
    notes_top: product.notes?.top || [],
    notes_heart: product.notes?.heart || [],
    notes_base: product.notes?.base || [],
  }
}

export default function AdminProductsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [products, setProducts] = useState<DBProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<DBProduct | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData)

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAllProductsAdmin()
      setProducts(data)
    } catch (error: any) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const init = async () => {
      try {
        const isAdmin = await adminService.isAdmin()
        const isViewer = await adminService.isViewer()

        if (isViewer && !isAdmin) {
          router.push('/admin/analytics')
          return
        }

        if (!isAdmin) {
          router.push('/admin')
          return
        }
        await loadProducts()
      } catch (error) {
        console.error("Error:", error)
        router.push('/admin')
      }
    }
    init()
  }, [loadProducts, router])

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const payload: any = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        tagline: formData.tagline,
        brand: formData.brand,
        gender: formData.gender,
        strength: formData.strength,
        collection: formData.collection,
        sku: formData.sku,
        description: formData.description,
        long_description: formData.long_description || null,
        
        // Save both v1 and v2 for compatibility
        variants: formData.variants,
        images_v2: formData.images_v2,
        
        // Legacy mapping (v1)
        price_30ml: formData.variants.find(v => v.size.includes('30'))?.price || 0,
        price_50ml: formData.variants.find(v => v.size.includes('50'))?.price || 0,
        stock_30ml: formData.variants.find(v => v.size.includes('30'))?.stock || 0,
        stock_50ml: formData.variants.find(v => v.size.includes('50'))?.stock || 0,
        
        images: {
          label: formData.images_v2.find(i => i.is_primary)?.url || "",
          "30": formData.images_v2.slice(0, 4).map(i => i.url), // Fallback
          "50": formData.images_v2.slice(0, 4).map(i => i.url)
        },

        is_new: formData.is_new,
        is_bestseller: formData.is_bestseller,
        is_limited: formData.is_limited,
        is_hidden: formData.is_hidden,
        discount: formData.discount,
        ingredients: formData.ingredients.split(",").map(s => s.trim()).filter(Boolean),
        notes: {
          top: formData.notes_top,
          heart: formData.notes_heart,
          base: formData.notes_base
        }
      }

      if (isCreating) {
        await productService.createProduct(payload)
        toast({ title: "Success", description: "Product created successfully" })
      } else if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload)
        toast({ title: "Success", description: "Product updated successfully" })
      }
      setIsEditDialogOpen(false)
      await loadProducts()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product: DBProduct) => {
    setEditingProduct(product)
    setFormData(productToFormData(product))
    setIsCreating(false)
    setIsEditDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData(emptyFormData)
    setIsCreating(true)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    try {
      await productService.deleteProduct(deletingProduct.id)
      setIsDeleteDialogOpen(false)
      setDeletingProduct(null)
      await loadProducts()
      toast({ title: "Success", description: "Product deleted successfully" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete", variant: "destructive" })
    }
  }

  const updateField = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (categoryFilter === "all" || p.category === categoryFilter)
  )

  if (isLoading) return <div className="p-8 text-center">Loading Management Suite...</div>

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-6 pt-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-serif tracking-tight text-white">
              Inventory <span className="text-gold">Mastery</span>
            </h1>
            <p className="text-zinc-500 mt-3 font-light tracking-wide uppercase text-xs">
              Curate your digital boutique and olfactory assets.
            </p>
          </div>
          <Button 
            onClick={handleCreate} 
            className="bg-gold hover:bg-gold/90 text-black font-bold px-8 h-14 rounded-2xl shadow-[0_10px_20px_-10px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Scent
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 mb-12 flex flex-col md:flex-row gap-6 shadow-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-black/40 border-white/10 rounded-2xl h-14 focus:border-gold/50 focus:ring-gold/10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[240px] bg-black/40 border-white/10 rounded-2xl h-14 focus:ring-gold/10 font-bold text-xs uppercase tracking-widest text-zinc-400">
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="all">All Collections</SelectItem>
              {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id}
              className="group bg-zinc-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl hover:border-gold/20 transition-all duration-500 relative"
            >
              <div className="aspect-[5/4] relative overflow-hidden bg-black/40">
                {product.images_v2?.find(i => i.is_primary)?.url || product.images?.label ? (
                  <img 
                    src={product.images_v2?.find(i => i.is_primary)?.url || product.images?.label} 
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <Package className="h-20 w-20 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-8 backdrop-blur-sm">
                  <div className="flex flex-col gap-3 w-full max-w-[200px]">
                    <Button 
                      variant="secondary" 
                      className="rounded-2xl h-14 bg-white text-black font-bold hover:bg-gold transition-all"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Modify
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="rounded-2xl h-14 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => {
                        setDeletingProduct(product)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <Badge className={product.is_hidden ? "bg-white/5 text-zinc-500 backdrop-blur-md" : "bg-gold/10 text-gold backdrop-blur-md"}>
                    {product.is_hidden ? "Hidden" : "Public"}
                  </Badge>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-3">{product.category}</p>
                <h3 className="font-serif text-2xl text-white mb-2 tracking-tight group-hover:text-gold transition-colors">{product.name}</h3>
                
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/5">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                    Stock: <span className={product.stock_30ml + product.stock_50ml < 10 ? 'text-red-500' : 'text-zinc-300'}>
                      {product.stock_30ml + product.stock_50ml} Units
                    </span>
                  </div>
                  <div className="font-serif text-xl text-gold">
                    {formatCurrency(product.variants?.[0]?.price || product.price_30ml)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Editor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl h-[85vh] p-0 rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden !flex !flex-col !gap-0">
            <div className="flex flex-col h-full w-full min-h-0">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
                <div>
                  <DialogTitle className="text-3xl font-serif text-white tracking-tight">
                    {isCreating ? "Craft New Fragrance" : <>Refining: <span className="text-gold">{editingProduct?.name}</span></>}
                  </DialogTitle>
                  <p className="text-xs text-zinc-500 mt-2 font-light tracking-widest uppercase">Olfactory Architecture & Product Metadata</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(false)} className="rounded-full hover:bg-white/10 text-zinc-400">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-10 bg-black/40 p-1.5 rounded-2xl h-16 border border-white/5">
                    <TabsTrigger value="general" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 transition-all font-bold text-xs tracking-widest uppercase">
                      <Info className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 transition-all font-bold text-xs tracking-widest uppercase">
                      <DollarSign className="h-4 w-4" /> Value
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 transition-all font-bold text-xs tracking-widest uppercase">
                      <Beaker className="h-4 w-4" /> Scent
                    </TabsTrigger>
                    <TabsTrigger value="media" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 transition-all font-bold text-xs tracking-widest uppercase">
                      <ImageIcon className="h-4 w-4" /> Gallery
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Product Name *</Label>
                        <Input 
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-gold/20 focus:border-gold/50 transition-all text-white"
                          value={formData.name} 
                          onChange={(e) => {
                            updateField("name", e.target.value)
                            if (isCreating) updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                          }} 
                          placeholder="e.g. Royal Oud"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Slug (URL Friendly) *</Label>
                        <Input 
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-gold/20 focus:border-gold/50 transition-all text-white font-mono text-sm"
                          value={formData.slug} onChange={(e) => updateField("slug", e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Brand</Label>
                        <Input 
                          className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-gold/50 text-white"
                          value={formData.brand} onChange={(e) => updateField("brand", e.target.value)} 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Gender</Label>
                        <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-gold/50 text-white">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Strength</Label>
                        <Input 
                          className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-gold/50 text-white"
                          value={formData.strength} onChange={(e) => updateField("strength", e.target.value)} 
                          placeholder="e.g. EDP, Extrait"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">SKU</Label>
                        <Input 
                          className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-gold/50 text-white uppercase font-mono"
                          value={formData.sku} onChange={(e) => updateField("sku", e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Collection Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-gold/20 focus:border-gold/50 transition-all text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                          {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Brand Tagline</Label>
                      <Input 
                        className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-gold/20 focus:border-gold/50 transition-all text-white"
                        value={formData.tagline} onChange={(e) => updateField("tagline", e.target.value)} placeholder="e.g. A journey through ancient woods" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Short Narrative (Card View)</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all outline-none text-sm leading-relaxed"
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Tell the story of this scent..."
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Full Olfactory Story (Product Page)</Label>
                      <textarea 
                        className="w-full min-h-[150px] p-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-gold/20 focus:border-gold/50 transition-all outline-none font-sans text-sm leading-relaxed"
                        value={formData.long_description}
                        onChange={(e) => updateField("long_description", e.target.value)}
                        placeholder="Detailed marketing story, notes, and characteristics..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Dynamic Variants (Sizes/Pricing)</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl border-gold/20 text-gold hover:bg-gold/10"
                          onClick={() => {
                            const newVariants = [...formData.variants, { size: "", price: 0, stock: 0, sku: "" }];
                            updateField("variants", newVariants);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-2" /> Add Size
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {formData.variants.map((v, i) => (
                          <div key={i} className="grid grid-cols-4 gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl items-end group">
                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Size</Label>
                              <Input 
                                className="h-10 bg-black/40 border-white/10 rounded-xl text-white"
                                value={v.size} 
                                placeholder="e.g. 100ml"
                                onChange={(e) => {
                                  const vList = [...formData.variants];
                                  vList[i].size = e.target.value;
                                  updateField("variants", vList);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Price (₹)</Label>
                              <Input 
                                className="h-10 bg-black/40 border-white/10 rounded-xl text-white"
                                type="number"
                                value={v.price} 
                                onChange={(e) => {
                                  const vList = [...formData.variants];
                                  vList[i].price = Number(e.target.value);
                                  updateField("variants", vList);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Stock</Label>
                              <Input 
                                className="h-10 bg-black/40 border-white/10 rounded-xl text-white"
                                type="number"
                                value={v.stock} 
                                onChange={(e) => {
                                  const vList = [...formData.variants];
                                  vList[i].stock = Number(e.target.value);
                                  updateField("variants", vList);
                                }}
                              />
                            </div>
                            <div className="flex gap-2">
                              {formData.variants.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="rounded-xl text-red-500 hover:bg-red-500/10 mb-0.5"
                                  onClick={() => {
                                    updateField("variants", formData.variants.filter((_, idx) => idx !== i));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-8 border rounded-[2rem] bg-gold/5 border-gold/10">
                      <div>
                        <Label className="font-serif text-lg text-white">Store Visibility</Label>
                        <p className="text-zinc-500 text-xs mt-1">When disabled, this product remains hidden from the public storefront.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-gold" checked={!formData.is_hidden} onCheckedChange={(v) => updateField("is_hidden", !v)} />
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">
                          <Wand2 className="h-3 w-3 text-blue-400" /> Top Notes
                        </Label>
                        <textarea 
                          className="w-full min-h-[160px] p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm font-sans leading-relaxed"
                          value={formData.notes_top.join("\n")}
                          onChange={(e) => updateField("notes_top", e.target.value.split("\n"))}
                          placeholder="One note per line..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">
                          <Wand2 className="h-3 w-3 text-pink-400" /> Heart Notes
                        </Label>
                        <textarea 
                          className="w-full min-h-[160px] p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm font-sans leading-relaxed"
                          value={formData.notes_heart.join("\n")}
                          onChange={(e) => updateField("notes_heart", e.target.value.split("\n"))}
                          placeholder="One note per line..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">
                          <Wand2 className="h-3 w-3 text-amber-400" /> Base Notes
                        </Label>
                        <textarea 
                          className="w-full min-h-[160px] p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm font-sans leading-relaxed"
                          value={formData.notes_base.join("\n")}
                          onChange={(e) => updateField("notes_base", e.target.value.split("\n"))}
                          placeholder="One note per line..."
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Ingredients (Public Disclosure)</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm font-sans leading-relaxed"
                        value={formData.ingredients}
                        onChange={(e) => updateField("ingredients", e.target.value)}
                        placeholder="Alcohol Denat., Aqua, Parfum..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-8">
                    <div className="space-y-6">
                      <div className="p-8 border border-gold/10 rounded-[2rem] bg-gold/5">
                        <div className="flex items-center gap-3 mb-6">
                          <Sparkles className="h-5 w-5 text-gold" />
                          <h4 className="font-serif text-xl text-white">Advanced Gallery</h4>
                        </div>
                        <ProductImageUpload 
                          label="Product Showcase Gallery" 
                          images={formData.images_v2}
                          onImagesChange={(imgs) => updateField("images_v2", imgs)}
                          folder="products_v2"
                          maxImages={12}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="p-8 border-t border-white/5 flex justify-end gap-5 bg-white/5 shrink-0">
                <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl px-8 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">Discard Changes</Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-gold hover:bg-gold/90 text-black font-bold rounded-xl px-12 h-14 shadow-[0_10px_20px_-10px_rgba(212,175,55,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving Masterpiece...
                    </span>
                  ) : (isCreating ? "Archive New Scent" : "Update Masterpiece")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl mb-2">Are you sure?</DialogTitle>
            <p className="text-muted-foreground mb-8">This will permanently delete <span className="font-bold text-foreground">{deletingProduct?.name}</span> and remove all its notes from the store.</p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleteDialogOpen(false)}>Wait, Go Back</Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => handleDelete()}>Yes, Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
