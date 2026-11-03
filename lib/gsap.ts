"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  if (process.env.NODE_ENV !== "production") Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
