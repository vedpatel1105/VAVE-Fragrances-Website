"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, Truck, CheckCircle, Clock, Search, Filter, ChevronDown, ChevronRight, Eye, Loader2 } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getSupabaseClient } from "@/src/lib/supabaseClient"
import { useAuthStore } from "@/src/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import SimpleNavbar from "../components/SimpleNavbar"

interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  image: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  subtotal_amount?: number;
  shipping_amount?: number;
  status: string;
  items: OrderItem[];
  shipping_address: string;
  payment_method: string;
}

interface TrackingInfo {
  number: string | null;
  carrier: string | null;
  events: Array<{
    date: string;
    status: string;
    location: string;
  }>;
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const client = getSupabaseClient();
        const { data, error } = await client
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true

    const statusMap: { [key: string]: string[] } = {
      'processing': ['pending', 'paid'],
      'in_transit': ['shipped'],
      'delivered': ['delivered'],
      'cancelled': ['cancelled', 'failed']
    };

    return statusMap[activeTab]?.includes(order.status) || order.status === activeTab
  })

  const searchedOrders = filteredOrders.filter((order) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return order.id.toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query))
  })

  const sortedOrders = [...searchedOrders].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()

    if (sortBy === "newest") {
      return dateB - dateA
    } else if (sortBy === "oldest") {
      return dateA - dateB
    } else if (sortBy === "price-high") {
      return b.total_amount - a.total_amount
    } else if (sortBy === "price-low") {
      return a.total_amount - b.total_amount
    }

    return 0
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>
      case "paid":
        return <Badge className="bg-amber-500">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "failed":
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "paid":
      case "pending":
        return <Package className="h-5 w-5 text-amber-500" />
      case "failed":
      case "cancelled":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const viewOrderDetails = (orderId: string) => {
    setSelectedOrder(orderId)
  }

  const trackOrder = (orderId: string) => {
    router.push(`/track-order/${orderId}`)
  }

  const getSelectedOrder = () => {
    return orders.find((order) => order.id === selectedOrder)
  }

  const getTrackingInfo = (order: Order): TrackingInfo => {
    return {
      number: order.status === 'shipped' ? `BD${order.id.slice(-9)}` : null,
      carrier: order.status === 'shipped' ? 'BlueDart' : null,
      events: [
        {
          date: new Date(order.created_at).toISOString(),
          status: "Order Placed",
          location: "Delhi"
        },
        ...(order.status === 'shipped' ? [
          {
            date: new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            status: "Shipped",
            location: "Delhi"
          }
        ] : []),
        ...(order.status === 'delivered' ? [
          {
            date: new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Delivered",
            location: "Mumbai"
          }
        ] : [])
      ]
    };
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium">Loading orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <SimpleNavbar />
      <main className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">My Orders</h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")}>Price: Low to High</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="in_transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {sortedOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchQuery
                      ? `No orders matching "${searchQuery}"`
                      : "You don't have any orders in this category yet."}
                  </p>
                  <Button onClick={() => router.push("/collection")}>Browse Collection</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${selectedOrder === order.id ? "border-2 border-accent" : ""
                        }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div className="flex items-center mb-2 md:mb-0">
                            {getStatusIcon(order.status)}
                            <div className="ml-3">
                              <h3 className="font-bold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {getStatusBadge(order.status)}
                            <span className="mx-4 text-gray-300 dark:text-gray-600">|</span>
                            <span className="font-bold">₹{order.total_amount}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          {order.items.slice(0, 4).map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.size}ml × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}

                          {order.items.length > 4 && (
                            <div className="flex items-center justify-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                +{order.items.length - 4} more items
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button variant="outline" className="flex-1" onClick={() => viewOrderDetails(order.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {selectedOrder === order.id ? "Hide Details" : "View Details"}
                          </Button>

                          <Button className="flex-1" onClick={() => trackOrder(order.id)}>
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                        </div>
                      </div>

                      {selectedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-bold mb-2">Shipping Address</h4>
                                {(() => {
                                  const shippingAddress = typeof order.shipping_address === 'string'
                                    ? JSON.parse(order.shipping_address)
                                    : order.shipping_address;
                                  return (
                                    <>
                                      <p className="text-gray-700 dark:text-gray-300">{shippingAddress.name}</p>
                                      <p className="text-gray-700 dark:text-gray-300">{shippingAddress.address}</p>
                                      <p className="text-gray-700 dark:text-gray-300">
                                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                                      </p>
                                      <p className="text-gray-700 dark:text-gray-300">{shippingAddress.phone}</p>
                                    </>
                                  );
                                })()}
                              </div>

                              <div>
                                <h4 className="font-bold mb-2">Payment Information</h4>
                                <p className="text-gray-700 dark:text-gray-300">Method: {order.payment_method}</p>
                                <p className="text-gray-700 dark:text-gray-300">Status: {order.status === 'paid' ? 'Paid' : 'Pending'}</p>
                              </div>

                              <div>
                                <h4 className="font-bold mb-2">Order Summary</h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span>₹{typeof order.subtotal_amount === 'number' ? order.subtotal_amount : (order.total_amount - (order.shipping_amount ?? 0))}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                                    <span>{typeof order.shipping_amount === 'number' ? `₹${order.shipping_amount}` : 'Included'}</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>₹{order.total_amount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            <h4 className="font-bold mb-4">Tracking Information</h4>
                            {(() => {
                              const tracking = getTrackingInfo(order);
                              return tracking.number ? (
                                <div>
                                  <div className="flex justify-between items-center mb-4">
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400">Tracking Number:</p>
                                      <p className="font-medium">{tracking.number}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400">Carrier:</p>
                                      <p className="font-medium">{tracking.carrier}</p>
                                    </div>
                                    <Button variant="outline" onClick={() => trackOrder(order.id)}>
                                      View Detailed Tracking
                                    </Button>
                                  </div>

                                  <div className="relative">
                                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                                    <div className="space-y-6">
                                      {tracking.events.slice(0, 3).map((event, index) => (
                                        <div key={index} className="flex">
                                          <div
                                            className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full ${index === 0 ? "bg-accent text-white" : "bg-gray-200 dark:bg-gray-700"
                                              } mr-4`}
                                          >
                                            {index === 0 ? (
                                              <CheckCircle className="h-4 w-4" />
                                            ) : (
                                              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                                            )}
                                          </div>
                                          <div>
                                            <p className="font-medium">{event.status}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                              {new Date(event.date).toLocaleString()} • {event.location}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {tracking.events.length > 3 && (
                                    <Button variant="link" className="mt-4" onClick={() => trackOrder(order.id)}>
                                      View All {tracking.events.length} Updates
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-600 dark:text-gray-400">
                                  Tracking information will be available once your order ships.
                                </p>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
