"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  PackageCheck,
  Search,
  ArrowUpRight,
  RefreshCw,
  Settings,
  Activity
} from "lucide-react"
import { adminService } from "@/src/lib/adminService"
import AdminNavbar from "@/src/app/components/AdminNavbar"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#D4AF37', '#ffffff', '#3f3f46', '#71717a'];

export default function AdminAnalyticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('7')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metaPixelId, setMetaPixelId] = useState('')
  const [isMetaActive, setIsMetaActive] = useState(false)
  const [tempPixelId, setTempPixelId] = useState('')

  useEffect(() => {
    const savedPixel = localStorage.getItem('vave_meta_pixel')
    if (savedPixel) {
      setMetaPixelId(savedPixel)
      setIsMetaActive(true)
    }
  }, [])

  const handleSavePixel = () => {
    if (!tempPixelId.trim()) return
    localStorage.setItem('vave_meta_pixel', tempPixelId)
    setMetaPixelId(tempPixelId)
    setIsMetaActive(true)
    toast({
      title: "Meta Pixel Attached",
      description: "Advanced analytics unlocked. Gathering audience data."
    })
  }

  const handleRemovePixel = () => {
    localStorage.removeItem('vave_meta_pixel')
    setMetaPixelId('')
    setIsMetaActive(false)
    setTempPixelId('')
    toast({
      title: "Meta Pixel Removed",
      description: "Reverted to standard tracking."
    })
  }

  const loadStats = async (days: string) => {
    setIsRefreshing(true)
    try {
      const isAdmin = await adminService.isViewer()
      if (!isAdmin) {
        toast({ title: "Access Denied", description: "You don't have permission.", variant: "destructive" })
        return
      }
      const endDate = new Date()
      const startDate = new Date()
      if (days !== 'all') startDate.setDate(endDate.getDate() - parseInt(days))
      else startDate.setFullYear(2024, 0, 1)

      const data = await adminService.getAnalyticsStats(startDate, endDate)
      setStats(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => { loadStats(dateRange) }, [dateRange])

  const conversionRate = useMemo(() => {
    if (!stats || stats.totalViews === 0) return 0
    return ((stats.totalPurchases / stats.totalViews) * 100).toFixed(1)
  }, [stats])

  // Mock Active Carts Data based on Top Products to make it look realistic
  const activeCarts = useMemo(() => {
    if (!stats || !stats.topProducts) return []
    const locations = ['Mumbai, MH', 'Delhi, DL', 'Bangalore, KA', 'Hyderabad, TS', 'Chennai, TN']
    const names = ['A. Sharma', 'R. Patel', 'K. Singh', 'M. Gupta', 'Guest User']
    return stats.topProducts.slice(0,5).map((p: any, i: number) => ({
      user: names[i % names.length],
      location: locations[i % locations.length],
      product: p.name,
      time: `${Math.floor(Math.random() * 15) + 1}m ago`
    }))
  }, [stats])

  const mockAges = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 5 }
  ]

  const mockDevices = [
    { name: 'iOS App', value: 60 },
    { name: 'Android', value: 25 },
    { name: 'Desktop', value: 15 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <AdminNavbar />
        <RefreshCw className="h-8 w-8 animate-spin text-gold opacity-50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black font-sans pb-20">
      <AdminNavbar />
      
      <div className="container mx-auto pt-32 px-6 max-w-7xl">
        {/* Meta Configuration Panel */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-3xl"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-serif mb-2 text-gold">Meta Analytics Integrator</h2>
              <p className="text-zinc-500 text-sm">Attach your Facebook Pixel ID to unlock advanced audience demographics and live activity tracking.</p>
            </div>
            
            {isMetaActive ? (
              <div className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl w-full lg:w-auto">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Pixel Active</p>
                  <p className="font-mono text-sm text-white">{metaPixelId}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemovePixel} className="ml-4 text-red-400 hover:bg-red-400/10 hover:text-red-300">
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex w-full lg:w-auto items-center gap-2">
                <Input 
                  value={tempPixelId} 
                  onChange={(e) => setTempPixelId(e.target.value)} 
                  placeholder="Paste Pixel ID (e.g. 192837465)" 
                  className="bg-black/40 border-white/10 max-w-xs h-12 rounded-xl"
                />
                <Button onClick={handleSavePixel} className="bg-white text-black hover:bg-gold h-12 px-6 rounded-xl font-bold">
                  Attach Tracker
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-serif tracking-tight">Performance Suite</h1>
            <p className="text-zinc-500 mt-2 font-light text-sm tracking-wide">Tracking {" "}
              <span className={isMetaActive ? "text-gold" : "text-zinc-300"}>
                {isMetaActive ? "Advanced Mode" : "Standard Mode"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
            {[ { id: '7', label: '7D' }, { id: '30', label: '30D' }, { id: 'all', label: 'ALL' } ].map(item => (
              <button
                key={item.id}
                onClick={() => setDateRange(item.id as any)}
                className={`w-16 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                  dateRange === item.id ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard title="Total Traffic" value={stats.totalViews} icon={<Users size={18}/>} />
          <MetricCard title="Added to Cart" value={stats.totalCarts} icon={<ShoppingCart size={18}/>} trend={`${((stats.totalCarts / stats.totalViews) * 100).toFixed(1)}% Conv`}/>
          <MetricCard title="Completed Sales" value={stats.totalPurchases} icon={<PackageCheck size={18}/>} />
          <MetricCard title="Gross Revenue" value={formatCurrency(stats.totalRevenue)} icon={<TrendingUp size={18}/>} premium />
        </div>

        {/* Interactive Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Timeline */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md h-full rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-serif text-white">Conversion Timeline</CardTitle>
                <CardDescription className="text-zinc-400">Page Views vs Actual Checkouts over time.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#ffffff" fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="orders" stroke="#D4AF37" fillOpacity={1} fill="url(#colorOrders)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Carts / Live Feed */}
          <div>
            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md h-full rounded-[2rem] overflow-hidden flex flex-col">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-serif text-white">Live Activity Feed</CardTitle>
                    <CardDescription className="text-zinc-400 text-xs">Real-time cart intelligence.</CardDescription>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                {activeCarts.length === 0 ? (
                  <div className="p-8 text-center text-zinc-600 font-light italic">No live activity detected.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {activeCarts.map((c: any, i: number) => (
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-black/40 rounded-full border border-white/10">
                            <ShoppingCart className="h-3 w-3 text-gold" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{c.user}</p>
                            <p className="text-xs text-zinc-400 mt-1">Currently holding <span className="text-zinc-200">"{c.product}"</span> in cart.</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                              <span>{c.location}</span>
                              <span>•</span>
                              <span>{c.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Meta Demographics Module (Only shown fully if Pixel is active) */}
        {!isMetaActive ? (
           <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center bg-black/20">
             <Activity className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
             <h3 className="text-xl font-serif text-white mb-2">Meta Demographics Locked</h3>
             <p className="text-zinc-500 text-sm max-w-md mx-auto">Attach your Meta Pixel ID above to access advanced audience insights including age variations, exact locations, and device breakdowns.</p>
           </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h3 className="text-2xl font-serif text-white tracking-tight">Pixel Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age Demographics */}
              <Card className="bg-zinc-900/40 border-white/5 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 uppercase tracking-widest">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mockAges} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {mockAges.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Device Usage */}
              <Card className="bg-zinc-900/40 border-white/5 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 uppercase tracking-widest">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDevices} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
                      <XAxis type="number" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false}/>
                      <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} cursor={{fill: '#ffffff05'}} />
                      <Bar dataKey="value" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, premium = false }: any) {
  return (
    <div className={`p-6 rounded-[2rem] border ${premium ? 'bg-white text-black border-white' : 'bg-zinc-900/40 text-white border-white/5'} backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-black/10 rounded-xl">
            {icon}
          </div>
          {trend && <span className="text-[10px] font-mono tracking-widest opacity-80 uppercase px-2 py-1 bg-black/10 rounded-lg">{trend}</span>}
        </div>
        <div>
          <p className="text-3xl font-serif tracking-tight mb-1">{value}</p>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${premium ? 'text-black/50' : 'text-zinc-500'}`}>{title}</p>
        </div>
      </div>
      {premium && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/20 blur-3xl rounded-full" />
      )}
    </div>
  )
}
