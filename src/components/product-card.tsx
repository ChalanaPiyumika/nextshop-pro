import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const variant = product.node.variants.edges.find((entry) => entry.node.availableForSale)?.node;
  const image = product.node.images.edges[0]?.node;
  return <article className="group">
    <Link to="/product/$handle" params={{ handle: product.node.handle }} className="block aspect-[4/5] overflow-hidden bg-muted">
      {image ? <img src={image.url} alt={image.altText ?? product.node.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Artwork image coming soon</div>}
    </Link>
    <div className="flex items-start justify-between gap-3 pt-4"><div><Link to="/product/$handle" params={{ handle: product.node.handle }} className="font-display text-lg">{product.node.title}</Link><p className="mt-1 text-xs text-muted-foreground">From {formatMoney(product.node.priceRange.minVariantPrice)}</p></div><Button size="icon" variant="outline" disabled={!variant || isLoading} aria-label={`Add ${product.node.title} to cart`} onClick={() => variant && addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions })}><ShoppingBag size={15} /></Button></div>
  </article>;
}