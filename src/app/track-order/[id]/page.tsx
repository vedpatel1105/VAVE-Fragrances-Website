"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, ArrowLeft, Share2 } from "lucide-react"
import dynamic from "next/dynamic"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/src/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  ),
})

// Mock order data - in a real app, this would come from an API
const orders = {
  OLY12345: {
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
        { date: "2023-06-15 18:30", status: "Delivered", location: "Mumbai", coordinates: [19.076, 72.8777] },
        { date: "2023-06-15 09:45", status: "Out for Delivery", location: "Mumbai", coordinates: [19.076, 72.8777] },
        {
          date: "2023-06-14 20:15",
          status: "Arrived at Destination",
          location: "Mumbai",
          coordinates: [19.076, 72.8777],
        },
        { date: "2023-06-13 14:20", status: "In Transit", location: "Delhi", coordinates: [28.7041, 77.1025] },
        { date: "2023-06-12 10:30", status: "Shipped", location: "Delhi", coordinates: [28.7041, 77.1025] },
        { date: "2023-06-11 16:45", status: "Order Processed", location: "Delhi", coordinates: [28.7041, 77.1025] },
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
    estimatedDelivery: "2023-06-15",
  },
  OLY12346: {
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
        { date: "2023-06-01 17:15", status: "Delivered", location: "Mumbai", coordinates: [19.076, 72.8777] },
        { date: "2023-06-01 08:30", status: "Out for Delivery", location: "Mumbai", coordinates: [19.076, 72.8777] },
        {
          date: "2023-05-31 19:45",
          status: "Arrived at Destination",
          location: "Mumbai",
          coordinates: [19.076, 72.8777],
        },
        { date: "2023-05-30 13:20", status: "In Transit", location: "Delhi", coordinates: [28.7041, 77.1025] },
        { date: "2023-05-29 09:30", status: "Shipped", location: "Delhi", coordinates: [28.7041, 77.1025] },
        { date: "2023-05-28 15:45", status: "Order Processed", location: "Delhi", coordinates: [28.7041, 77.1025] },
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
    estimatedDelivery: "2023-06-01",
  },
  OLY12347: {
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
        { date: "2023-07-04 13:20", status: "In Transit", location: "Delhi", coordinates: [28.7041, 77.1025] },
        { date: "2023-07-03 09:30", status: "Shipped", location: "Delhi", coordinates: [28.7041, 77.1025] },
        { date: "2023-07-02 15:45", status: "Order Processed", location: "Delhi", coordinates: [28.7041, 77.1025] },
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
    estimatedDelivery: "2023-07-07",
  },
  OLY12348: {
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
      events: [
        { date: "2023-07-05 15:45", status: "Order Processed", location: "Delhi", coordinates: [28.7041, 77.1025] },
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
    estimatedDelivery: "2023-07-10",
  },
}

export default function TrackOrderPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrder = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const orderId = params.id as string
          const orderData = orders[orderId]

          if (orderData) {
            setOrder(orderData)
            setCurrentEvent(orderData.tracking.events[0])
          } else {
            setError("Order not found. Please check the order ID and try again.")
          }
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Failed to load order details. Please try again later.")
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-500"
      case "out for delivery":
        return "text-blue-500"
      case "in transit":
        return "text-amber-500"
      case "shipped":
        return "text-purple-500"
      case "order processed":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "out for delivery":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "in transit":
        return <Truck className="h-6 w-6 text-amber-500" />
      case "shipped":
        return <Package className="h-6 w-6 text-purple-500" />
      case "order processed":
        return <Package className="h-6 w-6 text-gray-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  // Calculate delivery progress percentage
  const calculateProgress = () => {
    if (!order) return 0

    const totalEvents = order.tracking.events.length
    const completedEvents = order.tracking.events.findIndex((e) => e.status.toLowerCase() === "delivered")

    if (completedEvents >= 0) {
      return 100
    } else {
      // Calculate based on number of events completed
      return Math.min(Math.round(((totalEvents - 1) / 5) * 100), 80)
    }
  }

  // Share tracking info
  const shareTracking = async () => {
    if (!order) return

    const shareData = {
      title: `Order Tracking - ${order.id}`,
      text: `Track my Vave order: ${order.id}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert("Tracking link copied to clipboard!")
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar setIsCartOpen={() => {}} />
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-lg">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar setIsCartOpen={() => {}} />
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center justify-center min-h-[30vh]">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{error}</p>
              <Button onClick={() => router.push("/my-orders")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Orders
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!order) {
    return null
  }

  return (
    <>
      <Navbar setIsCartOpen={() => {}} />
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Track Order</h1>
              <p className="text-gray-600 dark:text-gray-400">Order #{order.id}</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button variant="outline" onClick={shareTracking}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={() => router.push("/my-orders")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Orders
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
            {/* Order Status Banner */}
            <div
              className={`p-6 ${
                order.status === "delivered"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : order.status === "in_transit"
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-amber-50 dark:bg-amber-900/20"
              }`}
            >
              <div className="flex items-center">
                {getStatusIcon(order.tracking.events[0].status)}
                <div className="ml-4">
                  <h2 className="text-xl font-bold">
                    {order.status === "delivered"
                      ? "Your order has been delivered"
                      : order.status === "in_transit"
                        ? "Your order is on the way"
                        : "Your order is being processed"}
                  </h2>
                  <p className={`${getStatusColor(order.tracking.events[0].status)}`}>
                    {order.tracking.events[0].status} • {new Date(order.tracking.events[0].date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Progress */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Delivery Progress</h3>

              <div className="mb-2 flex justify-between text-sm">
                <span>Order Placed</span>
                <span>Delivered</span>
              </div>

              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                <div className="h-full bg-accent rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Order Date: {new Date(order.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>
                    {order.status === "delivered"
                      ? `Delivered on: ${new Date(order.tracking.events[0].date).toLocaleDateString()}`
                      : `Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Details */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold mb-4">Tracking Details</h3>

                {order.tracking.number ? (
                  <div className="mb-4 flex flex-wrap gap-y-2">
                    <div className="w-full sm:w-1/2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number:</p>
                      <p className="font-medium">{order.tracking.number}</p>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Carrier:</p>
                      <p className="font-medium">{order.tracking.carrier}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    Tracking information will be available once your order ships.
                  </p>
                )}

                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div className="space-y-8">
                    {order.tracking.events.map((event, index) => (
                      <div key={index} className="flex" onClick={() => setCurrentEvent(event)}>
                        <div
                          className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                            index === 0 ? "bg-accent text-white" : "bg-gray-200 dark:bg-gray-700"
                          } mr-4 cursor-pointer`}
                        >
                          {index === 0 ? (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                          )}
                        </div>
                        <div
                          className={`${
                            currentEvent === event ? "bg-gray-50 dark:bg-gray-700/50 -mx-4 px-4 py-2 rounded-lg" : ""
                          } flex-grow cursor-pointer transition-colors duration-200`}
                        >
                          <p className={`font-medium ${getStatusColor(event.status)}`}>{event.status}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(event.date).toLocaleString()}
                          </p>
                          <p className="text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Current Location</h3>
                <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {currentEvent && (
                    <MapWithNoSSR
                      location={`${currentEvent.status} - ${currentEvent.location}`}
                      coordinates={currentEvent.coordinates}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Order Details</h3>

              <div className="space-y-4">
                {order.items.map((item, index) => (
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
                    <div className="ml-4 flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.size} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                  <span>{formatCurrency(order.total - 99)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
                  <span>{formatCurrency(99)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2">Shipping Address</h4>
                <p>{order.delivery.recipient}</p>
                <p>{order.delivery.address}</p>
                <p>{order.delivery.phone}</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Payment Method</h4>
                <p>{order.payment.method}</p>
                {order.payment.method === "Credit Card" && <p>Card ending in {order.payment.last4}</p>}
                {order.payment.method === "UPI" && <p>UPI ID: {order.payment.last4}</p>}
                <p>Status: {order.payment.status}</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
