import { getSupabaseClient } from "@/src/lib/supabaseClient";

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  is_active: boolean;
}

export interface Address {
  id: string;
  user_id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export interface OrderItem {
  id: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface UserOrder {
  id: string;
  user_id: string;
  status: string;
  items: OrderItem[];
  total: number;
  shipping_address: string;
  payment_method: string;
  created_at: string;
}

// --- Profile Service ---
export const profileService = {
  async getProfile() {
    const client = getSupabaseClient();
    const userResponse = await client.auth.getUser();
    const userId = userResponse.data.user?.id;
    
    if (!userId) throw new Error("No authenticated user");

    const { data, error } = await client
      .from('users')
      .select('id, full_name, phone, email, is_active')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(profile: Partial<Pick<UserProfile, 'full_name' | 'phone'>>) {
    const client = getSupabaseClient();
    const userResponse = await client.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) throw new Error("No authenticated user");

    const { data, error } = await client
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // --- Addresses ---
  async getAddresses() {
    const client = getSupabaseClient();
    const userResponse = await client.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) return [];

    const { data, error } = await client
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addAddress(address: Omit<Address, 'id' | 'created_at'>) {
    const client = getSupabaseClient();
    const userResponse = await client.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) throw new Error("No authenticated user");

    const { data, error } = await client
      .from('user_addresses')
      .insert({
        ...address,
        user_id: userId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAddress(id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>) {
    const client = getSupabaseClient();
    const userResponse = await client.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) throw new Error("No authenticated user");

    const { data, error } = await client
      .from('user_addresses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // --- Orders ---
  async getOrders() {
    const client = getSupabaseClient();
    const userResponse = await client.auth.getUser();
    const userId = userResponse.data.user?.id;
    
    if (!userId) return [];

    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};
