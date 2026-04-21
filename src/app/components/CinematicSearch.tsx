"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Zap,
  ShoppingBag,
  Sparkles,
  Command as CommandIcon,
  Tag,
  ChevronRight
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { ProductInfo } from "@/src/data/product-info"
import { formatCurrency } from "@/lib/utils"

export default function CinematicSearch() {
  const [open, setOpen] = React.useState(false)
  const [products, setProducts] = React.useState<ProductInfo.Product[]>([])
  const router = useRouter()

  React.useEffect(() => {
    setProducts(ProductInfo.getAllProductItems())
    
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex items-center gap-2 px-3 py-1.5 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium hidden sm:inline-block">Search Collection</span>
        <kbd className="pointer-events-none hidden h-4 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[8px] font-medium text-white/40 opacity-100 sm:flex">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="p-2 border-b border-white/5 bg-zinc-950">
           <CommandInput placeholder="Search Vave Fragrances..." className="border-none focus:ring-0 text-white" />
        </div>
        <CommandList className="bg-zinc-950 text-white max-h-[450px]">
          <CommandEmpty className="py-12 text-center">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Sparkles className="h-8 w-8" />
              <p className="text-sm">No scents found in the wind.</p>
            </div>
          </CommandEmpty>
          
          <CommandGroup heading="New Arrivals" className="px-2">
            {products.filter(p => p.isNew).slice(0, 3).map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => runCommand(() => router.push(`/product/${product.id}`))}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-900">
                  <img src={product.images.label} alt={product.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-serif font-medium">{product.name}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{product.category}</span>
                </div>
                <div className="text-[10px] text-white/20 group-hover:text-gold transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="bg-white/5" />

          <CommandGroup heading="The Collection" className="px-2">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => runCommand(() => router.push(`/product/${product.id}`))}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                   <img src={product.images.label} alt={product.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{product.name}</span>
                    {product.isBestseller && <Badge className="text-[8px] h-3.5 bg-gold text-dark py-0 px-1 border-none">Top</Badge>}
                  </div>
                  <span className="text-[10px] text-white/40">{product.tagline}</span>
                </div>
                <div className="text-xs font-serif text-white/60">
                   {formatCurrency(product.price)}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="flex items-center justify-between p-4 bg-zinc-900/50 border-t border-white/5 text-[9px] uppercase tracking-widest text-white/30">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↵</kbd> Select</span>
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↑↓</kbd> Navigate</span>
           </div>
           <div className="flex items-center gap-1">
              Vave Fragrances <Zap className="h-3 w-3 fill-gold text-gold" />
           </div>
        </div>
      </CommandDialog>
    </>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
