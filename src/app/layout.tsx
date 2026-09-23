import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Explorer",
  description: "Explore Magic: The Gathering cards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <a className="skipLink" href="#conteudo">
            Ir para o conteúdo
          </a>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
