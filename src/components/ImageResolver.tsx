import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { resolveImages } from "@/lib/image-search.functions";
import { ecoImage } from "@/lib/images";

const ImageContext = createContext<Record<string, string>>({});

/** Resolves keyword queries to real photos fetched from the open web (Openverse). */
export function ImageResolverProvider({
  queries,
  children,
}: {
  queries: string[];
  children: ReactNode;
}) {
  const unique = useMemo(() => Array.from(new Set(queries)).sort(), [queries]);
  const { data } = useQuery({
    queryKey: ["images", unique],
    enabled: unique.length > 0,
    staleTime: 1000 * 60 * 60,
    queryFn: () => resolveImages({ data: { queries: unique } }),
  });

  return <ImageContext.Provider value={data ?? {}}>{children}</ImageContext.Provider>;
}

export function useResolvedImage(query: string, width = 640, height = 480) {
  const map = useContext(ImageContext);
  return map[query] ?? ecoImage(query, width, height);
}
