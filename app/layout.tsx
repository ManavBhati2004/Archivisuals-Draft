import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { MEDIA_MONO_AT_REST } from "@/lib/motion";
import { Shell } from "@/components/providers/Shell";
import { Footer } from "@/components/shell/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "en_NZ", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NZ" className={`${archivo.variable} ${MEDIA_MONO_AT_REST ? "mono-at-rest" : ""}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide split headings before JS splits them (no flash); no-JS still sees them. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement,h=new Date().getHours();d.classList.add('js');d.dataset.daypart=h>=6&&h<17?'day':'twilight';try{if(sessionStorage.getItem('av-pre')==='1')d.classList.add('preloaded')}catch(e){}",
          }}
        />
      </head>
      <body data-theme="dark">
        <Shell />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
