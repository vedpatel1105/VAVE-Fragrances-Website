import { supabase } from './supabaseClient'
import { adminService } from './adminService'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CartItem } from './cartStore'

export interface Order {
  id: string
  user_id: string
  status: string // payment status in `orders`: 'pending' | 'paid' | 'failed'
  fulfillment_status?: 'processing' | 'shipped' | 'delivered' | 'cancelled' | null
  items: CartItem[]
  total_amount: number
  subtotal_amount?: number | null
  shipping_amount?: number | null
  shipping_address: any // stored as JSONB
  payment_method: string
  razorpay_order_id?: string | null
  created_at: string
}

export const orderService = {
  async checkIncompleteOrders(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('orders')
      .select('id, status')
      .eq('user_id', user.id)
      .in('status', ['pending'])
      .limit(1)

    if (error) throw error
    return data.length > 0
  },

  async placeOrder(orderData: Pick<Order, 'items' | 'total_amount' | 'shipping_address' | 'payment_method'> & { subtotal_amount?: number, shipping_amount?: number }): Promise<Order> {
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
      .from('orders')
      .insert({
        user_id: user.id,
        items: orderData.items,
        total_amount: orderData.total_amount,
        subtotal_amount: orderData.subtotal_amount ?? null,
        shipping_amount: orderData.shipping_amount ?? null,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method,
        status: 'pending'
      })
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  async getOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('orders')
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
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Admin functions
  async updateOrderStatus(orderId: string, status: 'pending' | 'paid' | 'failed', notes?: string): Promise<void> {
    try {
      // Check if user is admin first
      const isAdmin = await adminService.isAdmin()
      if (!isAdmin) throw new Error('Not authorized')

      // Update order status
      const supabase = createClientComponentClient()
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (orderError) throw orderError

      // Note: order_status_history references user_orders; skip history write to avoid FK issues.
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
      .from('orders')
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
      .from('orders')
      .select('*')
      .or(`id.ilike.%${query}%,items->>name.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
  ,async updateFulfillmentStatus(orderId: string, fulfillmentStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<void> {
    // Admin only
    const isAdmin = await adminService.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const supabase = createClientComponentClient()
    const { error } = await supabase
      .from('orders')
      .update({ fulfillment_status: fulfillmentStatus })
      .eq('id', orderId)

    if (error) throw error
  }
} 