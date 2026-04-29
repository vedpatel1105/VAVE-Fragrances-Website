import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient'

export interface User {
  id: string
  email: string
  role: 'user' | 'admin' | 'viewer'
  created_at: string
  full_name?: string
  phone?: string
}

export const adminService = {
  getSupabase() {
    return getSupabaseClient()
  },

  async getCurrentUserRole(): Promise<'user' | 'admin' | 'viewer'> {
    const client = this.getSupabase()
    if (!client) return 'user'

    const { data: { session } } = await client.auth.getSession()
    if (!session?.user) return 'user'

    const { data, error } = await client
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (error) return 'user'
    return data.role
  },

  async isAdmin(passedUser?: any): Promise<boolean> {
    if (!isSupabaseConfigured) return false
    try {
      const user = passedUser || (await this.getSupabase().auth.getUser()).data.user
      if (!user) return false

      // 1. Check for specific recovery ID
      if (user.id === '00000000-0000-0000-0000-000000000000') return true;

      // 2. Check for specific admin email (Backdoor)
      if (user.email === 'admin@vavefragrances.dev') return true;

      // 3. Check user metadata role
      if (user.user_metadata?.role === 'admin') return true;

      // 4. Check database role
      const role = await this.getCurrentUserRole()
      return role === 'admin'
    } catch (error) {
      return false
    }
  },

  async isViewer(passedUser?: any): Promise<boolean> {
    if (!isSupabaseConfigured) return false
    try {
      // 1. Check passed user for recovery ID or admin email
      if (passedUser?.id === '00000000-0000-0000-0000-000000000000') return true;
      if (passedUser?.email === 'admin@vavefragrances.dev') return true;

      // 2. Check session for recovery ID
      const client = this.getSupabase();
      const { data: { session } } = await client.auth.getSession();
      if (session?.user?.id === '00000000-0000-0000-0000-000000000000') return true;
      if (session?.user?.email === 'admin@vavefragrances.dev') return true;

      // 3. Check database role
      const role = await this.getCurrentUserRole()
      return role === 'admin' || role === 'viewer'
    } catch (error) {
      return false
    }
  },

  async getAllUsers(): Promise<User[]> {
    const client = this.getSupabase()
    if (!client) return []

    const { data: { session } } = await client.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { data: roles, error: rolesError } = await client
      .from('user_roles')
      .select('user_id, role, created_at')

    if (rolesError) throw rolesError

    const { data: users, error: usersError } = await client
      .from('users')
      .select('id, email')

    if (usersError) throw usersError

    return users.map((user: { id: string; email: string }) => {
      const role = roles.find((r: { user_id: string }) => r.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        role: role?.role || 'user',
        created_at: role?.created_at || new Date().toISOString()
      }
    }).sort((a: User, b: User) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async setUserAsAdmin(userId: string): Promise<void> {
    const client = this.getSupabase()
    if (!client) return

    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { error } = await client
      .rpc('set_user_as_admin', { user_id: userId })

    if (error) throw error
  },

  async removeAdminRole(userId: string): Promise<void> {
    const client = this.getSupabase()
    if (!client) return

    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { error } = await client
      .rpc('remove_admin_role', { user_id: userId })

    if (error) throw error
  },

  async getUserDetails(userId: string): Promise<User> {
    const client = this.getSupabase()
    if (!client) throw new Error('System unconfigured')

    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    try {
      const { data, error } = await client
        .from('users')
        .select('id, email, full_name, phone')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('User not found')
        }
        throw error
      }

      if (!data) {
        throw new Error('User not found')
      }

      return {
        ...data,
        role: 'user',
        created_at: new Date().toISOString()
      } as User
    } catch (error: any) {
      console.error('Error fetching user details:', error)
      throw new Error(error.message || 'Failed to fetch user details')
    }
  },

  async getAnalyticsStats(startDate?: Date, endDate?: Date) {
    const client = this.getSupabase()
    if (!client) return {
      totalViews: 0, totalCarts: 0, checkoutStarts: 0, totalPurchases: 0, 
      totalRevenue: 0, topProducts: [], timeline: []
    }

    const end = endDate || new Date()
    const start = startDate || new Date(new Date().setDate(end.getDate() - 7))
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    const { data: events, error: eventsError } = await client
      .from('vave_analytics')
      .select('*')
      .gte('created_at', startISO)
      .lte('created_at', endISO)
    if (eventsError) throw eventsError

    const { data: orders, error: ordersError } = await client
      .from('orders')
      .select('total_amount, status, created_at, user_id, items')
      .gte('created_at', startISO)
      .lte('created_at', endISO)
    if (ordersError) throw ordersError

    const paidOrders = orders.filter(o => o.status === 'paid')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    
    const uniqueBuyers = new Set(paidOrders.map(o => o.user_id)).size
    const returningBuyers = paidOrders.length - uniqueBuyers

    return {
      totalViews: events.filter(e => e.event_name === 'page_view').length,
      totalCarts: events.filter(e => e.event_name === 'add_to_cart').length,
      totalWishlist: events.filter(e => e.event_name === 'add_to_wishlist').length,
      checkoutStarts: events.filter(e => e.event_name === 'begin_checkout').length,
      totalPurchases: paidOrders.length,
      totalRevenue: totalRevenue,
      returningRate: paidOrders.length > 0 ? ((returningBuyers / paidOrders.length) * 100).toFixed(1) : 0,
      topProducts: this.aggregateTopProducts(events.filter(e => e.event_name === 'add_to_cart')),
      wishlistPopularity: this.aggregateTopProducts(events.filter(e => e.event_name === 'add_to_wishlist')),
      revenueProducts: this.aggregateRevenueProducts(paidOrders),
      timeline: this.groupEventsByDate(events, orders, start, end)
    }
  },

  aggregateTopProducts(cartEvents: any[]) {
    const products: Record<string, { name: string, count: number }> = {}
    cartEvents.forEach(e => {
      const name = e.event_data?.item_name || 'Unknown'
      if (!products[name]) products[name] = { name, count: 0 }
      products[name].count++
    })
    return Object.values(products).sort((a, b) => b.count - a.count).slice(0, 5)
  },

  aggregateRevenueProducts(paidOrders: any[]) {
    const products: Record<string, { name: string, revenue: number, count: number }> = {}
    paidOrders.forEach(order => {
      const items = Array.isArray(order.items) ? order.items : []
      items.forEach((item: any) => {
        const name = item.name || 'Unknown'
        if (!products[name]) products[name] = { name, revenue: 0, count: 0 }
        products[name].revenue += (Number(item.price) * Number(item.quantity || 1))
        products[name].count += Number(item.quantity || 1)
      })
    })
    return Object.values(products).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  },

  groupEventsByDate(events: any[], orders: any[], start: Date, end: Date) {
    const timeline: Record<string, { date: string, views: number, orders: number }> = {}
    const curr = new Date(start)
    while (curr <= end) {
      const ds = curr.toISOString().split('T')[0]
      timeline[ds] = { date: ds, views: 0, orders: 0 }
      curr.setDate(curr.getDate() + 1)
    }
    events.forEach(e => {
      const ds = e.created_at.split('T')[0]
      if (timeline[ds] && e.event_name === 'page_view') timeline[ds].views++
    })
    orders.forEach(o => {
      const ds = o.created_at.split('T')[0]
      if (timeline[ds] && o.status === 'paid') timeline[ds].orders++
    })
    return Object.values(timeline)
  },
  
  async getLiveActivity() {
    const client = this.getSupabase()
    if (!client) return []

    const isAdmin = await this.isViewer()
    if (!isAdmin) throw new Error('Not authorized')

    const { data: events, error } = await client
      .from('vave_analytics')
      .select(`
        *,
        users (
          full_name,
          email,
          phone
        )
      `)
      .in('event_name', ['add_to_cart', 'begin_checkout', 'add_to_wishlist'])
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return events.map(e => ({
      user: e.users?.full_name || 'Guest',
      email: e.users?.email,
      phone: e.users?.phone,
      product: e.event_data?.item_name || e.event_data?.items?.[0]?.name || 'Unknown',
      action: e.event_name === 'add_to_cart' ? 'Added to Cart' : 
              e.event_name === 'add_to_wishlist' ? 'Added to Wishlist' : 
              'Started Checkout',
      time: e.created_at,
      raw: e.event_data
    }))
  },

  async getAudienceIntelligence(startDate?: Date, endDate?: Date) {
    const client = this.getSupabase()
    if (!client) return { pagePerformance: [], leads: [] }

    const end = endDate || new Date()
    const start = startDate || new Date(new Date().setDate(end.getDate() - 30))

    const { data: pageEvents } = await client
      .from('vave_analytics')
      .select('url')
      .eq('event_name', 'page_view')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    const pageStats: Record<string, number> = {}
    pageEvents?.forEach(e => {
      const path = e.url || '/'
      pageStats[path] = (pageStats[path] || 0) + 1
    })

    const pagePerformance = Object.entries(pageStats)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const { data: checkouts } = await client
      .from('vave_analytics')
      .select(`
        *,
        users (full_name, email, phone)
      `)
      .eq('event_name', 'begin_checkout')
      .gte('created_at', start.toISOString())
      .order('created_at', { ascending: false })

    const { data: paidOrders } = await client
      .from('orders')
      .select('user_id')
      .eq('status', 'paid')
      .gte('created_at', start.toISOString())

    const paidUserIds = new Set(paidOrders?.map(o => o.user_id) || [])
    
    const recoveryLeads = checkouts?.filter(c => c.user_id && !paidUserIds.has(c.user_id))
      .map(c => ({
        user: c.users?.full_name || 'Valued Patron',
        email: c.users?.email,
        phone: c.users?.phone,
        product: c.event_data?.item_name || 'Selected Scents',
        time: c.created_at,
        daysAgo: Math.floor((new Date().getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24))
      })).slice(0, 10)

    return {
      pagePerformance,
      recoveryLeads
    }
  }
}