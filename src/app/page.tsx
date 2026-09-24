import { Suspense } from "react";
import { Explorer } from "@/components/Explorer/Explorer";
import { PageShell } from "@/components/PageShell/PageShell";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <PageShell>
      <QueryProvider>
        <Suspense
          fallback={
            <main id="conteudo">
              <h1 className="visuallyHidden">Explorar</h1>
            </main>
          }
        >
          <Explorer />
        </Suspense>
      </QueryProvider>
    </PageShell>
  );
}
