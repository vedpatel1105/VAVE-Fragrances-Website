"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog"
import { Square, Maximize2, Scissors } from "lucide-react"

interface ImageCropperProps {
  image: string
  open: boolean
  onClose: () => void
  onCropComplete: (croppedImage: Blob) => void
  aspectRatio?: number // default 1
}

export default function ImageCropper({
  image,
  open,
  onClose,
  onCropComplete,
  aspectRatio = 1
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [currentAspect, setCurrentAspect] = useState(aspectRatio)

  const onCropChange = (crop: any) => setCrop(crop)
  const onZoomChange = (zoom: any) => setZoom(zoom)

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) return

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"))
            return
          }
          resolve(blob)
        }, "image/jpeg", 0.9)
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async () => {
    const croppedBlob = await getCroppedImg()
    if (croppedBlob) {
      onCropComplete(croppedBlob)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-950 border border-white/10 p-0 overflow-hidden rounded-[2rem] shadow-2xl">
        <DialogHeader className="p-8 border-b border-white/5 bg-white/5">
          <DialogTitle className="text-2xl font-serif text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-gold" />
            </div>
            Refine Composition
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-[450px] w-full bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={currentAspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-8 space-y-8 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Zoom Level</div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(vals) => setZoom(vals[0])}
              className="flex-1 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
              <Button
                variant={currentAspect === 1 ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentAspect(1)}
                className="rounded-xl h-10 px-4 flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold transition-all"
              >
                <Square className="h-3.5 w-3.5" /> 1:1
              </Button>
              <Button
                variant={currentAspect === 3/4 ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentAspect(3/4)}
                className="rounded-xl h-10 px-4 flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold transition-all"
              >
                <Maximize2 className="h-3.5 w-3.5" /> 3:4
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-12 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-white">Cancel</Button>
              <Button onClick={handleSave} className="bg-gold hover:bg-gold/90 text-black font-black uppercase tracking-widest text-[11px] rounded-xl px-8 h-12 shadow-[0_10px_20px_-10px_rgba(212,175,55,0.4)] transition-all active:scale-95">
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
