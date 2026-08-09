import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import { productsQuery } from "@/lib/eco";

type ProductSearch = { q?: string };

const CATEGORIES = [
  "All",
  "Apparel",
  "Home",
  "Kitchen",
  "Drinkware",
  "Personal Care",
  "Accessories",
  "Electronics",
];

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Product Search — EcoShopper" },
      {
        name: "description",
        content: "Search products and compare 1–5 leaf sustainability ratings, prices and materials.",
      },
      { property: "og:title", content: "Product Search — EcoShopper" },
      { property: "og:description", content: "Compare sustainability ratings across everyday products." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [term, setTerm] = useState(q ?? "");
  const [category, setCategory] = useState("All");

  const { data: products = [], isLoading } = useQuery(productsQuery(q ?? "", category));
  const { favoriteIds, toggleFavorite } = useFavorites();

  return (
    <Layout>
      <section className="hero-wash border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl sm:text-4xl">Product search</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Every product is scored on materials, packaging and end-of-life recyclability.
          </p>

          <form
            role="search"
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ search: { q: term } });
            }}
          >
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="product-search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search products, materials or categories"
                className="h-12 rounded-full bg-card pl-10"
              />
            </div>
            <Button type="submit" className="h-12 rounded-full px-7">
              Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={category === item ? "default" : "outline"}
                aria-pressed={category === item}
                className="rounded-full bg-card/60 data-[state=on]:bg-primary"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No products matched that search. Try “bottle”, “cotton” or “detergent”.
          </p>
        ) : (
          <>
            <p className="mb-5 text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
