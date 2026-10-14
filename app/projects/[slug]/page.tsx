import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectBySlug, projectPath, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import ProjectShowcase from "@/components/showcase/ProjectShowcase";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  const title = `${project.title} · ${site.name}`;
  const url = projectPath(project.slug);
  return {
    title,
    description: project.line,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: project.line,
      siteName: site.title,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.line,
      images: ["/og.png"],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  if (!projectBySlug(slug)) notFound();
  return <ProjectShowcase slug={slug} />;
}
