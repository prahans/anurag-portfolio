import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Fraunces, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";
import "@/components/sections/sections.css";
import "@/components/sections/featured-projects.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const editorial = Fraunces({ variable: "--font-editorial", subsets: ["latin"], display: "swap", weight: ["500", "600"] });
const expressive = Instrument_Serif({ variable: "--font-expressive", subsets: ["latin"], weight: "400", style: "italic", display: "swap" });
const handwriting = Caveat({ variable: "--font-handwriting", subsets: ["latin"], weight: ["400", "600"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-code", subsets: ["latin"], weight: "400", display: "swap", preload: false });

export const metadata: Metadata = {
  title: `${site.name} — Creative Full-Stack Developer`,
  description: "Explore the projects and process of a full-stack developer in Nepal, building thoughtful web apps across frontend, backend, and AI-assisted tools.",
  applicationName: "Anurag Panuhar Portfolio",
  authors: [{ name: site.name, url: site.github }],
  openGraph: {
    title: `${site.name} — Creative Full-Stack Developer`,
    description: "Thoughtful web apps, practical problem-solving, and curious experiments. A full-stack developer building from Nepal.",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary", title: `${site.name} — Creative Full-Stack Developer` },
};

export const viewport: Viewport = { themeColor: "#F7F5EF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${editorial.variable} ${expressive.variable} ${handwriting.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
