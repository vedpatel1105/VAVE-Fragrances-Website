import { supabase } from './supabaseClient';

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

export const productService = {
    async getAllProducts(): Promise<DBProduct[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getProductBySlug(slug: string): Promise<DBProduct | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    },

    async getProductById(id: string): Promise<DBProduct | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getBestsellerProducts(): Promise<DBProduct[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_bestseller', true)
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getNewProducts(): Promise<DBProduct[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_new', true)
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getProductsByCategory(category: string): Promise<DBProduct[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async updateStock(productId: string, size: '30' | '50', quantity: number): Promise<void> {
        const stockField = size === '30' ? 'stock_30ml' : 'stock_50ml';

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

        // Explicitly type the data object
        const stock = size === '30'
            ? (data as { stock_30ml: number }).stock_30ml
            : (data as { stock_50ml: number }).stock_50ml;

        return typeof stock === 'number' && stock >= quantity;
    }
};