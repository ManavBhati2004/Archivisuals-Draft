/**
 * Narrow numerals whose digits roll vertically when the value changes.
 * Each digit is a 0–9 column translated with a CSS transition (no JS animation).
 */
export function RollingDigits({ value, pad = 2, className = "" }: { value: number; pad?: number; className?: string }) {
  const digits = String(value).padStart(pad, "0").split("");
  return (
    <span className={`t-num inline-flex overflow-hidden leading-none ${className}`} aria-label={String(value).padStart(pad, "0")}>
      {digits.map((d, i) => (
        <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden">
          <span
            className="flex flex-col transition-transform duration-700 ease-[var(--ease-out)] motion-reduce:transition-none"
            style={{ transform: `translateY(${-Number(d) * 10}%)` }}
          >
            {"0123456789".split("").map((n) => (
              <span key={n} className="block h-[1em] leading-none">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
