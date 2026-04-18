"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/lib/auth"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Footer from "@/src/app/components/Footer"
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Edit,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { profileService, type UserProfile, type Address, type UserOrder, type OrderItem } from "@/src/lib/profileService"
import { useToast } from "@/components/ui/use-toast"
import { AddAddressModal } from "@/src/app/components/AddAddressModal"
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'
import { useWishlistStore } from "@/src/store/wishlist"
import { ProductInfo } from "@/src/data/product-info"
import Image from "next/image"
import { useCartStore } from "@/src/lib/cartStore"

interface ExtendedUserProfile extends UserProfile {
  avatarUrl?: string;
}

const SimpleNavbar = dynamic(() => import("@/src/app/components/SimpleNavbar"), { ssr: false })
const Cart = dynamic(() => import("@/src/app/components/Cart"), { ssr: false })

export default function Profile() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore()
  const { addItem, setIsOpen } = useCartStore()
  const [profile, setProfile] = useState<ExtendedUserProfile>({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    is_active: true,
    avatarUrl: ""
  })

  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})

  // Generate avatar URL when email changes
  useEffect(() => {
    const generateAvatar = async () => {
      if (profile.email) {
        const avatar = createAvatar(initials, {
          seed: profile.email,
          backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
          radius: 50
        });
        const svg = await avatar.toDataUri();
        setProfile(prev => ({ ...prev, avatarUrl: svg }));
      }
    };
    generateAvatar();
  }, [profile.email]);

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
        
        const addressesData = await profileService.getAddresses()
        setAddresses(addressesData.filter(addr => addr !== null))
        
        const ordersData = await profileService.getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error loading profile data:", error)
        toast({
          title: "Error Loading Profile",
          description: "Unable to load your profile information. Please try again later.",
          variant: "destructive",
          duration: 5000
        })
      }
    }

    loadProfileData()
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev: ExtendedUserProfile) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedProfile = await profileService.updateProfile({
        full_name: profile.full_name,
        phone: profile.phone
      })
      setProfile(updatedProfile)
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const handleAddAddress = async (address: Omit<Address, 'id' | 'created_at'>) => {
    try {
      // If new address is default, update all other addresses to non-default
      if (address.is_default) {
        await Promise.all(
          addresses
            .filter(addr => addr)
            .map(addr => 
              profileService.updateAddress(addr.id, { is_default: false })
            )
        )
      }
      const newAddress = await profileService.addAddress(address)
      // Reload all addresses to ensure consistency
      const updatedAddresses = await profileService.getAddresses()
      setAddresses(updatedAddresses.filter(addr => addr !== null))
      toast({
        title: "Success",
        description: "Address added successfully"
      })
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      })
    }
  }

  const handleUpdateAddress = async (id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      // If setting as default, update all other addresses to non-default
      if (updates.is_default) {
        await Promise.all(
          addresses
            .filter(addr => addr && addr.id !== id)
            .map(addr => 
              profileService.updateAddress(addr.id, { is_default: false })
            )
        )
      }
      await profileService.updateAddress(id, updates)
      // Reload all addresses to ensure consistency
      const updatedAddresses = await profileService.getAddresses()
      setAddresses(updatedAddresses.filter(addr => addr !== null))
      toast({
        title: "Success",
        description: "Address updated successfully"
      })
    } catch (error) {
      console.error("Error updating address:", error)
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      })
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "Processing":
        return <Clock className="h-4 w-4 mr-1" />
      case "Shipped":
        return <Package className="h-4 w-4 mr-1" />
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 mr-1" />
      default:
        return <Clock className="h-4 w-4 mr-1" />
    }
  }

  const handleAddToCart = (product: ProductInfo.Product, size: string) => {
    try {
      const sizeOption = product.sizeOptions.find((s) => s.size === size)
      const price = sizeOption ? sizeOption.price : product.price

      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: price,
        image: product.images[size as "30" | "50"][0],
        images: product.images,
        quantity: 1,
        size: size,
        type: "single",
      }
      addItem(cartItem)

      setIsOpen(true)

      toast({
        title: "Added to Cart",
        description: `${product.name} (${size}ml) has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
  }

  const handleRemoveFromWishlist = (productId: string) => {
    try {
      removeFromWishlist(productId)
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      <SimpleNavbar />

      <div className="container mx-auto px-6 py-32 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Architectural Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-8">
            <div className="bg-zinc-900 border border-white/5 rounded-none p-10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-700" />
              
              <div className="flex flex-col items-center relative z-10">
                <div className="relative mb-6">
                  <Avatar className="h-24 w-24 rounded-none border border-white/10 p-1 bg-zinc-950">
                    <AvatarImage src={profile.avatarUrl} alt={profile.full_name} className="object-cover" />
                    <AvatarFallback className="bg-zinc-950 text-white rounded-none font-serif text-2xl">{profile.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-black rounded-none" title="Verified Profile" />
                </div>
                
                <h2 className="text-2xl font-serif text-white mb-1 tracking-tight text-center">{profile.full_name}</h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 text-center">{profile.email}</p>
              </div>

              <div className="my-8 border-t border-white/5" />

              <nav className="flex flex-col space-y-1">
                {[
                  { id: 'profile', icon: User, label: 'Personal Registry' },
                  { id: 'orders', icon: Package, label: 'Order History', href: '/my-orders' },
                  { id: 'wishlist', icon: Heart, label: 'Curated Wishlist' },
                  { id: 'settings', icon: Settings, label: 'Global Settings' },
                ].map((item) => (
                  <Button 
                    key={item.id}
                    variant="ghost" 
                    className="w-full justify-start rounded-none h-12 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all group px-4"
                    asChild={!!item.href}
                  >
                    {item.href ? (
                      <a href={item.href}>
                        <item.icon className="h-4 w-4 mr-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                        {item.label}
                      </a>
                    ) : (
                      <div className="cursor-pointer">
                        <item.icon className="h-4 w-4 mr-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                        {item.label}
                      </div>
                    )}
                  </Button>
                ))}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none h-12 text-[10px] uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 hover:bg-red-500/5 mt-4 px-4"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </nav>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-none p-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6 font-bold flex items-center">
                <MapPin className="h-3 w-3 mr-2" />
                Saved Enclaves
              </h3>
              
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-px bg-white/10 relative overflow-hidden">
                      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-white/40" />
                    </div>
                  </div>
                ) : (
                  <>
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div key={address.id} className="group relative">
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">{address.type}</span>
                            {address.is_default && (
                              <span className="text-[7px] uppercase tracking-[0.3em] font-mono text-zinc-950 bg-white px-2 py-0.5">Primary</span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/30 leading-relaxed font-light mb-3">
                            {address.address}, {address.city}, {address.state} {address.pincode}
                          </p>
                          <AddAddressModal 
                            onAddAddress={handleAddAddress} 
                            onUpdateAddress={handleUpdateAddress}
                            userId={profile.id}
                            editAddress={address}
                            isEdit={true}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-white/20 text-center py-4 uppercase tracking-widest italic font-light">
                        No vaults found
                      </p>
                    )}
                    <div className="pt-2 border-t border-white/5">
                      <AddAddressModal 
                        onAddAddress={handleAddAddress} 
                        userId={profile.id}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="flex bg-transparent border-b border-white/5 w-full justify-start rounded-none h-auto p-0 mb-12 gap-10">
                {[
                  { value: 'profile', label: 'Identity' },
                  { value: 'wishlist', label: 'Aspirations' },
                  { value: 'settings', label: 'Preferences' }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold h-12 px-0 transition-all hover:text-white/60"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile" className="focus-visible:ring-0">
                <div className="space-y-12">
                  <div className="bg-zinc-900 border border-white/5 rounded-none p-10">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-serif text-white tracking-tight">Identity Details</h3>
                       <Badge variant="outline" className="rounded-none border-white/10 text-[8px] uppercase tracking-widest text-white/40">Verified</Badge>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={profile.full_name}
                          onChange={handleInputChange}
                          className="bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2 opacity-50">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 ml-1">Email (Permanent)</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="bg-zinc-950 border-white/5 text-white/50 rounded-none h-12 cursor-not-allowed font-mono text-sm"
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 ml-1">Cellular Registry</label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all font-mono text-sm"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end mt-4">
                        <Button type="submit" className="bg-white hover:bg-zinc-200 text-black px-10 rounded-none h-12 text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl">
                          Sync Profile
                        </Button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-zinc-900 border border-white/5 rounded-none p-10">
                    <h3 className="text-xl font-serif text-white tracking-tight mb-8">Primary Logistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                         <div className="flex items-center text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
                           <MapPin className="h-3 w-3 mr-2 opacity-50" />
                           Base Location
                         </div>
                         <p className="text-[11px] text-white/60 leading-relaxed font-light">
                            {addresses.find((a) => a && a.is_default) ? (
                              <>
                                {addresses.find((a) => a && a.is_default)?.address}, {addresses.find((a) => a && a.is_default)?.city}
                              </>
                            ) : (
                              "Undefined"
                            )}
                         </p>
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
                           <Phone className="h-3 w-3 mr-2 opacity-50" />
                           Verified Line
                         </div>
                         <p className="text-[11px] text-white/60 font-mono tracking-wider">
                            {profile.phone || "Undefined"}
                         </p>
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
                           <Mail className="h-3 w-3 mr-2 opacity-50" />
                           Dispatch Email
                         </div>
                         <p className="text-[11px] text-white/60 font-mono truncate">
                            {profile.email}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wishlist" className="focus-visible:ring-0">
                <div className="bg-zinc-900 border border-white/5 rounded-none p-10">
                  <div className="flex justify-between items-end mb-12">
                     <h3 className="text-3xl font-serif text-white tracking-tight">Curation</h3>
                     <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">{wishlistItems.length} OBJECTS SAVED</p>
                  </div>

                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5">
                      {wishlistItems.map((item) => {
                        const product = ProductInfo.allProductItems.find(p => p.id.toString() === item.id)
                        if (!product) return null

                        return (
                          <div key={item.id} className="bg-zinc-950 p-8 flex flex-col sm:flex-row items-center gap-10 group transition-all">
                            <div className="relative w-40 aspect-[3/4] overflow-hidden shrink-0 bg-zinc-900">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                              />
                            </div>
                            
                            <div className="flex-1 flex flex-col h-full py-2">
                              <div className="flex flex-col gap-1 mb-6">
                                <h3 className="text-2xl font-serif text-white tracking-wide">{item.name}</h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
                                  {product.tagline || product.category}
                                </p>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-8 mb-8">
                                <div className="space-y-1.5">
                                  <label className="block text-[8px] uppercase tracking-widest text-white/20">Valuation</label>
                                  <p className="text-sm font-mono text-white tracking-wider">₹{item.price}</p>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-[8px] uppercase tracking-widest text-white/20">Capacity</label>
                                  <select
                                    className="bg-transparent text-sm font-mono text-white border-b border-white/10 focus:border-white transition-colors cursor-pointer outline-none pb-0.5"
                                    value={selectedSizes[item.id] || product.sizeOptions[0].size}
                                    onChange={(e) => handleSizeSelect(item.id, e.target.value)}
                                  >
                                    {product.sizeOptions.map((size) => (
                                      <option key={size.size} value={size.size} className="bg-zinc-900">
                                        {size.size}ML
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 mt-auto">
                                <Button
                                  variant="outline"
                                  className="rounded-none border-white/10 hover:border-white/30 hover:bg-white/5 text-[9px] uppercase tracking-[0.2em] font-bold h-11 px-8"
                                  onClick={() => handleAddToCart(product, selectedSizes[item.id] || product.sizeOptions[0].size)}
                                >
                                  Acquire
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="rounded-none text-white/20 hover:text-red-500 hover:bg-transparent text-[9px] uppercase tracking-[0.2em] h-11"
                                  onClick={() => handleRemoveFromWishlist(item.id)}
                                >
                                  Discard
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20 border border-dashed border-white/5">
                      <Heart className="h-10 w-10 mx-auto text-white/5 mb-6" strokeWidth={0.5} />
                      <h3 className="text-xl font-serif text-white/20 mb-8 italic">Your curation is currently void.</h3>
                      <Button 
                        onClick={() => router.push("/collection")}
                        className="bg-white text-black rounded-none px-10 h-12 text-[10px] uppercase tracking-[0.2em] font-bold"
                      >
                        Explore Essence
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="focus-visible:ring-0">
                <div className="bg-zinc-900 border border-white/5 rounded-none p-10">
                   <h3 className="text-3xl font-serif text-white tracking-tight mb-12">System Toggles</h3>
                   
                   <div className="divide-y divide-white/5">
                      <div className="py-8 first:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-bold">Security Credentials</h4>
                              <p className="text-[10px] text-white/30 tracking-wider">Rotate your access password</p>
                           </div>
                           <Button variant="outline" className="rounded-none border-white/10 hover:border-white text-[9px] uppercase tracking-[0.2em] px-8 h-10">
                              Initiate Rotation
                           </Button>
                        </div>
                      </div>

                      <div className="py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-bold">Communication Protocol</h4>
                              <p className="text-[10px] text-white/30 tracking-wider">Manage system alerts and news</p>
                           </div>
                           <Button variant="outline" className="rounded-none border-white/10 hover:border-white text-[9px] uppercase tracking-[0.2em] px-8 h-10">
                              Config Alerts
                           </Button>
                        </div>
                      </div>

                      <div className="py-8 pb-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <h4 className="text-[11px] uppercase tracking-[0.2em] text-red-500 font-bold">Termination</h4>
                              <p className="text-[10px] text-white/20 tracking-wider">Erase your profile from the registry</p>
                           </div>
                           <Button variant="ghost" className="rounded-none text-red-500/40 hover:text-red-500 hover:bg-red-500/5 text-[9px] uppercase tracking-[0.2em] px-8 h-10">
                              Purge Account
                           </Button>
                        </div>
                      </div>
                   </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>  </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
