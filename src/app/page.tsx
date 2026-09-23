import { Explorer } from "@/components/Explorer/Explorer";
import { PageShell } from "@/components/PageShell/PageShell";
import { sampleCards } from "@/fixtures/sampleCards";

export default function HomePage() {
  return (
    <PageShell>
      <Explorer cards={sampleCards} />
    </PageShell>
  );
}
