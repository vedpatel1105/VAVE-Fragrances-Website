"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, Package, Truck, CheckCircle, Clock, AlertCircle, Mail, Phone, MessageCircle, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { orderService, Order } from "@/src/lib/orderService"
import { adminService, type User } from "@/src/lib/adminService"
import { formatCurrency } from "@/lib/utils"
import AdminNavbar from "@/src/app/components/AdminNavbar"

export default function AdminOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isFulfillmentDialogOpen, setIsFulfillmentDialogOpen] = useState(false)
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>('pending')
  const [newFulfillment, setNewFulfillment] = useState<'processing' | 'shipped' | 'delivered' | 'cancelled'>('processing')
  const [statusNotes, setStatusNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is admin and load orders
  useEffect(() => {
    const checkAdminAndLoadOrders = async () => {
      try {
        const isAdmin = await adminService.isAdmin()
        const isViewer = await adminService.isViewer()

        if (isViewer && !isAdmin) {
          router.push('/admin/analytics')
          return
        }

        if (!isAdmin) {
          router.push('/admin')
          return
        }
        await loadOrders()
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.push('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAndLoadOrders()
  }, [router])

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      })
    }
  }

  // Local search and filter
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) return false

    // Price filter
    if (priceFilter !== "all") {
      const price = order.total_amount
      switch (priceFilter) {
        case "under500":
          if (price >= 500) return false
          break
        case "500to1000":
          if (price < 500 || price >= 1000) return false
          break
        case "over1000":
          if (price < 1000) return false
          break
      }
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const hasMatchingItem = order.items.some(item => 
        item.name.toLowerCase().includes(query)
      )
      if (!hasMatchingItem) return false
    }

    return true
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  // Update order status
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return

    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus as "pending" | "paid" | "failed", statusNotes)
      await loadOrders()
      setIsStatusDialogOpen(false)
      toast({
        title: "Success",
        description: "Order status updated successfully"
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      })
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getFulfillmentBadge = (status?: string | null) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>
      case 'shipped':
        return <Badge className="bg-indigo-500">Shipped</Badge>
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">N/A</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const handleOpenUserInfo = async (order: Order) => {
    setSelectedOrder(order)
    setIsUserInfoDialogOpen(true)
    setIsLoadingUser(true)
    try {
      const userDetails = await adminService.getUserDetails(order.user_id)
      setSelectedUser(userDetails)
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast({
        title: "Error",
        description: "Failed to load user information",
        variant: "destructive"
      })
    } finally {
      setIsLoadingUser(false)
    }
  }

  const handleShippingAddress = (address: string | object) => {
    try {
      return JSON.parse(address as string)
    } catch (error) {
      return address
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="container mx-auto py-8 px-4 pt-24">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Order Management</h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500to1000">₹500 - ₹1000</option>
                  <option value="over1000">Over ₹1000</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sortedOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex items-center mb-2 md:mb-0">
                      {getStatusIcon(order.status)}
                      <div className="ml-3">
                        <h3 className="font-bold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        {getFulfillmentBadge(order.fulfillment_status as any)}
                      </div>
                      <span className="font-bold">{formatCurrency(order.total_amount)}</span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setNewStatus(order.status)
                          setIsStatusDialogOpen(true)
                        }}
                      >
                        Update Status
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setNewFulfillment((order.fulfillment_status as any) || 'processing')
                          setIsFulfillmentDialogOpen(true)
                        }}
                      >
                        Update Fulfillment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleOpenUserInfo(order)
                        }}
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        User Info
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-bold mb-3">Order Items</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500">{item.size}ml</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-gray-500">Quantity</span>
                              <span className="font-medium">{item.quantity}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Unit Price</span>
                              <span className="font-medium">{formatCurrency(item.price)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Line Total</span>
                              <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Payment */}
                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                        <h4 className="font-bold mb-3">Pricing Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">{formatCurrency((order as any).subtotal_amount ?? (order.total_amount - ((order as any).shipping_amount ?? 0)))}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Shipping</span>
                            <span className="font-medium">{typeof (order as any).shipping_amount === 'number' ? formatCurrency((order as any).shipping_amount) : 'Included'}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">GST is included in product prices</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                        <h4 className="font-bold mb-3">Payment Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Method</span>
                            <span className="font-medium uppercase">{order.payment_method}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-medium">{order.status}</span>
                          </div>
                          {order.razorpay_order_id && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Razorpay Order ID</span>
                              <span className="font-mono text-xs break-all ml-2">{order.razorpay_order_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address KV layout */}
                  <div className="mt-6">
                    <h4 className="font-bold mb-3">Shipping Address</h4>
                    {(() => {
                      let addr: any = order.shipping_address
                      try { addr = typeof addr === 'string' ? JSON.parse(addr) : addr } catch {}
                      const entries = Object.entries(addr || {}) as Array<[string, any]>;
                      if (!entries.length) return <p className="text-gray-600 dark:text-gray-400">No address</p>
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {entries.map(([key, value]) => (
                            <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
                              <p className="text-xs uppercase tracking-wider text-gray-500">{key.replace(/_/g, ' ')}</p>
                              <p className="font-medium break-words mt-1">{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status of order #{selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={(value: string) => setNewStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Input
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status change"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fulfillment Update Dialog */}
        <Dialog open={isFulfillmentDialogOpen} onOpenChange={setIsFulfillmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Fulfillment Status</DialogTitle>
              <DialogDescription>
                Change the fulfillment status of order #{selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Fulfillment Status</label>
                <Select value={newFulfillment} onValueChange={(value: any) => setNewFulfillment(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFulfillmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={async () => {
                if (!selectedOrder) return
                try {
                  await orderService.updateFulfillmentStatus(selectedOrder.id, newFulfillment)
                  await loadOrders()
                  setIsFulfillmentDialogOpen(false)
                  toast({ title: 'Success', description: 'Fulfillment status updated successfully' })
                } catch (error) {
                  console.error(error)
                  toast({ title: 'Error', description: 'Failed to update fulfillment status', variant: 'destructive' })
                }
              }}>
                Update Fulfillment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Info Dialog */}
        <Dialog open={isUserInfoDialogOpen} onOpenChange={setIsUserInfoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Information</DialogTitle>
              <DialogDescription>
                Contact information for order #{selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {isLoadingUser ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : selectedUser ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedUser.email}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => window.location.href = `mailto:${selectedUser.email}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                      {selectedUser.full_name && (
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span>{selectedUser.full_name}</span>
                        </div>
                      )}
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedUser.phone}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => window.location.href = `tel:${selectedUser.phone}`}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`https://wa.me/${selectedUser.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Shipping Address</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedOrder?.shipping_address}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  No user information available
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserInfoDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 