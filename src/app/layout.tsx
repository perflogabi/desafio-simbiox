import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Explorer",
  description: "Explore Magic: The Gathering cards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
