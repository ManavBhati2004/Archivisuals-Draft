/** Small film-slate label, e.g. "01 — ARRIVAL". */
export function Slate({ index, children, className = "" }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`t-label flex items-center gap-3 text-fg-60 ${className}`}>
      {index && <span className="t-num text-fg">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-fg-40" />}
      <span>{children}</span>
    </p>
  );
}
