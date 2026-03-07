"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Search, Plus, Pencil, Trash2, Eye, EyeOff,
  Package, AlertCircle, CheckCircle, X, Save,
  ChevronDown
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
import { useToast } from "@/components/ui/use-toast"
import { productService, type DBProduct, type ProductUpdateInput } from "@/src/lib/productService"
import { adminService } from "@/src/lib/adminService"
import { formatCurrency } from "@/lib/utils"
import AdminNavbar from "@/src/app/components/AdminNavbar"

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
  notes_top: string
  notes_heart: string
  notes_base: string
  images_30: string
  images_50: string
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
  notes_top: "",
  notes_heart: "",
  notes_base: "",
  images_30: "",
  images_50: "",
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
    notes_top: product.notes?.top?.join(", ") || "",
    notes_heart: product.notes?.heart?.join(", ") || "",
    notes_base: product.notes?.base?.join(", ") || "",
    images_30: product.images?.["30"]?.join("\n") || "",
    images_50: product.images?.["50"]?.join("\n") || "",
    images_label: product.images?.label || "",
  }
}

function formDataToProductUpdate(form: ProductFormData): ProductUpdateInput {
  return {
    name: form.name,
    slug: form.slug,
    category: form.category,
    tagline: form.tagline,
    description: form.description,
    long_description: form.long_description || null,
    price_30ml: form.price_30ml,
    price_50ml: form.price_50ml,
    stock_30ml: form.stock_30ml,
    stock_50ml: form.stock_50ml,
    is_new: form.is_new,
    is_bestseller: form.is_bestseller,
    is_limited: form.is_limited,
    is_hidden: form.is_hidden,
    discount: form.discount,
    ingredients: form.ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    notes: {
      top: form.notes_top.split(",").map((s) => s.trim()).filter(Boolean),
      heart: form.notes_heart.split(",").map((s) => s.trim()).filter(Boolean),
      base: form.notes_base.split(",").map((s) => s.trim()).filter(Boolean),
    },
    images: {
      "30": form.images_30.split("\n").map((s) => s.trim()).filter(Boolean),
      "50": form.images_50.split("\n").map((s) => s.trim()).filter(Boolean),
      label: form.images_label,
    },
  }
}

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<DBProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<DBProduct | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData)

  // Load products
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
        if (!isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          })
          return
        }
        await loadProducts()
      } catch (error) {
        console.error("Error:", error)
      }
    }
    init()
  }, [loadProducts, toast])

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !product.name.toLowerCase().includes(q) &&
        !product.category.toLowerCase().includes(q) &&
        !product.slug.toLowerCase().includes(q)
      )
        return false
    }
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false
    if (visibilityFilter === "visible" && product.is_hidden) return false
    if (visibilityFilter === "hidden" && !product.is_hidden) return false
    if (stockFilter === "low") {
      if (product.stock_30ml > 5 && product.stock_50ml > 5) return false
    }
    if (stockFilter === "out") {
      if (product.stock_30ml > 0 || product.stock_50ml > 0) return false
    }
    return true
  })

  // Open edit dialog
  const handleEdit = (product: DBProduct) => {
    setEditingProduct(product)
    setFormData(productToFormData(product))
    setIsCreating(false)
    setIsEditDialogOpen(true)
  }

  // Open create dialog
  const handleCreate = () => {
    setEditingProduct(null)
    setFormData(emptyFormData)
    setIsCreating(true)
    setIsEditDialogOpen(true)
  }

  // Save product (create or update)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" })
      return
    }
    if (!formData.slug.trim()) {
      toast({ title: "Error", description: "Product slug is required", variant: "destructive" })
      return
    }
    if (!formData.category) {
      toast({ title: "Error", description: "Category is required", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const productData = formDataToProductUpdate(formData)
      if (isCreating) {
        await productService.createProduct({
          ...productData,
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
          ingredients: productData.ingredients || [],
          notes: productData.notes || { top: [], heart: [], base: [] },
          images: productData.images || { "30": [], "50": [], label: "" },
        } as any)
        toast({ title: "Success", description: "Product created successfully" })
      } else if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData)
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

  // Toggle visibility
  const handleToggleVisibility = async (product: DBProduct) => {
    try {
      await productService.toggleProductVisibility(product.id, !product.is_hidden)
      await loadProducts()
      toast({
        title: "Success",
        description: `Product ${product.is_hidden ? "shown" : "hidden"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update visibility",
        variant: "destructive",
      })
    }
  }

  // Delete product
  const handleDelete = async () => {
    if (!deletingProduct) return
    try {
      await productService.deleteProduct(deletingProduct.id)
      setIsDeleteDialogOpen(false)
      setDeletingProduct(null)
      await loadProducts()
      toast({ title: "Success", description: "Product deleted successfully" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const updateField = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get unique categories from products
  const categories = [...new Set(products.map((p) => p.category))].sort()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="container mx-auto py-8 px-4 pt-24">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Product Management</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {products.length} products · {products.filter((p) => p.is_hidden).length} hidden
              </p>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by name, slug, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Visibility</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock (≤5)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Product List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No products found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border-l-4 ${
                    product.is_hidden
                      ? "border-l-gray-400 opacity-75"
                      : "border-l-green-500"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate">{product.name}</h3>
                        {product.is_hidden && (
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            Hidden
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge className="bg-blue-500 text-xs">New</Badge>
                        )}
                        {product.is_bestseller && (
                          <Badge className="bg-amber-500 text-xs">Bestseller</Badge>
                        )}
                        {product.is_limited && (
                          <Badge className="bg-purple-500 text-xs">Limited</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.category} · /{product.slug}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">30ml</p>
                        <p className="font-semibold">{formatCurrency(product.price_30ml)}</p>
                        <p className={`text-xs ${product.stock_30ml <= 5 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                          Stock: {product.stock_30ml}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">50ml</p>
                        <p className="font-semibold">{formatCurrency(product.price_50ml)}</p>
                        <p className={`text-xs ${product.stock_50ml <= 5 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                          Stock: {product.stock_50ml}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVisibility(product)}
                        title={product.is_hidden ? "Show product" : "Hide product"}
                      >
                        {product.is_hidden ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                          setDeletingProduct(product)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Edit / Create Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? "Add New Product" : `Edit: ${editingProduct?.name}`}
              </DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "Fill in the details to create a new product."
                  : "Update the product details below."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        updateField("name", e.target.value)
                        if (isCreating) {
                          updateField(
                            "slug",
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "")
                          )
                        }
                      }}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="product-slug"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => updateField("category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => updateField("tagline", e.target.value)}
                      placeholder="Short tagline"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Product description"
                    className="w-full px-3 py-2 border rounded-lg bg-transparent text-sm min-h-[80px] resize-y"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="long_description">Long Description</Label>
                  <textarea
                    id="long_description"
                    value={formData.long_description}
                    onChange={(e) => updateField("long_description", e.target.value)}
                    placeholder="Detailed description"
                    className="w-full px-3 py-2 border rounded-lg bg-transparent text-sm min-h-[80px] resize-y"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                  Pricing & Stock
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_30ml">Price 30ml (₹)</Label>
                    <Input
                      id="price_30ml"
                      type="number"
                      min="0"
                      value={formData.price_30ml}
                      onChange={(e) =>
                        updateField("price_30ml", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_50ml">Price 50ml (₹)</Label>
                    <Input
                      id="price_50ml"
                      type="number"
                      min="0"
                      value={formData.price_50ml}
                      onChange={(e) =>
                        updateField("price_50ml", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock_30ml">Stock 30ml</Label>
                    <Input
                      id="stock_30ml"
                      type="number"
                      min="0"
                      value={formData.stock_30ml}
                      onChange={(e) =>
                        updateField("stock_30ml", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_50ml">Stock 50ml</Label>
                    <Input
                      id="stock_50ml"
                      type="number"
                      min="0"
                      value={formData.stock_50ml}
                      onChange={(e) =>
                        updateField("stock_50ml", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount ?? ""}
                    onChange={(e) =>
                      updateField(
                        "discount",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder="Leave empty for no discount"
                  />
                </div>
              </div>

              {/* Fragrance Notes */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                  Fragrance Notes
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="notes_top">Top Notes (comma-separated)</Label>
                    <Input
                      id="notes_top"
                      value={formData.notes_top}
                      onChange={(e) => updateField("notes_top", e.target.value)}
                      placeholder="e.g. Bergamot, Lemon, Pink Pepper"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes_heart">Heart Notes (comma-separated)</Label>
                    <Input
                      id="notes_heart"
                      value={formData.notes_heart}
                      onChange={(e) => updateField("notes_heart", e.target.value)}
                      placeholder="e.g. Rose, Jasmine, Iris"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes_base">Base Notes (comma-separated)</Label>
                    <Input
                      id="notes_base"
                      value={formData.notes_base}
                      onChange={(e) => updateField("notes_base", e.target.value)}
                      placeholder="e.g. Sandalwood, Musk, Amber"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => updateField("ingredients", e.target.value)}
                  placeholder="e.g. Alcohol Denat, Aqua, Parfum, ..."
                  className="w-full px-3 py-2 border rounded-lg bg-transparent text-sm min-h-[60px] resize-y"
                />
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                  Images
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="images_label">Label Image URL</Label>
                    <Input
                      id="images_label"
                      value={formData.images_label}
                      onChange={(e) => updateField("images_label", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images_30">30ml Image URLs (one per line)</Label>
                    <textarea
                      id="images_30"
                      value={formData.images_30}
                      onChange={(e) => updateField("images_30", e.target.value)}
                      placeholder="One URL per line"
                      className="w-full px-3 py-2 border rounded-lg bg-transparent text-sm min-h-[60px] resize-y"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images_50">50ml Image URLs (one per line)</Label>
                    <textarea
                      id="images_50"
                      value={formData.images_50}
                      onChange={(e) => updateField("images_50", e.target.value)}
                      placeholder="One URL per line"
                      className="w-full px-3 py-2 border rounded-lg bg-transparent text-sm min-h-[60px] resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                  Product Flags
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="is_new" className="cursor-pointer">New Arrival</Label>
                    <Switch
                      id="is_new"
                      checked={formData.is_new}
                      onCheckedChange={(v) => updateField("is_new", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="is_bestseller" className="cursor-pointer">Bestseller</Label>
                    <Switch
                      id="is_bestseller"
                      checked={formData.is_bestseller}
                      onCheckedChange={(v) => updateField("is_bestseller", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="is_limited" className="cursor-pointer">Limited Edition</Label>
                    <Switch
                      id="is_limited"
                      checked={formData.is_limited}
                      onCheckedChange={(v) => updateField("is_limited", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="is_hidden" className="cursor-pointer">Hidden</Label>
                    <Switch
                      id="is_hidden"
                      checked={formData.is_hidden}
                      onCheckedChange={(v) => updateField("is_hidden", v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {isCreating ? "Create Product" : "Save Changes"}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{deletingProduct?.name}&quot;? This action cannot
                be undone. Consider hiding the product instead if you might need it later.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (deletingProduct) {
                    handleToggleVisibility(deletingProduct)
                    setIsDeleteDialogOpen(false)
                  }
                }}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Instead
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
