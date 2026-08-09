/**
 * Auto-fetch imagery from the internet by keyword — no manual uploads.
 * LoremFlickr serves keyword-matched Creative Commons photos from Flickr.
 */
export function ecoImage(query: string, width = 640, height = 480): string {
  const keywords = query
    .split(/[\s,]+/)
    .filter(Boolean)
    .join(",");
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keywords)}?lock=${hash(keywords)}`;
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 100000;
  }
  return h;
}
