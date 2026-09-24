import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export function useCartSync() {
  const syncCart = useCartStore((state) => state.syncCart);
  useEffect(() => {
    syncCart();
    const onVisible = () => document.visibilityState === "visible" && syncCart();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [syncCart]);
}