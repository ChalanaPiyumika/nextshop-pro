import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreHeader } from "@/components/store-header";
import { useCartSync } from "@/hooks/use-cart-sync";
import { formatMoney, getProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({ meta: [
    { title: `${params.handle.replaceAll("-", " ")} | Antoinette Atelier` },
    { name: "description", content: "View this curated work from Antoinette Atelier." },
    { property: "og:title", content: `${params.handle.replaceAll("-", " ")} | Antoinette Atelier` },
    { property: "og:description", content: "View this curated work from Antoinette Atelier." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductPage,
});

function ProductPage() {
  useCartSync();
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", handle], queryFn: () => getProduct(handle) });
  const addItem = useCartStore((state) => state.addItem);
  const cartLoading = useCartStore((state) => state.isLoading);
  if (isLoading) return <><StoreHeader /><div className="mx-auto grid min-h-[70vh] max-w-7xl animate-pulse gap-8 px-5 py-10 md:grid-cols-2"><div className="bg-muted" /><div className="bg-muted" /></div></>;
  if (!product) return <><StoreHeader /><div className="flex min-h-[70vh] flex-col items-center justify-center"><h1 className="font-display text-4xl">Artwork not found</h1><Button asChild className="mt-6"><Link to="/">Return home</Link></Button></div></>;
  const variant = product.node.variants.edges.find((entry) => entry.node.availableForSale)?.node;
  const image = product.node.images.edges[0]?.node;
  return <main><StoreHeader /><div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-2 md:px-10 md:py-16"><div className="aspect-[4/5] overflow-hidden bg-muted">{image && <img src={image.url} alt={image.altText ?? product.node.title} className="h-full w-full object-cover" />}</div><div className="flex flex-col justify-center md:px-8"><Link to="/" className="mb-10 flex items-center gap-2 text-xs uppercase text-muted-foreground"><ArrowLeft size={13} /> Back to collection</Link><p className="mb-4 text-xs uppercase text-muted-foreground">Antoinette selection</p><h1 className="font-display text-4xl leading-tight md:text-6xl">{product.node.title}</h1><p className="mt-6 font-display text-xl">{formatMoney(product.node.priceRange.minVariantPrice)}</p><p className="mt-8 max-w-lg text-sm leading-7 text-muted-foreground">{product.node.description || "A considered work selected for its materiality, balance and quiet presence."}</p><Button className="mt-10 w-full md:w-fit" disabled={!variant || cartLoading} onClick={() => variant && addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions })}><ShoppingBag size={16} />{variant ? (cartLoading ? "Adding…" : "Add to collection") : "Sold out"}</Button><div className="mt-10 grid gap-3 border-t border-border pt-6 text-xs text-muted-foreground"><p>Secure checkout through Shopify</p><p>Carefully packed and dispatched from the atelier</p></div></div></div></main>;
}