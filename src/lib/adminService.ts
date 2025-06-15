import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  full_name?: string
  phone?: string
}

export const adminService = {
  async getCurrentUserRole(): Promise<'user' | 'admin'> {
    const supabase = createClientComponentClient()
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
      const supabase = createClientComponentClient()
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
  }
} 