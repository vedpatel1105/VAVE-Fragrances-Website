"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, ArrowLeft, Share2, Loader2 } from "lucide-react"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { getSupabaseClient } from "@/src/lib/supabaseClient"
import { useAuthStore } from "@/src/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import SimpleNavbar from "../../components/SimpleNavbar"


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

interface TrackingEvent {
  date: string;
  status: string;
  location: string;
}

interface TrackingInfo {
  number: string | null;
  carrier: string | null;
  events: TrackingEvent[];
}

export default function TrackOrderPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentEvent, setCurrentEvent] = useState<TrackingEvent | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (isLoading) return;
      
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const orderId = params.id as string;
        
        if (!orderId) {
          setError("Order ID not found");
          setLoading(false);
          return;
        }

        const client = getSupabaseClient();
        const { data, error } = await client
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError("Order not found or you don't have permission to view this order");
          } else {
            throw error;
          }
          setLoading(false);
          return;
        }

        setOrder(data);
        
        const trackingInfo = getTrackingInfo(data);
        if (trackingInfo.events.length > 0) {
          setCurrentEvent(trackingInfo.events[0]);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, user, isAuthenticated, isLoading, router]);

  const getTrackingInfo = (order: Order): TrackingInfo => {
    const baseEvents: TrackingEvent[] = [
      {
        date: order.created_at,
        status: "Order Placed",
          location: getCityFromOrder(order)
      }
    ];

    switch (order.status) {
      case 'paid':
        baseEvents.push({
          date: new Date(new Date(order.created_at).getTime() + 2 * 60 * 60 * 1000).toISOString(),
          status: "Payment Confirmed",
          location: getCityFromOrder(order)
        });
        break;
      case 'shipped':
        baseEvents.push(
          {
            date: new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            status: "Payment Confirmed",
            location: getCityFromOrder(order)
          },
          {
            date: new Date(new Date(order.created_at).getTime() + 48 * 60 * 60 * 1000).toISOString(),
            status: "Shipped",
            location: getCityFromOrder(order)
          }
        );
        break;
      case 'delivered':
        baseEvents.push(
          {
            date: new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            status: "Payment Confirmed",
            location: getCityFromOrder(order)
          },
          {
            date: new Date(new Date(order.created_at).getTime() + 48 * 60 * 60 * 1000).toISOString(),
            status: "Shipped",
            location: getCityFromOrder(order)
          },
          {
            date: new Date(new Date(order.created_at).getTime() + 72 * 60 * 60 * 1000).toISOString(),
            status: "Out for Delivery",
            location: getCityFromOrder(order)
          },
          {
            date: new Date(new Date(order.created_at).getTime() + 96 * 60 * 60 * 1000).toISOString(),
            status: "Delivered",
            location: getCityFromOrder(order)
          }
        );
        break;
    }

    return {
      number: order.status === 'shipped' || order.status === 'delivered' ? `BD${order.id.slice(-9)}` : null,
      carrier: order.status === 'shipped' || order.status === 'delivered' ? 'BlueDart' : null,
      events: baseEvents.reverse()
    };
  };

  const getCityFromOrder = (order: Order): string => {
    try {
      const addr = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address as any;
      return addr?.city || 'N/A';
    } catch {
      return 'N/A';
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-500"
      case "out for delivery":
        return "text-blue-500"
      case "shipped":
        return "text-purple-500"
      case "payment confirmed":
        return "text-green-600"
      case "order placed":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "out for delivery":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "shipped":
        return <Package className="h-6 w-6 text-purple-500" />
      case "payment confirmed":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "order placed":
        return <Package className="h-6 w-6 text-gray-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  const calculateProgress = () => {
    if (!order) return 0

    const trackingInfo = getTrackingInfo(order);
    const totalEvents = trackingInfo.events.length;
    const completedEvents = trackingInfo.events.findIndex((e) => e.status.toLowerCase() === "delivered");

    if (completedEvents >= 0) {
      return 100;
    } else {
      switch (order.status) {
        case 'paid':
          return 25;
        case 'shipped':
          return 75;
        case 'delivered':
          return 100;
        default:
          return 10;
      }
    }
  }

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
        await navigator.clipboard.writeText(window.location.href)
        alert("Tracking link copied to clipboard!")
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  if (isLoading || loading) {
    return (
      <>
        <Navbar setIsCartOpen={() => {}} />
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-16 w-16 animate-spin mb-4" />
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
      <SimpleNavbar />
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
            <div
              className={`p-6 ${
                order.status === "delivered"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : order.status === "shipped"
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-amber-50 dark:bg-amber-900/20"
              }`}
            >
              <div className="flex items-center">
                {(() => {
                  const trackingInfo = getTrackingInfo(order);
                  const latestEvent = trackingInfo.events[0];
                  return getStatusIcon(latestEvent.status);
                })()}
                <div className="ml-4">
                  <h2 className="text-xl font-bold">
                    {order.status === "delivered"
                      ? "Your order has been delivered"
                      : order.status === "shipped"
                        ? "Your order is on the way"
                        : "Your order is being processed"}
                  </h2>
                  <p className={`${(() => {
                    const trackingInfo = getTrackingInfo(order);
                    const latestEvent = trackingInfo.events[0];
                    return getStatusColor(latestEvent.status);
                  })()}`}>
                    {(() => {
                      const trackingInfo = getTrackingInfo(order);
                      const latestEvent = trackingInfo.events[0];
                      return `${latestEvent.status} • ${new Date(latestEvent.date).toLocaleString()}`;
                    })()}
                  </p>
                </div>
              </div>
            </div>

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
                  <span>Order Date: {new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>
                    {order.status === "delivered"
                      ? `Delivered on: ${(() => {
                          const trackingInfo = getTrackingInfo(order);
                          const deliveredEvent = trackingInfo.events.find(e => e.status === "Delivered");
                          return deliveredEvent ? new Date(deliveredEvent.date).toLocaleDateString() : "N/A";
                        })()}`
                      : `Estimated Delivery: ${new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold mb-4">Tracking Details</h3>

                {(() => {
                  const trackingInfo = getTrackingInfo(order);
                  return trackingInfo.number ? (
                    <div className="mb-4 flex flex-wrap gap-y-2">
                      <div className="w-full sm:w-1/2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number:</p>
                        <p className="font-medium">{trackingInfo.number}</p>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Carrier:</p>
                        <p className="font-medium">{trackingInfo.carrier}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                      Tracking information will be available once your order ships.
                    </p>
                  );
                })()}

                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div className="space-y-8">
                    {(() => {
                      const trackingInfo = getTrackingInfo(order);
                      return trackingInfo.events.map((event, index) => (
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
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                        {item.size}ml × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                  <span>₹{typeof order.subtotal_amount === 'number' ? order.subtotal_amount : (order.total_amount - (order.shipping_amount ?? 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
                  <span>{typeof order.shipping_amount === 'number' ? `₹${order.shipping_amount}` : 'Included'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2">Shipping Address</h4>
                {(() => {
                  const shippingAddress = typeof order.shipping_address === 'string' 
                    ? JSON.parse(order.shipping_address) 
                    : order.shipping_address;
                  return (
                    <>
                      <p>{shippingAddress.name}</p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                      <p>{shippingAddress.phone}</p>
                    </>
                  );
                })()}
              </div>

              <div>
                <h4 className="font-bold mb-2">Payment Method</h4>
                <p>{order.payment_method}</p>
                <p>Status: {order.status === 'paid' ? 'Paid' : 'Pending'}</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Button variant="outline" className="w-full"
                  onClick={() => router.push("/contact")}
                >
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
