"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  ArrowUpRight, 
  Calendar,
  Filter,
  RefreshCw,
  Search,
  PackageCheck
} from "lucide-react"
import { adminService } from "@/src/lib/adminService"
import AdminNavbar from "@/src/app/components/AdminNavbar"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default function AdminAnalyticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('7')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadStats = async (days: string) => {
    setIsRefreshing(true)
    try {
      const isAdmin = await adminService.isViewer()
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view analytics.",
          variant: "destructive"
        })
        return
      }

      const endDate = new Date()
      const startDate = new Date()
      if (days !== 'all') {
        startDate.setDate(endDate.getDate() - parseInt(days))
      } else {
        startDate.setFullYear(2024, 0, 1) // Start of tracking
      }

      const data = await adminService.getAnalyticsStats(startDate, endDate)
      setStats(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadStats(dateRange)
  }, [dateRange])

  const conversionRate = useMemo(() => {
    if (!stats || stats.totalViews === 0) return 0
    return ((stats.totalPurchases / stats.totalViews) * 100).toFixed(1)
  }, [stats])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <AdminNavbar />
        <div className="container mx-auto pt-32 px-6 flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-white/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <AdminNavbar />
      
      <div className="container mx-auto pt-32 pb-20 px-6 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-serif mb-2 tracking-tight">Ads Analytics</h1>
            <p className="text-zinc-500 font-light">Performance tracking for Vave Fragrances.</p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: '7', label: '7 Days' },
              { id: '30', label: '30 Days' },
              { id: 'all', label: 'All Time' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setDateRange(item.id as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  dateRange === item.id 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard 
            title="Total Traffic" 
            value={stats.totalViews} 
            icon={<Users className="h-5 w-5" />} 
            label="Unique Page Views"
          />
          <MetricCard 
            title="Shopping Intent" 
            value={stats.totalCarts} 
            icon={<ShoppingCart className="h-5 w-5" />} 
            label="Total Add to Carts"
            trend={`${((stats.totalCarts / stats.totalViews) * 100).toFixed(1)}% conversion`}
          />
          <MetricCard 
            title="Total Orders" 
            value={stats.totalPurchases} 
            icon={<PackageCheck className="h-5 w-5" />} 
            label="Successful Payments"
          />
          <MetricCard 
            title="Revenue" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={<TrendingUp className="h-5 w-5" />} 
            label="Gross Sales"
            premium
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversion Funnel */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-white/5 shadow-2xl h-full">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-white">Conversion Funnel</CardTitle>
                <CardDescription className="text-zinc-500">Tracking the customer journey from visit to purchase.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-12">
                  <FunnelBar label="Visits" count={stats.totalViews} total={stats.totalViews} color="bg-white/10" />
                  <FunnelBar label="Add to Cart" count={stats.totalCarts} total={stats.totalViews} color="bg-white/30" />
                  <FunnelBar label="Checkout" count={stats.checkoutStarts} total={stats.totalViews} color="bg-white/60" />
                  <FunnelBar label="Purchased" count={stats.totalPurchases} total={stats.totalViews} color="bg-white" />
                </div>
                
                <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Total Conversion Rate</p>
                    <p className="text-5xl font-serif text-white">{conversionRate}%</p>
                  </div>
                  <div className="text-right text-zinc-500 text-xs max-w-[200px]">
                    This represents the percentage of total visitors who completed a purchase.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <div>
            <Card className="bg-zinc-900 border-white/5 shadow-2xl h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-white">Performance by Scent</CardTitle>
                <CardDescription className="text-zinc-500">Most added items to cart.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {stats.topProducts.map((p: any, i: number) => (
                    <div key={i} className="px-6 py-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/40">
                          {i + 1}
                        </div>
                        <span className="font-medium text-white/90 group-hover:text-white transition-colors">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono">{p.count}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interest Count</p>
                      </div>
                    </div>
                  ))}
                  {stats.topProducts.length === 0 && (
                    <div className="p-12 text-center text-zinc-600 italic font-light">No data available for this range.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips for Meta Ads Team */}
        <div className="mt-12 p-8 bg-white/5 border border-white/5 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-serif mb-2">Meta Ads Team Insights</h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Use the "Shopping Intent" and "Checkout Starts" metrics to optimize your retargeting campaigns. High intent with low purchase conversion often suggests shipping costs or mobile payment friction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, label, trend, premium = false }: any) {
  return (
    <Card className={`${premium ? 'bg-white text-black' : 'bg-zinc-900 text-white'} border-white/5 overflow-hidden group`}>
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl ${premium ? 'bg-black/5' : 'bg-white/5 group-hover:bg-white/10'} transition-all`}>
            {icon}
          </div>
          {trend && <span className="text-[10px] font-mono tracking-tighter opacity-60 uppercase">{trend}</span>}
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-serif tracking-tight">{value}</p>
          <p className={`text-xs uppercase tracking-[0.2em] ${premium ? 'text-black/40' : 'text-zinc-500'}`}>{title}</p>
        </div>
        <p className={`mt-6 text-[10px] italic ${premium ? 'text-black/30' : 'text-zinc-600'}`}>{label}</p>
      </CardContent>
    </Card>
  )
}

function FunnelBar({ label, count, total, color }: any) {
  const percentage = total === 0 ? 0 : (count / total) * 100
  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs uppercase tracking-widest text-zinc-400">{label}</span>
        <span className="text-sm font-mono text-white">{count.toLocaleString()}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}
