import { supabase, isSupabaseConfigured } from './supabaseClient';
import { adminService } from './adminService';

export interface DBProduct {
    price: number | undefined;
    priceXL: number | undefined;
    id: string;
    name: string;
    slug: string;
    category: string;
    tagline: string;
    price_30ml: number;
    price_50ml: number;
    images: {
        "30": string[];
        "50": string[];
        label: string;
    };
    description: string;
    long_description: string | null;
    rating: number | null;
    reviews_count: number;
    is_new: boolean;
    is_bestseller: boolean;
    is_limited: boolean;
    is_hidden: boolean;
    discount: number | null;
    ingredients: string[];
    notes: {
        top: string[];
        heart: string[];
        base: string[];
    };
    stock_30ml: number;
    stock_50ml: number;
}

export type ProductCreateInput = Omit<DBProduct, 'id' | 'price' | 'priceXL' | 'rating' | 'reviews_count'> & {
    rating?: number | null;
    reviews_count?: number;
};

export type ProductUpdateInput = Partial<Omit<DBProduct, 'id' | 'price' | 'priceXL'>>;

export const productService = {
    // ─── Public Queries (filter hidden products) ─────────────────────

    async getAllProducts(): Promise<DBProduct[]> {
        if (!isSupabaseConfigured) return [];
        
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_hidden', false)
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.warn("Falling back to local data due to Supabase error.");
            return [];
        }
    },

    async getProductBySlug(slug: string): Promise<DBProduct | null> {
        if (!isSupabaseConfigured) return null;
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .eq('is_hidden', false)
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            return null;
        }
    },

    async getProductById(id: string): Promise<DBProduct | null> {
        if (!isSupabaseConfigured) return null;
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            return null;
        }
    },

    async getBestsellerProducts(): Promise<DBProduct[]> {
        if (!isSupabaseConfigured) return [];
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_bestseller', true)
                .eq('is_hidden', false)
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (e) {
            return [];
        }
    },

    async getNewProducts(): Promise<DBProduct[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_new', true)
            .eq('is_hidden', false)
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getProductsByCategory(category: string): Promise<DBProduct[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .eq('is_hidden', false)
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async updateStock(productId: string, size: '30' | '50', quantity: number): Promise<void> {
        const { error } = await supabase.rpc('update_product_stock', {
            p_product_id: productId,
            p_size: size,
            p_quantity: quantity
        });

        if (error) throw error;
    },

    async checkStock(productId: string, size: '30' | '50', quantity: number): Promise<boolean> {
        const stockField = size === '30' ? 'stock_30ml' : 'stock_50ml';

        const { data, error } = await supabase
            .from('products')
            .select(stockField)
            .eq('id', productId)
            .single();

        if (error) throw error;
        if (!data) return false;

        const stock = size === '30'
            ? (data as { stock_30ml: number }).stock_30ml
            : (data as { stock_50ml: number }).stock_50ml;

        return typeof stock === 'number' && stock >= quantity;
    },

    // ─── Admin Queries (include hidden products) ─────────────────────

    async getAllProductsAdmin(): Promise<DBProduct[]> {
        const isAdmin = await adminService.isAdmin();
        if (!isAdmin) throw new Error('Not authorized');

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    // ─── Admin CRUD ──────────────────────────────────────────────────

    async createProduct(product: ProductCreateInput): Promise<DBProduct> {
        const isAdmin = await adminService.isAdmin();
        if (!isAdmin) throw new Error('Not authorized');

        const { data, error } = await supabase
            .from('products')
            .insert({
                ...product,
                rating: product.rating ?? null,
                reviews_count: product.reviews_count ?? 0,
            })
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async updateProduct(id: string, updates: ProductUpdateInput): Promise<DBProduct> {
        const isAdmin = await adminService.isAdmin();
        if (!isAdmin) throw new Error('Not authorized');

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async deleteProduct(id: string): Promise<void> {
        const isAdmin = await adminService.isAdmin();
        if (!isAdmin) throw new Error('Not authorized');

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async toggleProductVisibility(id: string, isHidden: boolean): Promise<DBProduct> {
        const isAdmin = await adminService.isAdmin();
        if (!isAdmin) throw new Error('Not authorized');

        const { data, error } = await supabase
            .from('products')
            .update({ is_hidden: isHidden })
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },
};