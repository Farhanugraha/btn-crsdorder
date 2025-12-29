import { ExtendedMenu } from '@/types/menu';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  menu: ExtendedMenu;
  size: string;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
};

type CartAction = {
  addToCart: (
    menu: ExtendedMenu,
    size: string,
    quantity: number
  ) => void;
  removeFromCart: (menuId: string, size: string) => void;
  increaseQuantity: (menuId: string, size: string) => void;
  decreaseQuantity: (menuId: string, size: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState & CartAction>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (menu, size, quantity) =>
        set((state) => ({
          cart: [...state.cart, { menu, size, quantity }]
        })),
      removeFromCart: (menuId, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.menu.id === menuId && item.size === size)
          )
        })),
      increaseQuantity: (menuId, size) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.menu.id === menuId && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        })),
      decreaseQuantity: (menuId, size) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.menu.id === menuId &&
            item.size === size &&
            item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        })),
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default, 'localStorage' is used
    }
  )
);
