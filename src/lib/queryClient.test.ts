import { describe, expect, it } from "vitest";
import { createQueryClient } from "./queryClient";

describe("createQueryClient", () => {
  it("configures cache and retry for remote card data", () => {
    const client = createQueryClient();
    const queries = client.getDefaultOptions().queries;

    expect(queries?.staleTime).toBe(5 * 60 * 1000);
    expect(queries?.gcTime).toBe(30 * 60 * 1000);
    expect(queries?.retry).toBe(1);
    expect(queries?.refetchOnWindowFocus).toBe(false);
  });

  it("returns an isolated client on each call", () => {
    const first = createQueryClient();
    const second = createQueryClient();

    expect(first).not.toBe(second);
  });
});
