import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { PageShell } from "@/components/PageShell/PageShell";
import { SectionRule } from "@/components/SectionRule/SectionRule";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Favoritos — Card Explorer",
  description: "Cartas salvas para consultar de novo no Card Explorer.",
};

export default function FavoritesPage() {
  return (
    <PageShell>
      <main id="conteudo">
        <p className={styles.eyebrow}>Coleção</p>
        <h1 className={styles.title}>Favoritos</h1>
        <SectionRule />
        <EmptyState
          title="Nenhum favorito ainda"
          description="Salve cartas nos resultados da busca."
          action={<Link href="/">Voltar para explorar</Link>}
        />
      </main>
    </PageShell>
  );
}
