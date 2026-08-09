import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ queries: z.array(z.string().min(1).max(80)).max(40) });

export const resolveImages = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { resolveImageUrls } = await import("./image-search.server");
    return resolveImageUrls(data.queries);
  });
