import { supabase } from "./supabaseClient";

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount?: number;
  max_discount?: number;
  applies_to?: string[]; // Array of product IDs. If empty/null, applies to all.
  is_active: boolean;
  description?: string;
  expiry_date?: string;
}

export const couponService = {
  getCoupons: async (): Promise<Coupon[]> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
    return data || [];
  },

  validateCoupon: async (code: string, subtotal: number, cartItems?: any[]): Promise<{ success: boolean; coupon?: Coupon; error?: string }> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid or inactive coupon code' };
    }

    const coupon = data as Coupon;

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return { success: false, error: 'This coupon has expired' };
    }

    // Check min amount
    if (coupon.min_amount && subtotal < coupon.min_amount) {
      return { 
        success: false, 
        error: `Minimum order amount for this coupon is ₹${coupon.min_amount}` 
      };
    }

    // Check if it applies to the current cart
    if (coupon.applies_to && coupon.applies_to.length > 0 && cartItems) {
      const hasApplicableProduct = cartItems.some(item => 
        coupon.applies_to?.includes(item.product_id?.toString() || item.id?.toString())
      );
      if (!hasApplicableProduct) {
        return { success: false, error: 'This coupon is not applicable to any products in your cart' };
      }
    }

    return { success: true, coupon };
  },

  calculateDiscount: (coupon: Coupon, cartItems: any[]): number => {
    // If it applies to all products
    if (!coupon.applies_to || coupon.applies_to.length === 0) {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      if (coupon.type === 'percentage') {
        return Math.round((subtotal * coupon.value) / 100);
      } else {
        return coupon.value;
      }
    }

    // If it applies to specific products
    const applicableSubtotal = cartItems
      .filter(item => coupon.applies_to?.includes(item.product_id?.toString() || item.id?.toString()))
      .reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (applicableSubtotal === 0) return 0;

    if (coupon.type === 'percentage') {
      const discount = Math.round((applicableSubtotal * coupon.value) / 100);
      return coupon.max_discount ? Math.min(discount, coupon.max_discount) : discount;
    } else {
      // For fixed discounts on specific products, we still just return the value
      // but ensure we don't discount more than the applicable total
      return Math.min(coupon.value, applicableSubtotal);
    }
  },

  createCoupon: async (coupon: Omit<Coupon, 'id'>) => {
    const { data, error } = await supabase
      .from('coupons')
      .insert([coupon])
      .select();
    return { data, error };
  },

  updateCoupon: async (id: string, updates: Partial<Coupon>) => {
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  deleteCoupon: async (id: string) => {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    return { error };
  }
};
