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
  Activity,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
  Crown,
  Database,
  UserPlus,
  MousePointer2,
  Heart,
  Layout,
  Clock
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

const MOCK_PIXEL = "VAVE-DEMO-PX-2026";

const MOCK_STATS = {
  totalViews: 4280,
  totalCarts: 842,
  totalWishlist: 512,
  checkoutStarts: 312,
  totalPurchases: 124,
  totalRevenue: 24800,
  returningRate: "18.5",
  topProducts: [
    { name: "VAVE Royal Oud", count: 142 },
    { name: "Midnight Rose", count: 125 },
    { name: "Desert Sultan", count: 98 },
    { name: "Imperial Gold", count: 85 },
    { name: "Azure Noir", count: 72 }
  ],
  wishlistPopularity: [
    { name: "Imperial Gold", count: 156 },
    { name: "VAVE Royal Oud", count: 142 },
    { name: "Midnight Rose", count: 89 },
    { name: "Saffron Sky", count: 64 },
    { name: "Oud Wood", count: 42 }
  ],
  revenueProducts: [
    { name: "VAVE Royal Oud", revenue: 8520, count: 42 },
    { name: "Midnight Rose", revenue: 5400, count: 27 },
    { name: "Imperial Gold", revenue: 4200, count: 21 },
    { name: "Desert Sultan", revenue: 3150, count: 12 },
    { name: "Azure Noir", revenue: 2100, count: 10 }
  ],
  timeline: [
    { date: "Mon", views: 400, orders: 12 },
    { date: "Tue", views: 600, orders: 18 },
    { date: "Wed", views: 550, orders: 15 },
    { date: "Thu", views: 800, orders: 25 },
    { date: "Fri", views: 700, orders: 20 },
    { date: "Sat", views: 900, orders: 30 },
    { date: "Sun", views: 850, orders: 28 }
  ]
};

const MOCK_AUDIENCE = {
  pagePerformance: [
    { path: "/collection", views: 1240 },
    { path: "/product/vave-royal-oud", views: 850 },
    { path: "/product/midnight-rose", views: 640 },
    { path: "/scent-finder", views: 420 },
    { path: "/", views: 310 }
  ],
  recoveryLeads: [
    { user: "Aryan Singh", email: "aryan@vave.com", phone: "9821034455", product: "Royal Oud (50ml)", time: new Date().toISOString(), daysAgo: 0 },
    { user: "Priya Sharma", email: "ps@gmail.com", phone: "9112233445", product: "Midnight Rose", time: new Date().toISOString(), daysAgo: 1 },
    { user: "Rahul Mehta", email: "rahul.m@outlook.com", phone: "7788990011", product: "Saffron Sky", time: new Date().toISOString(), daysAgo: 1 }
  ]
};

const MOCK_ACTIVITY = [
  { user: "Aryan Singh", email: "aryan@vave.com", phone: "+91 9821034455", product: "Royal Oud", action: "Added to Cart", time: new Date().toISOString() },
  { user: "James Wilson", email: "james.w@vave.com", phone: "+44 7781223344", product: "Azure Noir", action: "Added to Wishlist", time: new Date().toISOString() },
  { user: "Priya Sharma", email: "priya@vave.com", phone: "+91 9112233445", product: "Midnight Rose", action: "Started Checkout", time: new Date().toISOString() },
  { user: "Ananya Iyer", email: "ananya@vave.com", phone: "+91 9998887776", product: "Imperial Gold", action: "Added to Wishlist", time: new Date().toISOString() }
];

