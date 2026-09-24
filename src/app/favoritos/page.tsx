import type { Metadata } from "next";
import { FavoriteCollection } from "@/components/Favorites/FavoriteCollection";
import { PageShell } from "@/components/PageShell/PageShell";

export const metadata: Metadata = {
  title: "Favoritos — Card Explorer",
  description: "Cartas salvas para consultar de novo no Card Explorer.",
};

export default function FavoritesPage() {
  return (
    <PageShell>
      <FavoriteCollection />
    </PageShell>
  );
}
