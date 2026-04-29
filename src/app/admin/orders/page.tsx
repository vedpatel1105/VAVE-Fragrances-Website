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
import { useAuthStore } from "@/src/lib/auth"
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
        const user = useAuthStore.getState().user
        const isAdmin = await adminService.isAdmin(user)
        const isViewer = await adminService.isViewer(user)

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

  // Export CSV function
  const exportToCSV = () => {
    if (!orders.length) {
      toast({ title: "No data", description: "There are no orders to export.", variant: "destructive" })
      return
    }

    const headers = ["Order ID", "Date", "Status", "Fulfillment", "Total Amount", "Items", "Payment Method"]
    const rows = sortedOrders.map(o => [
      o.id,
      new Date(o.created_at).toLocaleString(),
      o.status,
      o.fulfillment_status || 'N/A',
      o.total_amount,
      o.items.map(i => `${i.name} (${i.quantity}x)`).join("; "),
      o.payment_method
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `vave_orders_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <AdminNavbar />
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin opacity-50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-6 pt-32 pb-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div>
              <h1 className="text-4xl font-serif mb-2 tracking-tight">Order Ledger</h1>
              <p className="text-zinc-500 font-light text-sm">Exclusive view of recent boutique transactions.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 min-w-[250px]">
                <Input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-zinc-900/50 border-white/5 rounded-xl text-white placeholder:text-zinc-600 focus:ring-gold/30"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 h-12 border border-white/5 rounded-xl bg-zinc-900/50 text-sm focus:ring-gold/30 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-4 py-3 h-12 border border-white/5 rounded-xl bg-zinc-900/50 text-sm focus:ring-gold/30 outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500to1000">₹500 - ₹1000</option>
                  <option value="over1000">Over ₹1000</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 h-12 border border-white/5 rounded-xl bg-zinc-900/50 text-sm focus:ring-gold/30 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                <Button 
                  onClick={exportToCSV}
                  className="h-12 px-6 bg-white text-black font-bold rounded-xl hover:bg-gold hover:text-dark transition-colors"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sortedOrders.length === 0 ? (
               <div className="text-center py-20 bg-zinc-900/20 border border-white/5 rounded-[2rem]">
                 <Package className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                 <h3 className="text-xl font-serif text-white">No Orders Found</h3>
                 <p className="text-zinc-500 mt-2 text-sm">Your ledger is currently empty for these filters.</p>
               </div>
            ) : sortedOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all rounded-3xl overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 border-b border-white/5 pb-8">
                    <div className="flex items-center">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-gold/20 transition-colors">
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-mono text-sm tracking-widest text-gold mb-1">#{order.id.slice(0,8).toUpperCase()}</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        {getFulfillmentBadge(order.fulfillment_status as any)}
                      </div>
                      <span className="font-serif text-2xl mx-4">{formatCurrency(order.total_amount)}</span>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-white/5 text-zinc-400 hover:text-white"
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus(order.status)
                            setIsStatusDialogOpen(true)
                          }}
                        >
                          Status
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-white/5 text-zinc-400 hover:text-white"
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewFulfillment((order.fulfillment_status as any) || 'processing')
                            setIsFulfillmentDialogOpen(true)
                          }}
                        >
                          Logistics
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-white/5 text-zinc-400 hover:text-white"
                          onClick={() => handleOpenUserInfo(order)}
                        >
                          <UserIcon className="h-4 w-4 mr-2" /> Client
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Collection Details</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                            <div>
                               <span className="font-serif text-lg">{item.name}</span>
                               <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{item.size} • Qty {item.quantity}</p>
                            </div>
                            <div className="text-right">
                               <span className="font-medium text-white">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address KV layout */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Destination</h4>
                        {(() => {
                          let addr: any = order.shipping_address
                          try { addr = typeof addr === 'string' ? JSON.parse(addr) : addr } catch {}
                          const entries = Object.entries(addr || {}) as Array<[string, any]>;
                          if (!entries.length) return <p className="text-zinc-600 text-sm italic">No address provided</p>
                          return (
                            <div className="p-5 bg-black/20 border border-white/5 rounded-2xl space-y-3">
                              {entries.map(([key, value]) => (
                                <div key={key}>
                                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">{key.replace(/_/g, ' ')}</p>
                                  <p className="font-medium text-sm text-zinc-300">{String(value)}</p>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                      
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Transaction Ref</p>
                          <p className="font-mono text-xs text-zinc-300 break-all">{order.razorpay_order_id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dialogs updated for dark theme */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Update Status</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Change the status of order #{selectedOrder?.id.slice(0,8)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">New Status</label>
                <Select value={newStatus} onValueChange={(value: string) => setNewStatus(value as any)}>
                  <SelectTrigger className="bg-zinc-900 border-white/10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Notes (Optional)</label>
                <Input
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Internal notes..."
                  className="bg-zinc-900 border-white/10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
              <Button className="bg-white text-black hover:bg-white/90" onClick={handleStatusUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fulfillment Dialog */}
        <Dialog open={isFulfillmentDialogOpen} onOpenChange={setIsFulfillmentDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Logistics Detail</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Update tracking for #{selectedOrder?.id.slice(0,8)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current State</label>
                <Select value={newFulfillment} onValueChange={(value: any) => setNewFulfillment(value)}>
                  <SelectTrigger className="bg-zinc-900 border-white/10">
                    <SelectValue placeholder="Select tracking status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => setIsFulfillmentDialogOpen(false)}>Close</Button>
               <Button className="bg-white text-black hover:bg-white/90" onClick={async () => {
                if (!selectedOrder) return
                try {
                  await orderService.updateFulfillmentStatus(selectedOrder.id, newFulfillment)
                  await loadOrders()
                  setIsFulfillmentDialogOpen(false)
                  toast({ title: 'Success', description: 'Logistics updated' })
                } catch (error) {
                  toast({ title: 'Error', description: 'Failed to update logistics', variant: 'destructive' })
                }
              }}>Confirm Dispatch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Info Dialog */}
        <Dialog open={isUserInfoDialogOpen} onOpenChange={setIsUserInfoDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Client Profile</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Contact information for this order.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {isLoadingUser ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : selectedUser ? (
                <div className="space-y-6">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4 text-zinc-300 pointer-events-none">
                            <UserIcon className="h-4 w-4 text-zinc-500" />
                            <span>{selectedUser.full_name || 'No Name Provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-zinc-300">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <span>{selectedUser.email}</span>
                            <Button variant="outline" size="sm" className="ml-auto border-white/10 h-7 text-xs bg-transparent hover:bg-white/5" onClick={() => window.location.href = `mailto:${selectedUser.email}`}>
                                Email
                            </Button>
                        </div>
                        {selectedUser.phone && (
                          <div className="flex items-center gap-3 text-zinc-300">
                              <Phone className="h-4 w-4 text-zinc-500" />
                              <span>{selectedUser.phone}</span>
                              <div className="ml-auto flex gap-2">
                                <Button variant="outline" size="sm" className="border-white/10 h-7 text-xs bg-transparent hover:bg-white/5" onClick={() => window.location.href = `tel:${selectedUser.phone}`}>
                                    Call
                                </Button>
                                <Button variant="outline" size="sm" className="border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 h-7 text-xs bg-transparent" onClick={() => window.open(`https://wa.me/${selectedUser.phone?.replace(/[^0-9]/g, '')}`, '_blank')}>
                                    WhatsApp
                                </Button>
                              </div>
                          </div>
                        )}
                    </div>
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-8">
                  Client information no longer available
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 w-full" onClick={() => setIsUserInfoDialogOpen(false)}>Close Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}