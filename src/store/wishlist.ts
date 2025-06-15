import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item: WishlistItem) => {
        const { items } = get();
        if (!items.some((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeFromWishlist: (itemId: string) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== itemId) });
      },

      isInWishlist: (itemId: string) => {
        const { items } = get();
        return items.some((item) => item.id === itemId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
); 