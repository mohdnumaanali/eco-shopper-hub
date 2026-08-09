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
      const term = query.split(/[\s,]+/).filter(Boolean).join(" ");
      try {
        const response = await fetch(
          `https://api.openverse.org/v1/images/?q=${encodeURIComponent(term)}&page_size=6&mature=false&aspect_ratio=wide`,
          { headers: { accept: "application/json" } },
        );
        if (!response.ok) return;
        const payload = (await response.json()) as { results?: OpenverseResult[] };
        const hit = payload.results?.find((item) => item.thumbnail || item.url);
        const url = hit?.thumbnail ?? hit?.url;
        if (url) {
          cache.set(query, url);
          output[query] = url;
        }
      } catch {
        // fall back to the keyword placeholder on the client
      }
    }),
  );

  return output;
}
