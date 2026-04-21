import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface User {
  id: string
  email: string
  role: 'user' | 'admin' | 'viewer'
  created_at: string
  full_name?: string
  phone?: string
}

export const adminService = {
  async getCurrentUserRole(): Promise<'user' | 'admin' | 'viewer'> {
    const supabase = createClientComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (error) return 'user'
    return data.role
  },

  async isAdmin(): Promise<boolean> {
    try {
      const role = await this.getCurrentUserRole()
      return role === 'admin'
    } catch (error) {
      return false
    }
  },

  async isViewer(): Promise<boolean> {
    try {
      const role = await this.getCurrentUserRole()
      return role === 'admin' || role === 'viewer'
    } catch (error) {
      return false
    }
  },

  async getAllUsers(): Promise<User[]> {
    const supabase = createClientComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    // Verify admin status
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role, created_at')

    if (rolesError) throw rolesError

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')

    if (usersError) throw usersError

    // Combine user data with roles
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
    const supabase = createClientComponentClient()
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { error } = await supabase
      .rpc('set_user_as_admin', { user_id: userId })

    if (error) throw error
  },

  async removeAdminRole(userId: string): Promise<void> {
    const supabase = createClientComponentClient()
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { error } = await supabase
      .rpc('remove_admin_role', { user_id: userId })

    if (error) throw error
  },

  async getUserDetails(userId: string): Promise<User> {
    const supabase = createClientComponentClient()
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    try {
      const { data, error } = await supabase
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
        role: 'user', // Default role
        created_at: new Date().toISOString() // Default created_at
      } as User
    } catch (error: any) {
      console.error('Error fetching user details:', error)
      throw new Error(error.message || 'Failed to fetch user details')
    }
  },

  async getAnalyticsStats(startDate?: Date, endDate?: Date) {
    const supabase = createClientComponentClient()
    const end = endDate || new Date()
    const start = startDate || new Date(new Date().setDate(end.getDate() - 7))
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    const { data: events, error: eventsError } = await supabase
      .from('vave_analytics')
      .select('*')
      .gte('created_at', startISO)
      .lte('created_at', endISO)
    if (eventsError) throw eventsError

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')
      .gte('created_at', startISO)
      .lte('created_at', endISO)
    if (ordersError) throw ordersError

    return {
      totalViews: events.filter(e => e.event_name === 'page_view').length,
      totalCarts: events.filter(e => e.event_name === 'add_to_cart').length,
      checkoutStarts: events.filter(e => e.event_name === 'begin_checkout').length,
      totalPurchases: orders.filter(o => o.status === 'paid').length,
      totalRevenue: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.total_amount || 0), 0),
      topProducts: this.aggregateTopProducts(events.filter(e => e.event_name === 'add_to_cart')),
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
  }
}
 