import { supabase } from './supabaseClient'

export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

export const adminService = {
  async getCurrentUserRole(): Promise<'user' | 'admin'> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    return data.role
  },

  async isAdmin(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return false

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (error) return false
      return data.role === 'admin'
    } catch (error) {
      return false
    }
  },

  async getAllUsers(): Promise<User[]> {
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
    return users.map(user => {
      const role = roles.find(r => r.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        role: role?.role || 'user',
        created_at: role?.created_at || new Date().toISOString()
      }
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async setUserAsAdmin(userId: string): Promise<void> {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { error } = await supabase
      .rpc('set_user_as_admin', { user_id: userId })

    if (error) throw error
  },

  async removeAdminRole(userId: string): Promise<void> {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Not authorized')

    const { error } = await supabase
      .rpc('remove_admin_role', { user_id: userId })

    if (error) throw error
  }
} 