/*
SQL Schema for addresses and orders tables in Supabase
Execute in Supabase SQL Editor:


*/

import { supabase } from "@/src/lib/supabaseClient";

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
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, phone, email, is_active')
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(profile: Partial<Pick<UserProfile, 'full_name' | 'phone'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // --- Addresses ---
  async getAddresses() {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*');
    if (error) throw error;
    return data;
  },

  async addAddress(address: Omit<Address, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        ...address,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .single();
    if (error) throw error;
    return data;
  },

  async updateAddress(id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('user_addresses')
      .update(updates)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // --- Orders ---
  async getOrders() {
    const { data, error } = await supabase
      .from('user_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
