import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CART_ADD, CART_CREATE, CART_QUERY, CART_REMOVE, CART_UPDATE, storefrontApiRequest, type Money, type ShopifyProduct } from "@/lib/shopify";

export type CartItem = { lineId: string | null; product: ShopifyProduct; variantId: string; variantTitle: string; price: Money; quantity: number; selectedOptions: Array<{ name: string; value: string }> };
type CartState = { items: CartItem[]; cartId: string | null; checkoutUrl: string | null; isLoading: boolean; isSyncing: boolean; addItem: (item: Omit<CartItem, "lineId">) => Promise<void>; updateQuantity: (variantId: string, quantity: number) => Promise<void>; removeItem: (variantId: string) => Promise<void>; clearCart: () => void; syncCart: () => Promise<void> };
type UserError = { message: string };
const missing = (errors: UserError[]) => errors.some((error) => /not found|does not exist/i.test(error.message));
const checkoutUrl = (value: string) => { const url = new URL(value); url.searchParams.set("channel", "online_store"); return url.toString(); };

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [], cartId: null, checkoutUrl: null, isLoading: false, isSyncing: false,
  clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
  addItem: async (item) => {
    set({ isLoading: true });
    try {
      const state = get();
      const existing = state.items.find((entry) => entry.variantId === item.variantId);
      if (!state.cartId) {
        const data = await storefrontApiRequest<any>(CART_CREATE, { input: { lines: [{ merchandiseId: item.variantId, quantity: item.quantity }] } });
        const cart = data?.cartCreate?.cart; const errors = data?.cartCreate?.userErrors ?? [];
        if (errors.length || !cart?.checkoutUrl) throw new Error(errors[0]?.message ?? "Unable to create cart");
        set({ cartId: cart.id, checkoutUrl: checkoutUrl(cart.checkoutUrl), items: [{ ...item, lineId: cart.lines.edges[0]?.node.id ?? null }] });
      } else if (existing?.lineId) {
        await get().updateQuantity(item.variantId, existing.quantity + item.quantity);
      } else {
        const data = await storefrontApiRequest<any>(CART_ADD, { cartId: state.cartId, lines: [{ merchandiseId: item.variantId, quantity: item.quantity }] });
        const errors = data?.cartLinesAdd?.userErrors ?? [];
        if (missing(errors)) return get().clearCart();
        if (errors.length) throw new Error(errors[0].message);
        const line = data?.cartLinesAdd?.cart?.lines.edges.find((entry: any) => entry.node.merchandise.id === item.variantId);
        set({ items: [...get().items, { ...item, lineId: line?.node.id ?? null }] });
      }
    } finally { set({ isLoading: false }); }
  },
  updateQuantity: async (variantId, quantity) => {
    if (quantity <= 0) return get().removeItem(variantId);
    const state = get(); const item = state.items.find((entry) => entry.variantId === variantId);
    if (!state.cartId || !item?.lineId) return;
    set({ isLoading: true });
    try {
      const data = await storefrontApiRequest<any>(CART_UPDATE, { cartId: state.cartId, lines: [{ id: item.lineId, quantity }] });
      const errors = data?.cartLinesUpdate?.userErrors ?? [];
      if (missing(errors)) return get().clearCart();
      if (errors.length) throw new Error(errors[0].message);
      set({ items: get().items.map((entry) => entry.variantId === variantId ? { ...entry, quantity } : entry) });
    } finally { set({ isLoading: false }); }
  },
  removeItem: async (variantId) => {
    const state = get(); const item = state.items.find((entry) => entry.variantId === variantId);
    if (!state.cartId || !item?.lineId) return;
    set({ isLoading: true });
    try {
      const data = await storefrontApiRequest<any>(CART_REMOVE, { cartId: state.cartId, lineIds: [item.lineId] });
      const errors = data?.cartLinesRemove?.userErrors ?? [];
      if (missing(errors)) return get().clearCart();
      if (errors.length) throw new Error(errors[0].message);
      const remaining = get().items.filter((entry) => entry.variantId !== variantId);
      remaining.length ? set({ items: remaining }) : get().clearCart();
    } finally { set({ isLoading: false }); }
  },
  syncCart: async () => {
    const state = get(); if (!state.cartId || state.isSyncing) return;
    set({ isSyncing: true });
    try { const data = await storefrontApiRequest<any>(CART_QUERY, { id: state.cartId }); if (!data?.cart?.totalQuantity) get().clearCart(); } catch { /* preserve cart through temporary errors */ } finally { set({ isSyncing: false }); }
  },
}), { name: "antoinette-shopify-cart", storage: createJSONStorage(() => localStorage), partialize: (state) => ({ items: state.items, cartId: state.cartId, checkoutUrl: state.checkoutUrl }) }));