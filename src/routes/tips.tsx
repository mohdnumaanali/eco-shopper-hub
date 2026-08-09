import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { tipsQuery } from "@/lib/eco";
import { ecoImage } from "@/lib/images";

const CATEGORIES = ["All", "Reduce", "Reuse", "Recycle", "Sustainable Brands"];

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Eco Tips — Reduce, Reuse, Recycle | EcoShopper" },
      {
        name: "description",
        content:
          "Practical eco-friendly shopping tips across reduce, reuse, recycle and choosing genuinely sustainable brands.",
      },
      { property: "og:title", content: "Eco Tips — Reduce, Reuse, Recycle" },
      { property: "og:description", content: "Practical everyday tips for shopping and living more sustainably." },
    ],
  }),
  component: TipsPage,
});

function TipsPage() {
  const [category, setCategory] = useState("All");
  const { data: tips = [] } = useQuery(tipsQuery());
  const visible = category === "All" ? tips : tips.filter((tip) => tip.category === category);

  return (
    <Layout>
      <section className="hero-wash border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl sm:text-4xl">Eco tips</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Small habits, compounding impact. Filter by the part of the loop you want to improve.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter tips by category">
            {CATEGORIES.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "default" : "outline"}
                aria-pressed={category === item}
                className="rounded-full bg-card/60"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((tip) => (
            <article key={tip.id} className="surface-card overflow-hidden">
              <img
                src={ecoImage(tip.image_query, 640, 420)}
                alt={tip.title}
                loading="lazy"
                width={640}
                height={420}
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">{tip.category}</p>
                <h2 className="mt-2 text-lg">{tip.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{tip.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
