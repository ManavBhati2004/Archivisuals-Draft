"use client";

import type { ReactNode } from "react";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Magnetic } from "@/components/type/Magnetic";

type Variant = "primary" | "ghost";

type Common = { children: ReactNode; variant?: Variant; magnetic?: boolean; className?: string };
type AsButton = Common & { onClick: () => void; href?: never; external?: never };
type AsLink = Common & { href: string; external?: boolean; onClick?: never };

const base =
  "t-label inline-flex min-h-[48px] items-center justify-center gap-3 px-7 py-4 transition-[background-color,color,border-color] duration-300 ease-[var(--ease-out)]";
const variants: Record<Variant, string> = {
  primary: "bg-fg text-bg border border-fg hover:bg-transparent hover:text-fg",
  ghost: "border border-fg-20 text-fg hover:border-fg",
};

export function Button(props: AsButton | AsLink) {
  const { children, variant = "primary", magnetic = false, className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  let el: ReactNode;
  if ("href" in props && props.href) {
    el = props.external ? (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    ) : (
      <TransitionLink href={props.href} className={cls}>
        {children}
      </TransitionLink>
    );
  } else {
    el = (
      <button type="button" onClick={(props as AsButton).onClick} className={cls}>
        {children}
      </button>
    );
  }
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
