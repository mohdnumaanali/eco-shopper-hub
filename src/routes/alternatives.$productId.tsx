import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Recycle } from "lucide-react";

import { Layout } from "@/components/Layout";
import { EcoRating } from "@/components/EcoRating";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { alternativesQuery, productQuery, type Product } from "@/lib/eco";
import { ecoImage } from "@/lib/images";

export const Route = createFileRoute("/alternatives/$productId")({
  head: () => ({
    meta: [
      { title: "Eco-Friendly Alternatives — EcoShopper" },
      {
        name: "description",
        content:
          "Side-by-side comparison of a product and its greener alternatives: sustainability score, materials and recycling options.",
      },
      { property: "og:title", content: "Eco-Friendly Alternatives — EcoShopper" },
      {
        property: "og:description",
        content: "Compare the original product with lower-impact swaps before you buy.",
      },
    ],
  }),
  component: AlternativesPage,
});

function AlternativesPage() {
  const { productId } = Route.useParams();
  const { data: original, isLoading } = useQuery(productQuery(productId));
  const { data: alternatives = [] } = useQuery(alternativesQuery(productId));
  const { favoriteIds, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <Layout>
        <p className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Loading comparison…</p>
      </Layout>
    );
  }

  if (!original) {
    return (
      <Layout>
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-2xl">Product not found</h1>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/products">Back to search</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const rows: Product[] = [original, ...alternatives];

  return (
    <Layout>
      <section className="hero-wash border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Button asChild variant="ghost" size="sm" className="mb-4 rounded-full">
            <Link to="/products">
              <ArrowLeft aria-hidden="true" className="mr-1 h-4 w-4" />
              Back to search
            </Link>
          </Button>
          <h1 className="text-3xl sm:text-4xl">Greener alternatives to {original.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {alternatives.length > 0
              ? `We found ${alternatives.length} lower-impact swaps. Compare materials, score and end-of-life options below.`
              : "This item is already one of our top-rated picks — no swap needed."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((item) => (
            <article
              key={item.id}
              className={`surface-card overflow-hidden ${item.is_alternative ? "ring-2 ring-primary/40" : ""}`}
            >
              <img
                src={ecoImage(item.image_query, 640, 420)}
                alt={item.name}
                loading="lazy"
                width={640}
                height={420}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.is_alternative ? "Alternative" : "Original"}
                </p>
                <h2 className="text-lg">{item.name}</h2>
                <EcoRating value={item.eco_rating} />
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-base font-semibold text-primary">${Number(item.price).toFixed(2)}</p>
                <Button
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={() => toggleFavorite(item)}
                >
                  {favoriteIds.includes(item.id) ? "Saved" : "Save to favorites"}
                </Button>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mt-14 text-2xl">Comparison table</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Original product compared with eco-friendly alternatives</caption>
            <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Product</th>
                <th scope="col" className="px-4 py-3">Sustainability</th>
                <th scope="col" className="px-4 py-3">Material</th>
                <th scope="col" className="px-4 py-3">Recycling</th>
                <th scope="col" className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-4 font-medium">
                    {item.name}
                    {!item.is_alternative && (
                      <span className="ml-2 text-xs text-muted-foreground">(original)</span>
                    )}
                  </th>
                  <td className="px-4 py-4">
                    <EcoRating value={item.eco_rating} size={14} />
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{item.material}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <span className="inline-flex items-start gap-2">
                      <Recycle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item.recycling}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold">${Number(item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
