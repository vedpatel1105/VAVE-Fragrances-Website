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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SimpleNavbar />

      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={profile.avatarUrl} alt={profile.full_name} />
                    <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profile.full_name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                </div>

                <Separator className="my-4" />

                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#orders">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#wishlist">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Shipping Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : (
                  <>
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div key={address.id} className="text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium">{address.type}</div>
                            {address.is_default && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {address.address}, {address.city}, {address.state}, {address.pincode}
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
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No addresses found. Add your first address below.
                      </p>
                    )}
                    <AddAddressModal 
                      onAddAddress={handleAddAddress} 
                      userId={profile.id}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={profile.full_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-gray-100 text-black"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <Button type="submit">Update Profile</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Your contact details are used for order updates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Default Shipping Address</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {addresses.find((a) => a && a.is_default) ? (
                              <>
                                {addresses.find((a) => a && a.is_default)?.address},
                                {addresses.find((a) => a && a.is_default)?.city},
                                {addresses.find((a) => a && a.is_default)?.state},
                                {addresses.find((a) => a && a.is_default)?.pincode}
                              </>
                            ) : (
                              "No default address set"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <div>
                          <h4 className="font-medium">Phone Number</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <div>
                          <h4 className="font-medium">Email Address</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 flex flex-wrap justify-between items-center gap-4">
                              <div>
                                <div className="font-medium">Order #{order.id}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Placed on {new Date(order.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge className={getOrderStatusColor(order.status)}>
                                  {getOrderStatusIcon(order.status)}
                                  {order.status}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="space-y-4">
                                {order.items.map((item: OrderItem) => (
                                  <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                      <ShoppingBag className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">{item.name}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.size} • Qty: {item.quantity}
                                      </div>
                                    </div>
                                    <div className="font-medium">₹{item.price * item.quantity}</div>
                                  </div>
                                ))}
                              </div>
                              <Separator className="my-4" />
                              <div className="flex justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                                <div className="font-bold">₹{order.total}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          When you place an order, it will appear here.
                        </p>
                        <Button>Start Shopping</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Products you've saved for later.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {wishlistItems.length > 0 ? (
                      <div className="space-y-6">
                        {wishlistItems.map((item) => {
                          const product = ProductInfo.allProductItems.find(p => p.id.toString() === item.id)
                          if (!product) return null

                          return (
                            <div key={item.id} className="flex items-center gap-6 p-4 border rounded-lg">
                              <div className="relative w-24 h-24">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price}</p>
                                <div className="mt-2">
                                  <select
                                    className="w-24 px-2 py-1 text-sm border rounded-md"
                                    value={selectedSizes[item.id] || product.sizeOptions[0].size}
                                    onChange={(e) => handleSizeSelect(item.id, e.target.value)}
                                  >
                                    {product.sizeOptions.map((size) => (
                                      <option key={size.size} value={size.size}>
                                        {size.size}ml
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleAddToCart(product, selectedSizes[item.id] || product.sizeOptions[0].size)}
                                >
                                  Add to Cart
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                  onClick={() => handleRemoveFromWishlist(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Save your favorite items to your wishlist for later.
                        </p>
                        <Button onClick={() => router.push("/collection")}>Explore Collection</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Change your password to keep your account secure.
                        </p>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Manage your email and SMS notification preferences.
                        </p>
                        <Button variant="outline">Notification Settings</Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Permanently delete your account and all associated data.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
