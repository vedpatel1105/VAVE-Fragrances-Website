import { supabase } from './supabaseClient'
import { CartItem } from '@/src/app/components/Cart'
import { adminService } from './adminService'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: CartItem[]
  total: number
  shipping_address: string
  payment_method: string
  created_at: string
}

export const orderService = {
  async checkIncompleteOrders(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_orders')
      .select('id, status')
      .eq('user_id', user.id)
      .in('status', ['pending', 'processing', 'shipped'])
      .limit(1)

    if (error) throw error
    return data.length > 0
  },

  async placeOrder(orderData: Omit<Order, 'id' | 'user_id' | 'created_at'>): Promise<Order> {
    // First check for incomplete orders
    const hasIncompleteOrders = await this.checkIncompleteOrders()
    if (hasIncompleteOrders) {
      throw new Error('You have an incomplete order. Please wait for it to be processed before placing a new order.')
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Create the order
    const { data, error } = await supabase
      .from('user_orders')
      .insert({
        ...orderData,
        user_id: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getOrderById(id: string): Promise<Order> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Admin functions
  async updateOrderStatus(orderId: string, status: Order['status'], notes?: string): Promise<void> {
    try {
      // Check if user is admin first
      const isAdmin = await adminService.isAdmin()
      if (!isAdmin) throw new Error('Not authorized')

      // Update order status
      const supabase = createClientComponentClient()
      const { error: orderError } = await supabase
        .from('user_orders')
        .update({ status })
        .eq('id', orderId)

      if (orderError) throw orderError

      // Try to add status history, but don't fail if it doesn't work
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { error: historyError } = await supabase
            .from('order_status_history')
            .insert({
              order_id: orderId,
              status,
              changed_by: session.user.id,
              notes
            })

          if (historyError) {
            console.warn('Failed to update order status history:', historyError)
            // Don't throw the error, just log it
          }
        }
      } catch (historyError) {
        console.warn('Error updating order status history:', historyError)
        // Don't throw the error, just log it
      }
    } catch (error: any) {
      console.error('Error updating order status:', error)
      throw new Error(error.message || 'Failed to update order status')
    }
  },

  async getAllOrders(): Promise<Order[]> {
    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if user is admin
    const isAdmin = await adminService.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { data, error } = await supabase
      .from('user_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async searchOrders(query: string): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if user is admin
    const isAdmin = await adminService.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { data, error } = await supabase
      .from('user_orders')
      .select('*')
      .or(`id.ilike.%${query}%,items->>name.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 