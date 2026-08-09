import { useQuery } from "@tanstack/react-query";

import { resolveImages } from "@/lib/image-search.functions";
import { ecoImage } from "@/lib/images";

/**
 * Resolves a keyword query to a real photo fetched automatically from the open
 * web (Openverse). Falls back to a keyword placeholder while loading/on error.
 */
export function useEcoPhoto(query: string, width = 640, height = 480) {
  const { data } = useQuery({
    queryKey: ["eco-photo", query],
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    queryFn: () => resolveImages({ data: { queries: [query] } }),
  });
  return data?.[query] ?? ecoImage(query, width, height);
}
