"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Pencil, Trash2, Eye, EyeOff,
  Package, AlertCircle, CheckCircle, X, Save,
  ChevronDown, Image as ImageIcon, Info, DollarSign, 
  Beaker, Sparkles, Wand2, ArrowLeft
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
  description: string
  long_description: string
  price_30ml: number
  price_50ml: number
  stock_30ml: number
  stock_50ml: number
  is_new: boolean
  is_bestseller: boolean
  is_limited: boolean
  is_hidden: boolean
  discount: number | null
  ingredients: string
  notes_top: string[]
  notes_heart: string[]
  notes_base: string[]
  images_30: string[]
  images_50: string[]
  images_label: string
}

const emptyFormData: ProductFormData = {
  name: "",
  slug: "",
  category: "",
  tagline: "",
  description: "",
  long_description: "",
  price_30ml: 0,
  price_50ml: 0,
  stock_30ml: 0,
  stock_50ml: 0,
  is_new: false,
  is_bestseller: false,
  is_limited: false,
  is_hidden: false,
  discount: null,
  ingredients: "",
  notes_top: [],
  notes_heart: [],
  notes_base: [],
  images_30: [],
  images_50: [],
  images_label: "",
}

function productToFormData(product: DBProduct): ProductFormData {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    tagline: product.tagline || "",
    description: product.description || "",
    long_description: product.long_description || "",
    price_30ml: product.price_30ml,
    price_50ml: product.price_50ml,
    stock_30ml: product.stock_30ml,
    stock_50ml: product.stock_50ml,
    is_new: product.is_new,
    is_bestseller: product.is_bestseller,
    is_limited: product.is_limited,
    is_hidden: product.is_hidden ?? false,
    discount: product.discount,
    ingredients: product.ingredients?.join(", ") || "",
    notes_top: product.notes?.top || [],
    notes_heart: product.notes?.heart || [],
    notes_base: product.notes?.base || [],
    images_30: product.images?.["30"] || [],
    images_50: product.images?.["50"] || [],
    images_label: product.images?.label || "",
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
        description: formData.description,
        long_description: formData.long_description || null,
        price_30ml: formData.price_30ml,
        price_50ml: formData.price_50ml,
        stock_30ml: formData.stock_30ml,
        stock_50ml: formData.stock_50ml,
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
        },
        images: {
          "30": formData.images_30,
          "50": formData.images_50,
          label: formData.images_label
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-4 pt-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-serif">
              Product CMS
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your fragrance collection, inventory, and premium media.
            </p>
          </div>
          <Button 
            onClick={handleCreate} 
            className="bg-gold hover:bg-gold/90 text-dark font-semibold px-6 py-6 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Fragrance
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-border mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name, category or slug..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-none rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px] bg-gray-50 dark:bg-gray-800 border-none rounded-xl">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product.id}
              className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                {product.images?.label ? (
                  <img 
                    src={product.images.label} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="secondary" 
                      className="flex-1 rounded-xl bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="rounded-xl"
                      onClick={() => {
                        setDeletingProduct(product)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl truncate">{product.name}</h3>
                  <Badge variant={product.is_hidden ? "outline" : "default"} className={product.is_hidden ? "text-gray-400" : "bg-green-500/10 text-green-500"}>
                    {product.is_hidden ? "Hidden" : "Public"}
                  </Badge>
                </div>
                <p className="text-gray-500 text-sm mb-4">{product.category}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-sm">
                    <span className="text-gray-400">Stock:</span>
                    <span className={`ml-2 font-semibold ${product.stock_30ml + product.stock_50ml < 10 ? 'text-red-500' : ''}`}>
                      {product.stock_30ml + product.stock_50ml} units
                    </span>
                  </div>
                  <div className="font-bold text-lg text-gold">
                    {formatCurrency(product.price_30ml)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Editor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 rounded-3xl border-none bg-white dark:bg-gray-900 shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <DialogTitle className="text-2xl font-serif">
                    {isCreating ? "Craft New Fragrance" : `Refining: ${editingProduct?.name}`}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">Fill in the olfactory architecture and product details.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl h-14">
                    <TabsTrigger value="general" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <Info className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <DollarSign className="h-4 w-4" /> Pricing & Stock
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <Beaker className="h-4 w-4" /> Fragrance
                    </TabsTrigger>
                    <TabsTrigger value="media" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <ImageIcon className="h-4 w-4" /> Media
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input 
                          value={formData.name} 
                          onChange={(e) => {
                            updateField("name", e.target.value)
                            if (isCreating) updateField("slug", e.target.value.toLowerCase().replace(/ /g, '-'))
                          }} 
                          placeholder="e.g. Royal Oud"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Slug (URL Friendly) *</Label>
                        <Input value={formData.slug} onChange={(e) => updateField("slug", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tagline</Label>
                      <Input value={formData.tagline} onChange={(e) => updateField("tagline", e.target.value)} placeholder="e.g. A journey through ancient woods" />
                    </div>
                    <div className="space-y-2">
                      <Label>Brief Description</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-gold"
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Tell the story of this scent..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Long Description (Marketing Story)</Label>
                      <textarea 
                        className="w-full min-h-[150px] p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-gold font-sans"
                        value={formData.long_description}
                        onChange={(e) => updateField("long_description", e.target.value)}
                        placeholder="Detailed marketing story, notes, and characteristics..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                        <h4 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> 30ml Variant</h4>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs uppercase text-gray-400">Price (₹)</Label>
                            <Input type="number" value={formData.price_30ml} onChange={(e) => updateField("price_30ml", Number(e.target.value))} />
                          </div>
                          <div>
                            <Label className="text-xs uppercase text-gray-400">Stock Count</Label>
                            <Input type="number" value={formData.stock_30ml} onChange={(e) => updateField("stock_30ml", Number(e.target.value))} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                        <h4 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> 50ml Variant</h4>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs uppercase text-gray-400">Price (₹)</Label>
                            <Input type="number" value={formData.price_50ml} onChange={(e) => updateField("price_50ml", Number(e.target.value))} />
                          </div>
                          <div>
                            <Label className="text-xs uppercase text-gray-400">Stock Count</Label>
                            <Input type="number" value={formData.stock_50ml} onChange={(e) => updateField("stock_50ml", Number(e.target.value))} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-6 border rounded-3xl bg-gold/5 border-gold/10">
                      <div>
                        <Label className="font-bold">Public Visibility</Label>
                        <p className="text-sm text-muted-foreground">Hide this product from the store while you work on it.</p>
                      </div>
                      <Switch checked={!formData.is_hidden} onCheckedChange={(v) => updateField("is_hidden", !v)} />
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-blue-400" /> Top Notes</Label>
                        <textarea 
                          className="w-full min-h-[150px] p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none"
                          value={formData.notes_top.join("\n")}
                          onChange={(e) => updateField("notes_top", e.target.value.split("\n"))}
                          placeholder="One note per line..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-pink-400" /> Heart Notes</Label>
                        <textarea 
                          className="w-full min-h-[150px] p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none"
                          value={formData.notes_heart.join("\n")}
                          onChange={(e) => updateField("notes_heart", e.target.value.split("\n"))}
                          placeholder="One note per line..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-amber-400" /> Base Notes</Label>
                        <textarea 
                          className="w-full min-h-[150px] p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none"
                          value={formData.notes_base.join("\n")}
                          onChange={(e) => updateField("notes_base", e.target.value.split("\n"))}
                          placeholder="One note per line..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ingredients (Comma-separated)</Label>
                      <textarea 
                        className="w-full min-h-[80px] p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none"
                        value={formData.ingredients}
                        onChange={(e) => updateField("ingredients", e.target.value)}
                        placeholder="Alcohol Denat., Aqua, Parfum..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-8">
                    <ProductImageUpload 
                      label="Main Label Image" 
                      images={formData.images_label ? [formData.images_label] : []}
                      onImagesChange={(urls) => updateField("images_label", urls[0] || "")}
                      folder="labels"
                      maxImages={1}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ProductImageUpload 
                        label="30ml Showcase" 
                        images={formData.images_30}
                        onImagesChange={(urls) => updateField("images_30", urls)}
                        folder="bottle_30ml"
                        maxImages={4}
                      />
                      <ProductImageUpload 
                        label="50ml Showcase" 
                        images={formData.images_50}
                        onImagesChange={(urls) => updateField("images_50", urls)}
                        folder="bottle_50ml"
                        maxImages={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-4 bg-gray-50 dark:bg-gray-800/50">
                <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl px-8">Discard</Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-gold hover:bg-gold/90 text-dark font-bold rounded-xl px-12 shadow-lg hover:shadow-gold/20"
                >
                  {isSaving ? "Saving Masterpiece..." : (isCreating ? "Create Fragrance" : "Update Masterpiece")}
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
