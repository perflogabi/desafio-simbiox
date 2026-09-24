import { Suspense } from "react";
import { Explorer } from "@/components/Explorer/Explorer";
import styles from "@/components/Explorer/Explorer.module.css";
import { PageShell } from "@/components/PageShell/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <main id="conteudo">
            <h1 className={styles.title}>Compêndio</h1>
          </main>
        }
      >
        <Explorer />
      </Suspense>
    </PageShell>
  );
}
