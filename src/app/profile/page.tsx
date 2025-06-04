"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
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
} from "lucide-react"

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    avatar: "/avatar-placeholder.jpg",
    addresses: [
      {
        id: 1,
        type: "Home",
        address: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        isDefault: true,
      },
      {
        id: 2,
        type: "Office",
        address: "456 Business Park, Building C",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400051",
        isDefault: false,
      },
    ],
  })

  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [orders, setOrders] = useState([
    {
      id: "ORD123456",
      date: "2023-10-15",
      status: "Delivered",
      items: [
        { id: 1, name: "Havoc", size: "50ml", price: 550, quantity: 1 },
        { id: 3, name: "Duskfall", size: "30ml", price: 350, quantity: 1 },
      ],
      total: 900,
      shippingAddress: "123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001",
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD123457",
      date: "2023-11-02",
      status: "Processing",
      items: [{ id: 2, name: "Lavior", size: "50ml", price: 550, quantity: 1 }],
      total: 550,
      shippingAddress: "123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001",
      paymentMethod: "UPI",
    },
  ])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }

      const storedWishlist = localStorage.getItem("wishlist")
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist))
      }
    } catch (error) {
      console.error("Error loading cart/wishlist:", error)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile to an API
    console.log("Updated profile:", profile)
    alert("Profile updated successfully!")
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SimpleNavbar setIsCartOpen={setIsCartOpen} cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
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
                {profile.addresses.map((address) => (
                  <div key={address.id} className="text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{address.type}</div>
                      {address.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {address.address}, {address.city}, {address.state}, {address.pincode}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-1 h-7 px-2 text-xs">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  + Add New Address
                </Button>
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
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" value={profile.phone} onChange={handleInputChange} />
                        </div>
                        <div>
                          <Label htmlFor="avatar">Profile Picture</Label>
                          <div className="flex items-center mt-2">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </div>
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
                            {profile.addresses.find((a) => a.isDefault)?.address},
                            {profile.addresses.find((a) => a.isDefault)?.city},
                            {profile.addresses.find((a) => a.isDefault)?.state},
                            {profile.addresses.find((a) => a.isDefault)?.pincode}
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
                                  Placed on {new Date(order.date).toLocaleDateString()}
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
                                {order.items.map((item) => (
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
                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Wishlist items would go here */}
                        <div className="text-center py-12">
                          <Heart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Save your favorite items to your wishlist for later.
                          </p>
                          <Button>Explore Collection</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Save your favorite items to your wishlist for later.
                        </p>
                        <Button>Explore Collection</Button>
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
