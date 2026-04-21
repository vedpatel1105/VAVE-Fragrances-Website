"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { storageService } from "@/src/lib/storageService"
import { useToast } from "@/components/ui/use-toast"

interface ProductImageUploadProps {
  label: string
  images: string[]
  onImagesChange: (images: string[]) => void
  folder: string
  maxImages?: number
}

export default function ProductImageUpload({
  label,
  images,
  onImagesChange,
  folder,
  maxImages = 5
}: ProductImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

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
    const newUrls: string[] = [...images]

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Basic validation
        if (!file.type.startsWith('image/')) {
          toast({ title: "Invalid file", description: `${file.name} is not an image.`, variant: "destructive" })
          continue
        }

        const url = await storageService.uploadProductImage(file, folder)
        newUrls.push(url)
        setProgress(((i + 1) / files.length) * 100)
      }

      onImagesChange(newUrls)
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${files.length} image(s).`
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

  const removeImage = async (index: number) => {
    const urlToRemove = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)

    // Optional: Delete from storage
    // storageService.deleteProductImage(urlToRemove).catch(console.error)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} (Max {maxImages})
        </label>
        <span className="text-xs text-gray-500">
          {images.length} / {maxImages}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {images.map((url, index) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={url}
                alt={`${label} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
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
                border-2 border-dashed rounded-lg cursor-pointer
                transition-all duration-200
                ${isUploading 
                  ? 'border-gold bg-gold/5 cursor-not-allowed' 
                  : 'border-border hover:border-gold hover:bg-gold/5'}
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-gold mb-2" />
                  <span className="text-[10px] font-medium text-gold">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-[10px] font-medium text-gray-500">Add Image</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Progress value={progress} className="h-1 bg-gold/10" />
          <p className="text-xs text-center text-gray-500">Processing images...</p>
        </motion.div>
      )}
    </div>
  )
}
