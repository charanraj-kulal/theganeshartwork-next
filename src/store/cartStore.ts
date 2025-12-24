import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  productId: string;
  categoryId?: string; // Category ID for coupon validation
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  uploadedImage?: File | null; // Customer's uploaded image
  uploadedImageUrl?: string | null; // URL for uploaded image (for display)
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemImage: (productId: string, image: File, imageUrl: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.productId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });

        // Sync with server after adding
        get().syncWithServer();
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));

        // Sync with server after removing
        get().syncWithServer();
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));

        // Sync with server after updating
        get().syncWithServer();
      },

      updateItemImage: (productId, image, imageUrl) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId 
              ? { ...item, uploadedImage: image, uploadedImageUrl: imageUrl } 
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      syncWithServer: async () => {
        try {
          const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: get().items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            }),
          });

          if (!response.ok) {
            // User might not be logged in, silently fail
            console.log('Cart sync skipped - user not logged in');
          }
        } catch (error) {
          console.error('Cart sync failed:', error);
        }
      },

      loadFromServer: async () => {
        try {
          const response = await fetch('/api/cart/sync');
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            // Merge server cart with local cart
            const localItems = get().items;
            const serverItemIds = data.items.map((item: CartItem) => item.productId);
            
            // Keep local items that aren't on server (with uploaded images)
            const localOnlyItems = localItems.filter(
              item => !serverItemIds.includes(item.productId) && (item.uploadedImage || item.uploadedImageUrl)
            );

            // Combine server items with local-only items
            set({ items: [...data.items, ...localOnlyItems] });
          }
        } catch (error) {
          console.error('Failed to load cart from server:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
