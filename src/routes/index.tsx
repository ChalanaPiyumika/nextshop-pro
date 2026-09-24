import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Instagram } from "lucide-react";
import heroImage from "@/assets/atelier-hero.jpg";
import galleryImage from "@/assets/atelier-gallery.jpg";
import studioImage from "@/assets/atelier-studio.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { StoreHeader } from "@/components/store-header";
import { useCartSync } from "@/hooks/use-cart-sync";
import { getProducts } from "@/lib/shopify";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Antoinette Atelier | Art for considered spaces" },
    { name: "description", content: "Discover curated canvas art, sculpture and atelier objects chosen for calm, tactile interiors." },
    { property: "og:title", content: "Antoinette Atelier | Art for considered spaces" },
    { property: "og:description", content: "Discover curated canvas art, sculpture and atelier objects chosen for calm, tactile interiors." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  useCartSync();
  const { data: products = [], isLoading, error } = useQuery({ queryKey: ["products"], queryFn: () => getProducts(12) });
  return (
    <main>
      <section className="relative min-h-[680px] overflow-hidden text-hero-foreground md:min-h-[760px]">
        <img src={heroImage} width={1920} height={1104} alt="A calm interior curated by Antoinette Atelier" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-shade" />
        <StoreHeader overlay />
        <div className="relative z-10 flex min-h-[680px] max-w-7xl items-end px-5 pb-14 md:min-h-[760px] md:items-center md:px-10 md:pb-0"><div className="max-w-xl"><p className="mb-4 text-xs uppercase">The Autumn Edit · 2026</p><h1 className="font-display text-5xl leading-[1.06] md:text-7xl">Art for rooms<br />that breathe.</h1><p className="mt-6 max-w-md text-sm leading-6">Quietly expressive works, sculptural objects and limited editions selected for thoughtful interiors.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild><a href="#shop">Shop the collection</a></Button><Button asChild variant="secondary"><a href="#story">Our philosophy</a></Button></div></div></div>
      </section>

      <section id="collections" className="grid md:grid-cols-3">
        {[{ title: "Canvas", image: heroImage }, { title: "Sculpture", image: galleryImage }, { title: "Atelier Objects", image: studioImage }].map((item, index) => <a href="#shop" key={item.title} className="group relative aspect-[4/3] overflow-hidden border-background md:border-r"><img src={item.image} loading="lazy" width={1600} height={912} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-image-shade" /><div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground"><p className="font-display text-2xl">{item.title}</p><span className="mt-2 flex items-center gap-2 text-[10px] uppercase">Explore {String(index + 1).padStart(2, "0")} <ArrowRight size={12} /></span></div></a>)}
      </section>

      <section id="shop" className="px-5 py-20 md:px-10 md:py-28"><div className="mx-auto max-w-7xl"><div className="mb-12 flex items-end justify-between"><div><p className="mb-3 text-xs uppercase text-muted-foreground">Recently selected</p><h2 className="font-display text-4xl md:text-5xl">New arrivals</h2></div><a href="#shop" className="hidden items-center gap-2 border-b border-foreground pb-1 text-xs uppercase md:flex">View all <ArrowRight size={13} /></a></div>{isLoading ? <div className="grid grid-cols-2 gap-5 md:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="aspect-[4/5] animate-pulse bg-muted" />)}</div> : error ? <p className="py-16 text-center text-muted-foreground">We couldn’t load the collection. Please try again shortly.</p> : products.length ? <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-3">{products.map((product) => <ProductCard key={product.node.id} product={product} />)}</div> : <p className="py-16 text-center text-muted-foreground">No products found.</p>}</div></section>

      <section id="atelier" className="grid bg-ink text-ink-foreground lg:grid-cols-[.8fr_1.2fr]"><div className="flex flex-col justify-center px-6 py-16 md:px-14"><p className="mb-5 text-xs uppercase text-ink-muted">Collection I</p><h2 className="font-display text-4xl leading-tight md:text-5xl">After Midnight</h2><p className="mt-6 max-w-md text-sm leading-6 text-ink-muted">An exploration of restraint and gesture. Monochrome works that bring rhythm, depth and a meditative stillness to the room.</p><a href="#shop" className="mt-8 flex w-fit items-center gap-2 border-b border-ink-foreground pb-1 text-xs uppercase">Shop the collection <ArrowRight size={13} /></a></div><img src={galleryImage} width={1600} height={912} loading="lazy" alt="Antoinette monochrome collection in a gallery" className="h-full min-h-[420px] w-full object-cover" /></section>

      <section className="px-5 py-24 text-center md:py-32"><blockquote className="mx-auto max-w-4xl font-display text-3xl leading-tight md:text-5xl">Minimalist art with a focus on tactility, quality and the quiet power of a well-made object.</blockquote><p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground">We believe in pieces that settle into a home slowly, gaining meaning through daily life and becoming part of its architecture.</p></section>

      <section id="story" className="grid bg-earth text-earth-foreground lg:grid-cols-[1.25fr_.75fr]"><img src={studioImage} width={1600} height={912} loading="lazy" alt="The light-filled Antoinette artist studio" className="h-full min-h-[440px] w-full object-cover" /><div className="flex flex-col justify-center px-6 py-16 md:px-14"><p className="mb-4 text-xs uppercase">Inside the atelier</p><h2 className="font-display text-4xl">The art of living</h2><p className="mt-5 max-w-md text-sm leading-6">We work with independent artists and makers who share our reverence for honest materials, patient processes and enduring forms.</p><a href="#story" className="mt-8 flex w-fit items-center gap-2 border-b border-earth-foreground pb-1 text-xs uppercase">Read our story <ArrowRight size={13} /></a></div></section>

      <footer className="bg-ink px-5 py-14 text-ink-foreground md:px-10"><div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]"><div><p className="font-display text-2xl uppercase">Antoinette</p><p className="mt-5 max-w-xs text-xs leading-5 text-ink-muted">Art and objects selected for spaces with soul. Designed to remain, made to be lived with.</p></div><div><p className="text-xs uppercase">Shop</p><div className="mt-4 grid gap-2 text-xs text-ink-muted"><a href="#shop">Shop all</a><a href="#collections">New arrivals</a><a href="#collections">Art editions</a></div></div><div><p className="text-xs uppercase">Atelier</p><div className="mt-4 grid gap-2 text-xs text-ink-muted"><a href="#story">About</a><a href="#atelier">The archive</a><a href="mailto:studio@antoinetteatelier.com">Contact</a></div></div><div><p className="text-xs uppercase">Stay in touch</p><p className="mt-4 text-xs text-ink-muted">Notes from the studio and first access to new work.</p><form className="mt-4 flex" onSubmit={(event) => event.preventDefault()}><input aria-label="Email address" type="email" placeholder="Email address" className="min-h-11 min-w-0 flex-1 border border-input bg-background px-3 text-xs text-foreground outline-none" /><Button type="submit" variant="secondary">Subscribe</Button></form><a href="https://instagram.com" aria-label="Instagram" className="mt-6 inline-flex"><Instagram size={16} /></a></div></div></footer>
    </main>
  );
}
