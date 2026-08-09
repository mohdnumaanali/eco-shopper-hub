const cache = new Map<string, string>();

type OpenverseResult = { url?: string; thumbnail?: string };

export async function resolveImageUrls(queries: string[]): Promise<Record<string, string>> {
  const output: Record<string, string> = {};
  const pending: string[] = [];

  for (const query of queries) {
    const cached = cache.get(query);
    if (cached) output[query] = cached;
    else pending.push(query);
  }

  await Promise.all(
    pending.map(async (query) => {
      const words = query.split(/[\s,]+/).filter(Boolean);
      // Try the full phrase, then progressively broader terms so every card
      // ends up with a relevant photo.
      const attempts = [words.join(" "), words.slice(0, 2).join(" "), words[0] ?? query];
      for (const term of attempts) {
        if (!term) continue;
        try {
          const response = await fetch(
            `https://api.openverse.org/v1/images/?q=${encodeURIComponent(term)}&page_size=8&mature=false`,
            { headers: { accept: "application/json" } },
          );
          if (!response.ok) continue;
          const payload = (await response.json()) as { results?: OpenverseResult[] };
          const hit = payload.results?.find((item) => item.thumbnail || item.url);
          const url = hit?.thumbnail ?? hit?.url;
          if (url) {
            cache.set(query, url);
            output[query] = url;
            return;
          }
        } catch {
          // try the next, broader term
        }
      }
    }),
  );

  return output;
}
