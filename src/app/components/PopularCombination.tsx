"use client";

import { ProductInfo } from '@/src/data/product-info'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Blend } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { useCartStore } from '@/src/lib/cartStore'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button';

function PopularCombination() {
    const { toast } = useToast()
    const { addItem, setIsOpen } = useCartStore()
    const [products, setProducts] = React.useState<ProductInfo.Product[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const items = await ProductInfo.loadProducts()
                setProducts(items)
            } catch (err) {
                console.error("Failed to load products:", err)
                setProducts(ProductInfo.getAllProductItems())
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    const addPopularComboToCart = (perfume1: any, perfume2: any) => {
        if (!perfume1 || !perfume2) return

        setTimeout(() => {
            const sizeOption1 = perfume1.sizeOptions.find((s: any) => s.size === "30")
            const sizeOption2 = perfume2.sizeOptions.find((s: any) => s.size === "30")
            const totalPrice = (sizeOption1 ? sizeOption1.price : perfume1.price) +
                (sizeOption2 ? sizeOption2.price : perfume2.price)

            const layeredProduct = {
                id: `layered-${perfume1.id}-${perfume2.id}-${Date.now()}`,
                name: `${perfume1.name} + ${perfume2.name}`,
                price: totalPrice,
                image: perfume1.images["30"][0],
                quantity: 1,
                type: "layered",
                size: "30ml + 30ml",
                sizes: {
                    perfume1: "30",
                    perfume2: "30",
                },
                description: `Custom layered fragrance: ${perfume1.name} (30ml) + ${perfume2.name} (30ml)`,
            }

            addItem(layeredProduct)
            setIsOpen(true)

            toast({
                title: "Popular Combination Added! 🎉",
                description: `${layeredProduct.name} has been added to your cart.`,
            })
        }, 1200)
    }
    return (
        <section className="container mx-auto px-4 py-32 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4 font-mono">Curated Synergy</h2>
                    <h3 className="text-3xl md:text-4xl font-serif text-white tracking-wide">Cult Combinations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 h-64 animate-pulse rounded-none" />
                        ))
                    ) : ProductInfo.popularCombinations.map((combo, index) => {
                        const perfume1 = products.find(p => p.name === combo.fragrance1)
                        const perfume2 = products.find(p => p.name === combo.fragrance2)

                        if (!perfume1 || !perfume2) return null

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-950 p-8 border border-white/5 hover:border-white/20 hover:bg-zinc-900/20 transition-all duration-500 rounded-none group flex flex-col items-center text-center"
                            >
                                <div className="relative h-48 mb-8 w-full">
                                    {/* First Perfume Circle */}
                                    <div className="absolute left-4 top-0 w-32 h-32 rounded-full overflow-hidden border border-white/10 z-10 group-hover:-translate-x-2 transition-transform duration-500">
                                        <Image
                                            src={perfume1.images["30"][0]}
                                            alt={perfume1.name}
                                            fill
                                            className="object-cover mix-blend-screen"
                                        />
                                    </div>
                                    {/* Second Perfume Circle */}
                                    <div className="absolute right-4 bottom-0 w-32 h-32 rounded-full overflow-hidden border border-white/10 group-hover:translate-x-2 transition-transform duration-500">
                                        <Image
                                            src={perfume2.images["30"][0]}
                                            alt={perfume2.name}
                                            fill
                                            className="object-cover mix-blend-screen"
                                        />
                                    </div>
                                    {/* Overlay Circle */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-white/20 flex items-center justify-center z-20 text-black">
                                        <span className="text-sm font-medium">
                                            <Blend strokeWidth={1.5} className="w-5 h-5"/>
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center w-full">
                                    <h3 className="text-lg font-serif mb-4 tracking-wide text-white">{combo.name}</h3>
                                    <div className="flex justify-center flex-wrap gap-2 mb-6">
                                        <span className="text-[9px] uppercase tracking-widest text-white/60 border border-white/10 px-3 py-1 bg-white/5 rounded-full">
                                            {perfume1.name}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest text-white/60 border border-white/10 px-3 py-1 bg-white/5 rounded-full">
                                            {perfume2.name}
                                        </span>
                                    </div>
                                    
                                    <Button
                                        className="w-full bg-transparent border border-white/20 text-white hover:bg-white hover:text-black rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-500 h-12"
                                        onClick={() => addPopularComboToCart(perfume1, perfume2)}
                                    >
                                        <ShoppingBag className="w-4 h-4 mr-2" strokeWidth={1.5} />
                                        Add to Cart
                                    </Button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section >
    )
}

export default PopularCombination