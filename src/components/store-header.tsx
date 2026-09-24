import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/cart-drawer";
import { useCartStore } from "@/stores/cart-store";

export function StoreHeader({ overlay = false }: { overlay?: boolean }) {
  const [cartOpen, setCartOpen] = useState(false);
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  return <>
    <header className={`z-30 flex h-20 items-center justify-between px-5 md:px-10 ${overlay ? "absolute inset-x-0 top-0 text-hero-foreground" : "border-b border-border bg-background text-foreground"}`}>
      <Link to="/" className="font-display text-xl uppercase tracking-normal">Antoinette</Link>
      <nav className="hidden items-center gap-8 text-xs md:flex"><a href="#shop">Shop Art</a><a href="#collections">Collections</a><a href="#atelier">The Archive</a><a href="#story">About</a></nav>
      <div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label="Search"><Search size={17} /></Button><Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)} aria-label={`Cart with ${count} items`}><ShoppingBag size={17} />{count > 0 && <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">{count}</span>}</Button><Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu size={18} /></Button></div>
    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
  </>;
}