import type { Metadata, Viewport } from "next";
import { studio } from "@/lib/services";
import WebStudio from "@/components/studio/WebStudio";

const title = `${studio.brand} · Websites & digital systems`;

export const metadata: Metadata = {
  title,
  description: studio.intro,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description: studio.intro,
    siteName: studio.brand,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: studio.brand }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: studio.intro,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#f5f2ec" };

export default function Home() {
  return <WebStudio />;
}
