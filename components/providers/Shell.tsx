"use client";

import { SmoothScroll } from "./SmoothScroll";
import { Header } from "@/components/shell/Header";
import { MenuOverlay } from "@/components/shell/MenuOverlay";
import { Cursor } from "@/components/shell/Cursor";
import { ChapterRail } from "@/components/shell/ChapterRail";
import { SoundToggle } from "@/components/shell/SoundToggle";
import { MobileQuotePill } from "@/components/shell/MobileQuotePill";
import { TransitionLayer } from "@/components/shell/TransitionLayer";
import { QuotePanel } from "@/components/quote/QuotePanel";
import { TabTitle } from "@/components/shell/TabTitle";

/** Client-side chrome that persists across routes. */
export function Shell() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <MenuOverlay />
      <ChapterRail />
      <SoundToggle />
      <MobileQuotePill />
      <QuotePanel />
      <TransitionLayer />
      <Cursor />
      <TabTitle />
    </>
  );
}
