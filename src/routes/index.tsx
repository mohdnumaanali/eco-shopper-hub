import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Recycle, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";

import heroImage from "@/assets/hero-eco.jpg";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/hooks/useFavorites";
import { productsQuery } from "@/lib/eco";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoShopper — Shop Smarter, Shop Greener" },
      {
        name: "description",
        content:
          "Search everyday products, see sustainability ratings and discover greener alternatives with recycling guidance.",
      },
      { property: "og:title", content: "EcoShopper — Shop Smarter, Shop Greener" },
      {
        property: "og:description",
        content: "Sustainability ratings, eco alternatives and recycling tips for everyday shopping.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { data: featured = [] } = useQuery(productsQuery("", "All"));
  const { favoriteIds, toggleFavorite } = useFavorites();

  const topPicks = featured.filter((p) => p.eco_rating >= 5).slice(0, 3);

  return (
    <Layout>
      <section className="hero-wash">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-xs">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Sustainability ratings for everyday products
            </span>
            <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">
              Shop Smarter, <span className="text-gradient-leaf">Shop Greener</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Search anything you buy regularly. EcoShopper scores it 1–5 leaves, then shows lower-impact
              alternatives with materials and recycling guidance.
            </p>

            <form
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                navigate({ to: "/products", search: { q: term } });
              }}
              role="search"
            >
              <label className="sr-only" htmlFor="hero-search">
                Search products
              </label>
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="hero-search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Try “detergent”, “t-shirt”, “water bottle”"
                  className="h-12 rounded-full bg-card pl-10"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-full px-7">
                Search
              </Button>
            </form>

            <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
              {[
                { label: "Products rated", value: "18" },
                { label: "Greener swaps", value: "10" },
                { label: "Eco tips", value: "12" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-muted-foreground">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold text-primary">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Reusable canvas tote filled with fresh produce, bamboo cutlery and a steel water bottle"
              width={1600}
              height={1008}
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Search, title: "Search", copy: "Find any everyday product in seconds." },
            { icon: ShieldCheck, title: "Compare", copy: "See the eco score, materials and true impact." },
            { icon: Recycle, title: "Swap", copy: "Pick a greener alternative and recycle the old one right." },
          ].map((step) => (
            <div key={step.title} className="surface-card p-6">
              <step.icon aria-hidden="true" className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl">Top-rated greener picks</h2>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/products">Browse all products</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteIds.includes(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
