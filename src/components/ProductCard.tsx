import { Link } from "@tanstack/react-router";
import { Heart, ArrowRight } from "lucide-react";

import { EcoRating } from "@/components/EcoRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EcoPhoto } from "@/components/EcoPhoto";
import type { Product } from "@/lib/eco";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
};

export function ProductCard({ product, isFavorite, onToggleFavorite }: Props) {
  return (
    <article className="surface-card group flex flex-col overflow-hidden">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <EcoPhoto
          query={product.image_query}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite?.(product)}
          aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
          aria-pressed={Boolean(isFavorite)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart
            aria-hidden="true"
            className={cn("h-4 w-4", isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground")}
          />
        </button>
        {product.is_alternative && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">Greener pick</Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{product.name}</h3>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</p>
          </div>
          <span className="shrink-0 text-base font-semibold text-primary">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        <EcoRating value={product.eco_rating} />

        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}

        <div className="mt-auto pt-2">
          <Button asChild variant="secondary" className="w-full rounded-full">
            <Link
              to="/alternatives/$productId"
              params={{ productId: product.alternative_for ?? product.id }}
            >
              View alternatives
              <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
