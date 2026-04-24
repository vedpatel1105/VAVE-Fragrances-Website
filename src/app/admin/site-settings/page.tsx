"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Instagram, Image as ImageIcon, Trash2, Plus, Sparkles, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { siteSettingsService, type SiteSettings, type GalleryImage } from "@/src/lib/siteSettingsService"
import { storageService } from "@/src/lib/storageService"
import AdminNavbar from "@/src/app/components/AdminNavbar"
import { useRouter } from "next/navigation"
import { adminService } from "@/src/lib/adminService"

export default function AdminSiteSettings() {
  const { toast } = useToast()
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>({ instagram_handle: "", instagram_widget_code: "" })
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const isAdmin = await adminService.isAdmin()
        if (!isAdmin) {
          router.push('/admin')
          return
        }
        
        const [settingsData, galleryData] = await Promise.all([
          siteSettingsService.getSettings(),
          siteSettingsService.getGalleryImages()
        ])
        
        setSettings(settingsData)
        setGalleryImages(galleryData)
      } catch (error) {
        console.error("Error initializing settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [router])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await siteSettingsService.updateSettings(settings)
      toast({ title: "Settings Updated", description: "Social and global config saved successfully." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save settings", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await storageService.uploadProductImage(file, 'gallery')
      const newImg = {
        url,
        title: "",
        order_index: galleryImages.length
      }
      await siteSettingsService.addGalleryImage(newImg)
      const updatedGallery = await siteSettingsService.getGalleryImages()
      setGalleryImages(updatedGallery)
      toast({ title: "Image Added", description: "Gallery photo uploaded successfully." })
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message || "Could not upload image", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateImageTitle = async (id: string, title: string) => {
    try {
      const { error } = await supabase.from('vave_gallery').update({ title }).eq('id', id)
      if (error) throw error
      setGalleryImages(prev => prev.map(img => img.id === id ? { ...img, title } : img))
      toast({ title: "Title Updated" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleMoveImage = async (index: number, direction: 'left' | 'right') => {
    const newImages = [...galleryImages]
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return

    // Swap positions
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp

    // Update order_index
    const updatedImages = newImages.map((img, i) => ({ ...img, order_index: i }))
    setGalleryImages(updatedImages)

    try {
      await siteSettingsService.updateGalleryOrder(updatedImages.map(img => ({ id: img.id, order_index: img.order_index })))
      toast({ title: "Gallery Reordered" })
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to save order", variant: "destructive" })
    }
  }

  if (isLoading) return <div className="p-8 text-center text-white min-h-screen flex items-center justify-center font-serif italic text-2xl animate-pulse">Orchestrating...</div>

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-6 pt-32">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-serif tracking-tight text-white">
              Site <span className="text-gold">Orchestration</span>
            </h1>
            <p className="text-zinc-500 mt-3 font-light tracking-wide uppercase text-xs">
              Manage your global visual identity and social integrations.
            </p>
          </div>
        </div>

        <Tabs defaultValue="instagram" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 w-full md:w-auto">
            <TabsTrigger value="instagram" className="rounded-xl px-8 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
              <Instagram className="h-4 w-4" /> Instagram
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-xl px-8 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
              <ImageIcon className="h-4 w-4" /> Boutique Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instagram" className="space-y-6">
            <div className="max-w-2xl bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Instagram Handle</Label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">@</span>
                    <Input 
                      className="h-14 pl-10 bg-black/40 border-white/10 rounded-2xl text-white focus:border-gold/50"
                      value={settings.instagram_handle}
                      onChange={(e) => setSettings({...settings, instagram_handle: e.target.value})}
                      placeholder="vavefragrances"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Widget Embed Code</Label>
                    <span className="text-[8px] text-gold/60 uppercase tracking-widest">Optional: Paste script from Elfsight/LightWidget</span>
                  </div>
                  <textarea 
                    className="w-full min-h-[150px] p-5 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-gold/50 outline-none transition-all text-xs font-mono"
                    value={settings.instagram_widget_code || ""}
                    onChange={(e) => setSettings({...settings, instagram_widget_code: e.target.value})}
                    placeholder="<script src='...'></script>"
                  />
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full h-14 bg-gold hover:bg-gold/90 text-black font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-serif text-2xl italic flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold" />
                Featured Visuals
              </h3>
              <div className="relative">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  id="gallery-upload"
                  disabled={uploading}
                />
                <Button 
                  asChild
                  disabled={uploading}
                  className="bg-white text-black hover:bg-gold transition-all font-bold px-8 h-12 rounded-xl"
                >
                  <label htmlFor="gallery-upload" className="cursor-pointer flex items-center gap-2">
                    {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Photo
                  </label>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-gold/30">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={image.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="rounded-full h-10 w-10 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black"
                        onClick={() => handleMoveImage(index, 'left')}
                        disabled={index === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="rounded-full h-10 w-10 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black"
                        onClick={() => handleMoveImage(index, 'right')}
                        disabled={index === galleryImages.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="rounded-full h-10 w-10"
                        onClick={() => handleDeleteImage(image.id, image.url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-black/20">
                    <Input 
                      placeholder="Image caption..." 
                      className="h-10 bg-transparent border-transparent hover:border-white/10 focus:border-gold/30 text-xs text-zinc-400 focus:text-white transition-all text-center"
                      value={image.title || ""}
                      onChange={(e) => setGalleryImages(prev => prev.map(img => img.id === image.id ? { ...img, title: e.target.value } : img))}
                      onBlur={(e) => handleUpdateImageTitle(image.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {galleryImages.length === 0 && (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                  <ImageIcon className="h-16 w-16 text-zinc-800 mx-auto mb-6" />
                  <p className="text-zinc-500 font-serif italic text-lg">Your gallery is currently empty.</p>
                  <p className="text-zinc-700 text-[10px] uppercase tracking-widest mt-2">Upload images to showcase your brand</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
