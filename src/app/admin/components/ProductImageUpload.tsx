"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ImageIcon, Loader2, Scissors, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { storageService } from "@/src/lib/storageService"
import { useToast } from "@/components/ui/use-toast"
import ImageCropper from "./ImageCropper"
import { ProductImageV2 } from "@/src/lib/productService"

interface ProductImageUploadProps {
  label: string
  images: ProductImageV2[]
  onImagesChange: (images: ProductImageV2[]) => void
  folder: string
  maxImages?: number
}

export default function ProductImageUpload({
  label,
  images,
  onImagesChange,
  folder,
  maxImages = 8
}: ProductImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<{ url: string, index: number } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: "Limit exceeded",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    const newImages: ProductImageV2[] = [...images]

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) {
          toast({ title: "Invalid file", description: `${file.name} is not an image.`, variant: "destructive" })
          continue
        }

        const url = await storageService.uploadProductImage(file, folder)
        newImages.push({
          url,
          is_primary: images.length === 0 && i === 0, // Auto-set first as primary
          order: newImages.length,
        })
        setProgress(((i + 1) / files.length) * 100)
      }

      onImagesChange(newImages)
      toast({
        title: "Media Refined",
        description: `Successfully uploaded ${files.length} asset(s).`
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your images.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // If we removed the primary, set the first remaining one as primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true
    }
    onImagesChange(newImages)
  }

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }))
    onImagesChange(newImages)
    toast({ title: "Master Image Set", description: "This image will be your main product thumbnail." })
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return
    if (direction === 'right' && index === images.length - 1) return

    const newImages = [...images]
    const swapIndex = direction === 'left' ? index - 1 : index + 1
    const temp = newImages[index]
    newImages[index] = newImages[swapIndex]
    newImages[swapIndex] = temp
    
    // Update order metadata
    const orderedImages = newImages.map((img, i) => ({ ...img, order: i }))
    onImagesChange(orderedImages)
  }

  const handleCropComplete = async (blob: Blob) => {
    if (!selectedImageForCrop) return
    
    setIsUploading(true)
    try {
      const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' })
      const newUrl = await storageService.uploadProductImage(file, folder)
      
      const newImages = [...images]
      newImages[selectedImageForCrop.index] = {
        ...newImages[selectedImageForCrop.index],
        url: newUrl
      }
      onImagesChange(newImages)
      toast({ title: "Crop Applied", description: "Composition has been updated successfully." })
    } catch (error) {
      toast({ title: "Crop Failed", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">
          {label} <span className="text-zinc-700 font-bold">({images.length} / {maxImages})</span>
        </label>
        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Drag to reorder or set primary</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <motion.div
              key={img.url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative aspect-square rounded-[1.5rem] overflow-hidden border transition-all duration-300 group shadow-xl ${
                img.is_primary ? 'border-gold ring-2 ring-gold/20' : 'border-white/10 bg-white/5'
              }`}
            >
              <img
                src={img.url}
                alt={`${label} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => moveImage(index, 'left')}
                    disabled={index === 0}
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveImage(index, 'right')}
                    disabled={index === images.length - 1}
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedImageForCrop({ url: img.url, index })
                      setCropperOpen(true)
                    }}
                    className="p-2 bg-white text-black hover:bg-gold transition-colors rounded-full shadow-lg"
                    title="Crop Image"
                  >
                    <Scissors className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPrimary(index)}
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      img.is_primary ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Set as Primary"
                  >
                    <Star className="h-4 w-4" fill={img.is_primary ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-lg"
                    title="Remove Image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {img.is_primary && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-gold text-black text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg pointer-events-none">
                  Master
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < maxImages && (
          <div className="relative aspect-square">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id={`upload-${label}`}
              disabled={isUploading}
            />
            <label
              htmlFor={`upload-${label}`}
              className={`
                flex flex-col items-center justify-center w-full h-full 
                border-2 border-dashed rounded-[1.5rem] cursor-pointer
                transition-all duration-300
                ${isUploading 
                  ? 'border-gold/50 bg-gold/5 cursor-not-allowed' 
                  : 'border-white/10 bg-white/5 hover:border-gold/50 hover:bg-gold/5'}
              `}
            >
              {isUploading ? (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto mb-3" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-gold">Processing...</span>
                </div>
              ) : (
                <div className="text-center group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/10 transition-colors">
                    <Upload className="h-6 w-6 text-zinc-500 group-hover:text-gold transition-colors" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500 group-hover:text-gold transition-colors">Add Media</span>
                </div>
              )}
            </label>
          </div>
        )}
      </div>

      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2"
        >
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}

      {selectedImageForCrop && (
        <ImageCropper
          open={cropperOpen}
          image={selectedImageForCrop.url}
          onClose={() => {
            setCropperOpen(false)
            setSelectedImageForCrop(null)
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  )
}
