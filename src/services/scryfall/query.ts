import type { CardColorFilter } from "@/types/card";

export function buildSearchQuery(
  query: string,
  color?: CardColorFilter,
): string {
  const parts: string[] = [];
  const text = query.trim();

  if (text.length > 0) {
    parts.push(text);
  }

  if (color === "colorless") {
    parts.push("c:c");
  } else if (color !== undefined) {
    parts.push(`c:${color.toLowerCase()}`);
  }

  return parts.join(" ");
}
