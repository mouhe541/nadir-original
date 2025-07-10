import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail_url: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addToCart: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        
        return { items: [...state.items, item] };
      }),
      
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((item) => item.id !== id),
          };
        }
        
        return {
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        };
      }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
); 