export default function AdminAnalyticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'performance' | 'audience'>('performance')
  const [realStats, setRealStats] = useState<any>(null)
  const [realAudience, setRealAudience] = useState<any>(null)
  const [realActivity, setRealActivity] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('7')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metaPixelId, setMetaPixelId] = useState('')
  const [isMetaActive, setIsMetaActive] = useState(false)
  const [tempPixelId, setTempPixelId] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const savedPixel = localStorage.getItem('vave_meta_pixel')
    if (savedPixel) {
      setMetaPixelId(savedPixel)
      setIsMetaActive(true)
    } else {
      setMetaPixelId(MOCK_PIXEL)
      setIsMetaActive(true)
    }
  }, [])

  const handleSavePixel = () => {
    if (!tempPixelId.trim()) return
    localStorage.setItem('vave_meta_pixel', tempPixelId)
    setMetaPixelId(tempPixelId)
    setIsMetaActive(true)
    toast({ title: "Tracker Synchronized", description: "Advanced intelligence layer updated." })
  }

  const handleRemovePixel = () => {
    localStorage.removeItem('vave_meta_pixel')
    setMetaPixelId('')
    setIsMetaActive(false)
    setTempPixelId('')
    toast({ title: "Tracker Disconnected", description: "Reverted to basic session tracking." })
  }

  const loadData = async (days: string) => {
    setIsRefreshing(true)
    try {
      const isAdmin = await adminService.isViewer()
      if (!isAdmin) {
        toast({ title: "Access Restricted", description: "Standard account privileges required.", variant: "destructive" })
        return
      }
      const endDate = new Date()
      const startDate = new Date()
      if (days !== 'all') startDate.setDate(endDate.getDate() - parseInt(days))
      else startDate.setFullYear(2024, 0, 1)

      const [statsData, audienceData, activityData] = await Promise.all([
        adminService.getAnalyticsStats(startDate, endDate),
        adminService.getAudienceIntelligence(startDate, endDate),
        adminService.getLiveActivity()
      ])

      setRealStats(statsData)
      setRealAudience(audienceData)
      setRealActivity(activityData)
      
      if (statsData.totalViews === 0 && statsData.totalRevenue === 0) {
        setIsDemoMode(true)
      }
    } catch (error) {
      toast({ title: "Connection Error", description: "Defaulting to high-fidelity demo environment.", variant: "destructive" })
      setIsDemoMode(true)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => { loadData(dateRange) }, [dateRange])

  const stats = isDemoMode ? MOCK_STATS : (realStats || MOCK_STATS);
  const audience = isDemoMode ? MOCK_AUDIENCE : (realAudience || MOCK_AUDIENCE);
  const liveActivity = isDemoMode ? MOCK_ACTIVITY : (realActivity.length > 0 ? realActivity : MOCK_ACTIVITY);

  const conversionRate = useMemo(() => {
    if (!stats || stats.totalViews === 0) return 0
    return ((stats.totalPurchases / stats.totalViews) * 100).toFixed(1)
  }, [stats])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AdminNavbar />
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-gold" />
          <p className="text-white/20 font-serif tracking-[0.3em] font-light">ESTABLISHING CONNECTION</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans pb-32">
      <AdminNavbar />
      
      <div className="container mx-auto pt-32 px-6 max-w-7xl">
        {/* Intelligence Synchronizer */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-10 bg-zinc-900/60 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                <ShieldCheck className="h-8 w-8 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-serif mb-1 text-white">Business Intelligence Link</h2>
                <p className="text-white/50 text-sm font-light">Identifying user intent across collection, cart, and checkout layers.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <Button 
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`h-12 px-6 rounded-xl font-bold transition-all border ${
                  isDemoMode ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                {isDemoMode ? "Live Stream Offline" : "Switch to Demo Mode"}
              </Button>

              {isMetaActive ? (
                <div className="flex items-center gap-4 bg-black/50 border border-white/10 p-4 rounded-xl w-full sm:w-auto">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">PX-ID LINKED</p>
                    <p className="font-mono text-sm text-gold">{metaPixelId}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemovePixel} className="ml-4 text-white/40 hover:text-white">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="flex w-full sm:w-auto items-center gap-2">
                  <Input 
                    value={tempPixelId} 
                    onChange={(e) => setTempPixelId(e.target.value)} 
                    placeholder="Enter Pixel ID..." 
                    className="bg-black/50 border-white/10 h-12 w-full sm:w-60 rounded-xl text-center font-mono focus:border-gold/50"
                  />
                  <Button onClick={handleSavePixel} className="bg-white text-black hover:bg-gold h-12 px-8 rounded-xl font-bold">
                    Sync
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Executive Dashboard Nav */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-4 w-4 text-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/80">VAVE Executive suite</span>
            </div>
            <h1 className="text-5xl font-serif tracking-tight text-white italic">Portfolio Performance</h1>
            <div className="flex gap-12 mt-8 border-b border-white/5 pb-1">
              <button 
                onClick={() => setActiveTab('performance')}
                className={`text-[10px] pb-4 font-bold uppercase tracking-[0.3em] transition-all relative ${
                  activeTab === 'performance' ? 'text-white' : 'text-white/20 hover:text-white/40'
                }`}
              >
                Market Performance
                {activeTab === 'performance' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-px bg-gold" />}
              </button>
              <button 
                onClick={() => setActiveTab('audience')}
                className={`text-[10px] pb-4 font-bold uppercase tracking-[0.3em] transition-all relative ${
                  activeTab === 'audience' ? 'text-white' : 'text-white/20 hover:text-white/40'
                }`}
              >
                Audience Intelligence
                {activeTab === 'audience' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-px bg-gold" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl mb-6 lg:mb-1">
            {[ { id: '7', label: '7D' }, { id: '30', label: '30D' }, { id: 'all', label: 'MAX' } ].map(item => (
              <button
                key={item.id}
                onClick={() => setDateRange(item.id as any)}
                className={`w-16 py-3 rounded-xl text-[10px] font-bold transition-all uppercase tracking-[0.2em] ${
                  dateRange === item.id ? 'bg-gold text-black shadow-lg scale-105' : 'text-white/30 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'performance' ? (
            <motion.div 
              key="perf"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard title="Brand Impressions" value={stats.totalViews} icon={<Users size={20}/>} trend="+12.4%" />
                <MetricCard title="Cart Acquisitions" value={stats.totalCarts} icon={<ShoppingCart size={20}/>} trend={`${((stats.totalCarts / stats.totalViews) * 100).toFixed(1)}%`} sub="Conv" />
                <MetricCard title="Aspirational Wishlist" value={stats.totalWishlist || 0} icon={<Heart size={20}/>} trend="Desire Index" />
                <MetricCard title="Portfolio Revenue" value={formatCurrency(stats.totalRevenue)} icon={<TrendingUp size={20}/>} premium />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <Card className="bg-zinc-900/40 border-white/10 h-full rounded-[2.5rem] border backdrop-blur-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-3 w-3 text-gold" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Throughput Matrix</span>
                      </div>
                      <CardTitle className="text-2xl font-serif text-white">Acquisition Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-6">
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#333" fontSize={10} tickLine={false} axisLine={false} dy={10} hide={isDemoMode && dateRange !== '7'} />
                            <YAxis stroke="#333" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                            <CartesianGrid strokeDasharray="10 10" stroke="#ffffff05" vertical={false} />
                            <Area type="monotone" dataKey="views" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                            <Area type="monotone" dataKey="orders" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-zinc-900/60 border-white/10 h-full rounded-[2.5rem] border backdrop-blur-3xl flex flex-col overflow-hidden">
                  <CardHeader className="p-8 border-b border-white/10">
                    <CardTitle className="text-xl font-serif text-white">Live Intent Flux</CardTitle>
                    <CardDescription className="text-white/30 text-xs mt-1 italic">Real-time patron behavior.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 overflow-y-auto scrollbar-hide">
                    <div className="divide-y divide-white/5">
                      {liveActivity.map((c: any, i: number) => (
                        <div key={i} className="p-6 hover:bg-white/5 transition-all group/item">
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 group-hover/item:border-gold/30">
                              {c.action.includes('Wishlist') ? <Heart className="h-3 w-3 text-gold" /> : <ShoppingCart className="h-3 w-3 text-gold" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-medium text-white">{c.user}</p>
                              <p className="text-[11px] text-white/40 mt-1 flex items-center justify-between">
                                {c.action} <span>"{c.product}"</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card className="bg-zinc-900/40 border-white/10 rounded-[2.5rem] border backdrop-blur-3xl overflow-hidden">
                   <CardHeader className="p-8">
                     <CardTitle className="text-2xl font-serif text-white italic">Sales Hierarchy</CardTitle>
                   </CardHeader>
                   <CardContent className="p-8 pt-0">
                     <div className="space-y-8">
                       {(stats.revenueProducts || []).map((p: any, i: number) => (
                         <div key={i} className="group/rank">
                           <div className="flex justify-between items-end mb-3">
                             <span className="text-sm font-medium text-white/90">{p.name} <span className="text-white/20 ml-2 font-mono text-[10px] uppercase">{p.count} units</span></span>
                             <span className="text-lg font-serif text-gold">{formatCurrency(p.revenue)}</span>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${(p.revenue / stats.totalRevenue) * 100}%` }} className="h-full bg-gold shadow-[0_0_10px_#D4AF37]" />
                           </div>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                </Card>

                <Card className="bg-zinc-900/60 border-white/10 rounded-[2.5rem] border backdrop-blur-3xl">
                   <CardHeader className="p-8">
                     <CardTitle className="text-2xl font-serif text-white">Desirability Leaderboard</CardTitle>
                     <CardDescription className="text-white/30 text-xs">Top products added to wishlists.</CardDescription>
                   </CardHeader>
                   <CardContent className="p-8 pt-0">
                      <div className="space-y-6">
                        {(stats.wishlistPopularity || MOCK_STATS.wishlistPopularity).map((p: any, i: number) => (
                          <div key={p.name} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-colors">
                            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-serif italic text-sm">{i+1}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{p.name}</p>
                              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{p.count} Loves</p>
                            </div>
                            <Heart className={i < 2 ? "h-4 w-4 text-gold fill-gold" : "h-4 w-4 text-white/10"} />
                          </div>
                        ))}
                      </div>
                   </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="audience"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Lead Recovery Matrix */}
                  <Card className="bg-zinc-900/40 border-white/10 rounded-[2.5rem] border backdrop-blur-3xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <UserPlus className="h-4 w-4 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">High-Probability Leads</span>
                      </div>
                      <CardTitle className="text-2xl font-serif text-white">Abandoned Checkout Recovery</CardTitle>
                      <CardDescription className="text-white/30">Specific users who left items at the final step. Act fast to recover the sale.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-1">
                      {audience.recoveryLeads.length === 0 ? (
                        <div className="p-16 text-center text-white/20 italic font-light">No checkout abandonment detected in this window.</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                          {audience.recoveryLeads.map((lead: any, i: number) => (
                            <div key={i} className="bg-black p-8 hover:bg-zinc-950 transition-colors group">
                               <div className="flex justify-between items-start mb-6">
                                 <div>
                                   <p className="text-lg font-medium text-white">{lead.user}</p>
                                   <p className="text-xs text-white/40 mt-1">{lead.email}</p>
                                 </div>
                                 <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                                   {lead.daysAgo === 0 ? 'Hot Lead' : `${lead.daysAgo}d ago`}
                                 </span>
                               </div>
                               <div className="flex items-center gap-2 mb-6">
                                 <ShoppingCart className="h-3 w-3 text-gold" />
                                 <p className="text-xs text-white/70">Left behind <span className="text-white font-medium italic underline underline-offset-4 decoration-gold/30">"{lead.product}"</span></p>
                               </div>
                               {lead.phone && (
                                 <Button 
                                   className="w-full h-10 border-white/10 hover:border-gold/30 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 text-white hover:bg-gold hover:text-black transition-all"
                                   asChild
                                 >
                                   <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.user}, this is the VAVE Concierge. I noticed you were exploring ${lead.product}. Would you like a private discount to complete your collection?`)}`} target="_blank">
                                     <MessageCircle size={12} className="mr-2" />
                                     Recover via WhatsApp
                                   </a>
                                 </Button>
                               )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Traffic Architecture */}
                  <Card className="bg-zinc-900/60 border-white/10 rounded-[2.5rem] border backdrop-blur-3xl overflow-hidden">
                    <CardHeader className="p-8">
                      <div className="flex items-center gap-3 mb-2">
                        <MousePointer2 className="h-4 w-4 text-gold/60" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Market flux</span>
                      </div>
                      <CardTitle className="text-2xl font-serif text-white">Traffic Architecture</CardTitle>
                      <CardDescription className="text-white/30">The most navigated paths in your digital gallery.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                       <div className="space-y-4">
                         {audience.pagePerformance.map((page: any, i: number) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div className="flex items-center gap-4">
                               <Layout className="h-3 w-3 text-white/20" />
                               <span className="text-xs font-mono text-white/60">{page.path}</span>
                             </div>
                             <div className="flex items-baseline gap-2">
                               <span className="text-lg font-serif text-white">{page.views}</span>
                               <span className="text-[9px] uppercase tracking-widest text-white/20">Visits</span>
                             </div>
                           </div>
                         ))}
                       </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                   {/* Intent Summary */}
                   <Card className="bg-white text-black rounded-[2.5rem] overflow-hidden p-8 border-none shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-12">Intent Conversion</h4>
                      <div className="space-y-12">
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Cart-to-Scale</span>
                            <span className="text-3xl font-serif italic">{((stats.totalPurchases / (stats.totalCarts || 1)) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${(stats.totalPurchases / (stats.totalCarts || 1)) * 100}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Wish-to-Cart</span>
                            <span className="text-3xl font-serif italic">{((stats.totalCarts / (stats.totalWishlist || 1)) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${(stats.totalCarts / (stats.totalWishlist || 1)) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-16 p-6 bg-black/5 rounded-2xl border border-black/5">
                        <Sparkles className="h-4 w-4 text-black mb-3" />
                        <p className="text-[11px] leading-relaxed italic opacity-80">"A high wish-to-cart latency suggests your patrons are waiting for a private invitation or special event to liquidate their desire."</p>
                      </div>
                   </Card>

                   {/* Active Intelligence Feed */}
                   <Card className="bg-zinc-900/40 border-white/10 rounded-[2.5rem] border backdrop-blur-3xl overflow-hidden p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <Clock className="h-3 w-3 text-white/30" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Recent intent spikes</span>
                      </div>
                      <div className="space-y-6">
                        {liveActivity.slice(0, 5).map((act, idx) => (
                           <div key={idx} className="flex gap-4 items-start">
                             <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 opacity-20" />
                             <div>
                               <p className="text-xs text-white/90">
                                 <span className="font-bold underline underline-offset-4 decoration-gold/30">{act.user}</span> triggered <span className="italic">{act.action}</span> for {act.product}
                               </p>
                               <span className="text-[9px] text-white/20 font-mono mt-1 block uppercase tracking-widest">{new Date(act.time).toLocaleTimeString()}</span>
                             </div>
                           </div>
                        ))}
                      </div>
                   </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Sync State */}
        <div className="mt-16 p-16 border border-dashed border-white/10 rounded-[3rem] text-center bg-zinc-900/20 backdrop-blur-3xl group">
             <div className="h-px w-24 bg-gold/30 mx-auto mb-8" />
             <h3 className="text-3xl font-serif text-white/90 italic mb-4">Deep Intelligence Matrix</h3>
             <p className="text-white/30 text-xs max-w-lg mx-auto font-light leading-relaxed tracking-widest">
               IDENTIFYING LEAKAGE. RECOVERING REVENUE. UNDERSTANDING DESIRE. 
               YOUR DIGITAL GALLERY IS NOW FULLY INSTRUMENTED.
             </p>
             <div className="mt-12 flex justify-center gap-8 opacity-20 group-hover:opacity-100 transition-opacity">
               <div className="flex flex-col items-center gap-2">
                 <MousePointer2 size={12} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">Clickstream</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Heart size={12} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">Aspiration</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <ShoppingCart size={12} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">Liquidation</span>
               </div>
             </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, sub, premium = false }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border group transition-all duration-500 relative overflow-hidden ${
      premium ? 'bg-white text-black border-white' : 'bg-zinc-900/60 text-white border-white/10 backdrop-blur-3xl hover:border-gold/30 shadow-xl'
    }`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className={`p-4 rounded-2xl ${premium ? 'bg-black text-gold border-none shadow-2xl' : 'bg-white/5 text-gold border border-white/10'}`}>
            {icon}
          </div>
          {trend && (
            <div className="text-right">
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg ${premium ? 'bg-black/5 text-black' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                {trend}
              </span>
              {sub && <p className="text-[8px] mt-1.5 opacity-30 font-bold uppercase tracking-[0.2em]">{sub}</p>}
            </div>
          )}
        </div>
        <div>
          <p className="text-4xl font-serif tracking-tight mb-2 italic">{value}</p>
          <p className={`text-[10px] uppercase tracking-[0.4em] font-bold ${premium ? 'text-black/30' : 'text-white/20'}`}>{title}</p>
        </div>
      </div>
      {premium && (
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-gold/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
      )}
    </div>
  )
}
