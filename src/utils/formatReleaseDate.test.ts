import { describe, expect, it } from "vitest";
import { formatReleaseDate } from "./formatReleaseDate";

describe("formatReleaseDate", () => {
  it("formats a Scryfall date in Portuguese", () => {
    expect(formatReleaseDate("2024-09-27")).toBe("27 de setembro de 2024");
  });

  it("rejects an incomplete date", () => {
    expect(formatReleaseDate("2024-09")).toBeNull();
    expect(formatReleaseDate("2024-02-31")).toBeNull();
  });
});
