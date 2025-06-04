"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, Truck, CheckCircle, Clock, Search, Filter, ChevronDown, ChevronRight, Eye } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock order data
const orders = [
  {
    id: "OLY12345",
    date: "2023-06-15",
    total: 1050,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "Havoc",
        price: 350,
        quantity: 2,
        size: "30ml",
        image: "/img/havoc50.png",
      },
      {
        id: 2,
        name: "Lavior",
        price: 350,
        quantity: 1,
        size: "30ml",
        image: "/img/lavior50.png",
      },
    ],
    tracking: {
      number: "BD123456789",
      carrier: "BlueDart",
      events: [
        { date: "2023-06-15 18:30", status: "Delivered", location: "Mumbai" },
        { date: "2023-06-15 09:45", status: "Out for Delivery", location: "Mumbai" },
        { date: "2023-06-14 20:15", status: "Arrived at Destination", location: "Mumbai" },
        { date: "2023-06-13 14:20", status: "In Transit", location: "Delhi" },
        { date: "2023-06-12 10:30", status: "Shipped", location: "Delhi" },
        { date: "2023-06-11 16:45", status: "Order Processed", location: "Delhi" },
      ],
    },
    delivery: {
      address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400053",
      recipient: "John Doe",
      phone: "+91 9876543210",
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      status: "Paid",
    },
  },
  {
    id: "OLY12346",
    date: "2023-05-28",
    total: 550,
    status: "delivered",
    items: [
      {
        id: 3,
        name: "Duskfall",
        price: 550,
        quantity: 1,
        size: "50ml",
        image: "/img/duskfall50.png",
      },
    ],
    tracking: {
      number: "BD987654321",
      carrier: "BlueDart",
      events: [
        { date: "2023-06-01 17:15", status: "Delivered", location: "Mumbai" },
        { date: "2023-06-01 08:30", status: "Out for Delivery", location: "Mumbai" },
        { date: "2023-05-31 19:45", status: "Arrived at Destination", location: "Mumbai" },
        { date: "2023-05-30 13:20", status: "In Transit", location: "Delhi" },
        { date: "2023-05-29 09:30", status: "Shipped", location: "Delhi" },
        { date: "2023-05-28 15:45", status: "Order Processed", location: "Delhi" },
      ],
    },
    delivery: {
      address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400053",
      recipient: "John Doe",
      phone: "+91 9876543210",
    },
    payment: {
      method: "UPI",
      last4: "johndoe@upi",
      status: "Paid",
    },
  },
  {
    id: "OLY12347",
    date: "2023-07-02",
    total: 350,
    status: "in_transit",
    items: [
      {
        id: 4,
        name: "Euphoria",
        price: 350,
        quantity: 1,
        size: "30ml",
        image: "/img/euphoria50.png",
      },
    ],
    tracking: {
      number: "BD567891234",
      carrier: "BlueDart",
      events: [
        { date: "2023-07-04 13:20", status: "In Transit", location: "Delhi" },
        { date: "2023-07-03 09:30", status: "Shipped", location: "Delhi" },
        { date: "2023-07-02 15:45", status: "Order Processed", location: "Delhi" },
      ],
    },
    delivery: {
      address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400053",
      recipient: "John Doe",
      phone: "+91 9876543210",
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      status: "Paid",
    },
  },
  {
    id: "OLY12348",
    date: "2023-07-05",
    total: 350,
    status: "processing",
    items: [
      {
        id: 5,
        name: "Oceane",
        price: 350,
        quantity: 1,
        size: "30ml",
        image: "/img/oceane50.png",
      },
    ],
    tracking: {
      number: null,
      carrier: null,
      events: [{ date: "2023-07-05 15:45", status: "Order Processed", location: "Delhi" }],
    },
    delivery: {
      address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400053",
      recipient: "John Doe",
      phone: "+91 9876543210",
    },
    payment: {
      method: "UPI",
      last4: "johndoe@upi",
      status: "Paid",
    },
  },
]

