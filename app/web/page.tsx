import type { Metadata } from "next";
import { site } from "@/lib/site";
import { studio } from "@/lib/services";
import WebStudio from "@/components/studio/WebStudio";

const title = `${studio.brand} · Websites & digital systems by ${site.name}`;

export const metadata: Metadata = {
  title,
  description: studio.intro,
  alternates: { canonical: "/web/" },
  openGraph: {
    type: "website",
    url: "/web/",
    title,
    description: studio.intro,
    siteName: site.title,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: studio.intro,
    images: ["/og.png"],
  },
};

export default function WebStudioPage() {
  return <WebStudio />;
}
