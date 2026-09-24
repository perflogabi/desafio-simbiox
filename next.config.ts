import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A imagem de produção copia só o servidor mínimo gerado por esse modo.
  output: "standalone",
  images: {
    // O Scryfall recusa o fetch do otimizador (User-Agent de servidor → 400).
    // A ilustração sai direto do CDN, sem recompressão.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
