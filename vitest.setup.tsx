import { cleanup, configure } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { resetSearchParams } from "./src/test/navigationState";

configure({ asyncUtilTimeout: 4_000 });

afterEach(() => {
  cleanup();
  resetSearchParams();
  window.localStorage.clear();
});

vi.mock("next/navigation", async () => {
  const React = await import("react");
  const navigation = await import("./src/test/navigationState");
  const router = {
    replace: (url: string) => {
      const query = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
      navigation.resetSearchParams(query);
    },
  };

  return {
    usePathname: () => "/",
    useRouter: () => router,
    useSearchParams: () =>
      React.useSyncExternalStore(
        navigation.subscribeSearchParams,
        navigation.getSearchParams,
        navigation.getSearchParams,
      ),
  };
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
