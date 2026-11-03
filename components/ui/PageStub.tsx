import { SplitLines } from "@/components/type/SplitLines";
import { Slate } from "@/components/type/Slate";

/** Phase 1 placeholder page: hero heading + a note on which phase builds it. */
export function PageStub({ title, line, phase, slate }: { title: string; line: string; phase: number; slate: string }) {
  return (
    <section data-chapter={slate} className="wrap section flex min-h-[90svh] flex-col justify-end pt-[calc(var(--header-h)+10vh)]">
      <Slate index="01">{slate}</Slate>
      <SplitLines as="h1" immediate className="t-display mt-8 max-w-[12ch]">
        {title}
      </SplitLines>
      <p className="t-body mt-10">{line}</p>
      <p className="t-label mt-16 text-fg-40">Built in Phase {phase}</p>
    </section>
  );
}
