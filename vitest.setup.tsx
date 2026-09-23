import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => {
    return (
      // The mock stands in for next/image, so a plain img is intentional.
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} src={src} />
    );
  },
}));
