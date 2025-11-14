const ICON_PATTERN = /::[A-Za-z][A-Za-z0-9]*::/g;

export const normalizeHeadingText = (value: string) =>
  value
    .replace(ICON_PATTERN, " ")
    .replace(/\s+/g, " ")
    .replace(/^-+\s*/, "")
    .trim();

const baseSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export type Slugger = (value: string) => string;

export function createSlugger(): Slugger {
  const counts = new Map<string, number>();
  return (value: string) => {
    const normalized = normalizeHeadingText(value);
    const slug = baseSlug(normalized || "section");
    const current = counts.get(slug) ?? 0;
    counts.set(slug, current + 1);
    return current ? `${slug}-${current}` : slug;
  };
}
