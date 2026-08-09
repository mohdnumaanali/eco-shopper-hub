import { Leaf } from "lucide-react";

export function EcoRating({ value, size = 16 }: { value: number; size?: number }) {
  const label = `Eco rating ${value} out of 5`;
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Leaf
          key={n}
          aria-hidden="true"
          width={size}
          height={size}
          className={
            n <= value ? "fill-primary text-primary" : "text-muted-foreground/40"
          }
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-muted-foreground">{value}/5</span>
    </div>
  );
}
