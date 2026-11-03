"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { cover } from "@/lib/transition";
import { ui } from "@/lib/ui-store";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * Internal link that plays the triangle cover before navigating. Modified clicks,
 * hash links and same-page links fall through to normal behaviour.
 */
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handle = async (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === pathname) {
      if (!url.search && !url.hash) {
        e.preventDefault();
        ui.closeMenu();
      }
      return;
    }
    e.preventDefault();
    router.prefetch(href);
    await cover();
    ui.set({ menuOpen: false, quoteOpen: false });
    router.push(href, { scroll: false });
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
