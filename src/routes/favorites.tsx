import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { productsQuery } from "@/lib/eco";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Favorites — EcoShopper" },
      { name: "description", content: "The eco-friendly products you saved on EcoShopper." },
      { property: "og:title", content: "Your Favorites — EcoShopper" },
      { property: "og:description", content: "Your saved greener product picks." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, loading } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { data: products = [] } = useQuery(productsQuery("", "All"));
  const saved = products.filter((product) => favoriteIds.includes(product.id));

  return (
    <Layout>
      <section className="hero-wash border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl sm:text-4xl">Your favorites</h1>
          <p className="mt-2 text-sm text-muted-foreground">Greener products you've saved for later.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !user ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Sign in to save and revisit your favorite products.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        ) : saved.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No favorites yet — tap the heart on any product.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
