import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, checkoutUrl, isLoading, syncCart, updateQuantity, removeItem } = useCartStore();
  useEffect(() => { if (open) syncCart(); }, [open, syncCart]);
  const total = items.reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0);
  const currencyCode = items[0]?.price.currencyCode ?? "USD";
  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-overlay transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-gallery transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} aria-label="Shopping cart">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <div><p className="font-display text-2xl">Your collection</p><p className="mt-1 text-xs text-muted-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart"><X size={20} /></Button>
        </header>
        <div className="flex-1 overflow-y-auto py-4">
          {!items.length ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag className="mb-4 text-muted-foreground" /><p className="font-display text-xl">Your cart is empty</p></div> : items.map((item) => (
            <article key={item.variantId} className="grid grid-cols-[76px_1fr_auto] gap-4 border-b border-border py-5">
              <div className="aspect-[4/5] overflow-hidden bg-muted">{item.product.node.images.edges[0]?.node.url && <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="h-full w-full object-cover" />}</div>
              <div><h3 className="text-sm font-semibold">{item.product.node.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.variantTitle !== "Default Title" ? item.variantTitle : "Edition print"}</p><p className="mt-2 text-sm">{formatMoney(item.price)}</p><div className="mt-3 flex items-center"><Button variant="outline" size="sm" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={12} /></Button><span className="w-9 text-center text-xs">{item.quantity}</span><Button variant="outline" size="sm" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Increase quantity"><Plus size={12} /></Button></div></div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.variantId)} aria-label="Remove item"><Trash2 size={16} /></Button>
            </article>
          ))}
        </div>
        {!!items.length && <footer className="border-t border-border pt-5"><div className="mb-5 flex justify-between font-display text-xl"><span>Subtotal</span><span>{new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(total)}</span></div><Button className="w-full" disabled={isLoading || !checkoutUrl} onClick={() => checkoutUrl && window.open(checkoutUrl, "_blank", "noopener,noreferrer")}>{isLoading ? "Updating…" : "Checkout securely"}</Button><p className="mt-3 text-center text-[10px] text-muted-foreground">Shipping and taxes calculated at checkout.</p></footer>}
      </aside>
    </div>
  );
}