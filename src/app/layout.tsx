import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Explorer",
  description: "Explore Magic: The Gathering cards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>
        <link
          rel="preconnect"
          href="https://api.scryfall.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cards.scryfall.io" />
        <a className="skipLink" href="#conteudo">
          Ir para o conteúdo
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
