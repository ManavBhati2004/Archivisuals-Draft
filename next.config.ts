import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components keeps visited routes mounted (hidden) via React Activity, which fights
  // GSAP/ScrollTrigger lifecycles and the page-transition model. The site is fully static,
  // so the classic App Router behaviour is the better fit.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