export default function MyOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  // Filter orders based on search query
  const searchedOrders = filteredOrders.filter((order) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return order.id.toLowerCase().includes(query) || order.items.some((item) => item.name.toLowerCase().includes(query))
  })

  // Sort orders
  const sortedOrders = [...searchedOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    if (sortBy === "newest") {
      return dateB - dateA
    } else if (sortBy === "oldest") {
      return dateA - dateB
    } else if (sortBy === "price-high") {
      return b.total - a.total
    } else if (sortBy === "price-low") {
      return a.total - b.total
    }

    return 0
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>
      case "processing":
        return <Badge className="bg-amber-500">Processing</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_transit":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "processing":
        return <Package className="h-5 w-5 text-amber-500" />
      case "cancelled":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  // View order details
  const viewOrderDetails = (orderId: string) => {
    setSelectedOrder(orderId)
  }

  // Track order
  const trackOrder = (orderId: string) => {
    router.push(`/track-order/${orderId}`)
  }

  // Get selected order
  const getSelectedOrder = () => {
    return orders.find((order) => order.id === selectedOrder)
  }

  return (
    <>
      <Navbar setIsCartOpen={() => {}} />
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
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                        selectedOrder === order.id ? "border-2 border-accent" : ""
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div className="flex items-center mb-2 md:mb-0">
                            {getStatusIcon(order.status)}
                            <div className="ml-3">
                              <h3 className="font-bold">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {getStatusBadge(order.status)}
                            <span className="mx-4 text-gray-300 dark:text-gray-600">|</span>
                            <span className="font-bold">₹{order.total}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          {order.items.slice(0, 4).map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.size} × {item.quantity}
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
                                <p className="text-gray-700 dark:text-gray-300">{order.delivery.recipient}</p>
                                <p className="text-gray-700 dark:text-gray-300">{order.delivery.address}</p>
                                <p className="text-gray-700 dark:text-gray-300">{order.delivery.phone}</p>
                              </div>

                              <div>
                                <h4 className="font-bold mb-2">Payment Information</h4>
                                <p className="text-gray-700 dark:text-gray-300">Method: {order.payment.method}</p>
                                {order.payment.method === "Credit Card" && (
                                  <p className="text-gray-700 dark:text-gray-300">
                                    Card ending in {order.payment.last4}
                                  </p>
                                )}
                                {order.payment.method === "UPI" && (
                                  <p className="text-gray-700 dark:text-gray-300">UPI ID: {order.payment.last4}</p>
                                )}
                                <p className="text-gray-700 dark:text-gray-300">Status: {order.payment.status}</p>
                              </div>

                              <div>
                                <h4 className="font-bold mb-2">Order Summary</h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span>₹{order.total - 99}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                                    <span>₹99</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>₹{order.total}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            <h4 className="font-bold mb-4">Tracking Information</h4>
                            {order.tracking.number ? (
                              <div>
                                <div className="flex justify-between items-center mb-4">
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400">Tracking Number:</p>
                                    <p className="font-medium">{order.tracking.number}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400">Carrier:</p>
                                    <p className="font-medium">{order.tracking.carrier}</p>
                                  </div>
                                  <Button variant="outline" onClick={() => trackOrder(order.id)}>
                                    View Detailed Tracking
                                  </Button>
                                </div>

                                <div className="relative">
                                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                                  <div className="space-y-6">
                                    {order.tracking.events.slice(0, 3).map((event, index) => (
                                      <div key={index} className="flex">
                                        <div
                                          className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                                            index === 0 ? "bg-accent text-white" : "bg-gray-200 dark:bg-gray-700"
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

                                {order.tracking.events.length > 3 && (
                                  <Button variant="link" className="mt-4" onClick={() => trackOrder(order.id)}>
                                    View All {order.tracking.events.length} Updates
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-600 dark:text-gray-400">
                                Tracking information will be available once your order ships.
                              </p>
                            )}
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
