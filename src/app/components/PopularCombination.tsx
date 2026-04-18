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
        < section className="container mx-auto px-4 py-16" >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Combinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-gray-800/50 rounded-xl h-64 animate-pulse" />
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
                                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <div className="relative h-48 mb-6">
                                    {/* First Perfume Circle */}
                                    <div className="absolute left-0 top-0 w-32 h-32 rounded-full overflow-hidden border-2 border-white/20">
                                        <Image
                                            src={perfume1.images["30"][0]}
                                            alt={perfume1.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* Second Perfume Circle */}
                                    <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full overflow-hidden border-2 border-white/20">
                                        <Image
                                            src={perfume2.images["30"][0]}
                                            alt={perfume2.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* Overlay Circle */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                            <Blend />
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">{combo.name}</h3>
                                    <div className="flex justify-center gap-2 mb-4">
                                        <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                                            {perfume1.name}
                                        </span>
                                        <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                                            {perfume2.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{combo.popularity} Popular</span>
                                    </div>
                                    <Button
                                        className="w-full bg-white text-black hover:bg-gray-200"
                                        onClick={() => addPopularComboToCart(perfume1, perfume2)}
                                    >
                                        <ShoppingBag className="w-4 h-4 mr-2" />
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