import { Suspense } from "react";
import { Explorer } from "@/components/Explorer/Explorer";
import { PageShell } from "@/components/PageShell/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <main id="conteudo">
            <h1 className="visuallyHidden">Explorar</h1>
          </main>
        }
      >
        <Explorer />
      </Suspense>
    </PageShell>
  );
}
