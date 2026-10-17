"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projectBySlug, projectPath, projects } from "@/lib/projects";
import { sectionById } from "@/lib/sections";
import { site } from "@/lib/site";
import { useUniverse } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/useNavigation";
import { ARTIFACT_PALETTE } from "@/components/artifacts/palette";
import { Mark } from "@/components/ui/Mark";

const ShowcaseHero = dynamic(() => import("./ShowcaseHero"), { ssr: false });

export default function ProjectShowcase({ slug }: { slug: string }) {
  const router = useRouter();
  const project = projectBySlug(slug)!;
  const section = sectionById(project.section);
  const color = ARTIFACT_PALETTE[project.type];
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  // Arriving: lift the fade left over from the universe.
  useEffect(() => {
    const t = setTimeout(() => useUniverse.getState().setWarp(false), 60);
    return () => clearTimeout(t);
  }, []);

  /** Leave with the same fade we arrived with. */
  const leave = (href: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    useUniverse.getState().setWarp(true);
    setTimeout(() => router.push(href), prefersReducedMotion() ? 0 : 450);
  };

  const home = `/#${section.id}`;

  return (
    <div className="showcase" style={{ "--node": color, "--accent": section.accent } as React.CSSProperties}>
      <header className="showcase__bar">
        <Link className="nav__brand" href="/" onClick={leave("/")}>
          <Mark className="nav__mark" size={26} />
          <span>{site.name}</span>
        </Link>
        <Link className="panel__back" href={home} onClick={leave(home)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to {section.title}
        </Link>
      </header>

      <section className="showcase__hero">
        <div className="showcase__stage">
          <ShowcaseHero project={project} />
        </div>
        <div className="showcase__intro">
          <p className="showcase__eyebrow">{section.title}</p>
          <h1 className="showcase__title">{project.title}</h1>
          <p className="showcase__line">{project.line}</p>
        </div>
      </section>

      <article className="showcase__body">
        <section className="showcase__block">
          <h2>The problem</h2>
          <p>{project.problem}</p>
        </section>

        <section className="showcase__block">
          <h2>What I built</h2>
          <p>{project.built}</p>
        </section>

        <section className="showcase__block">
          <h2>The tech</h2>
          <ul className="showcase__tags">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {project.screenshots.length > 0 && (
          <section className="showcase__block showcase__block--wide">
            <h2>Screenshots</h2>
            <div className="showcase__shots">
              {project.screenshots.map((s) => (
                <figure key={s.src} className="shot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        )}

        {(project.demo || project.github) && (
          <section className="showcase__block">
            <h2>See it</h2>
            <div className="showcase__links">
              {project.demo && (
                <a className="cta" href={project.demo} target="_blank" rel="noreferrer">
                  Live demo
                </a>
              )}
              {project.github && (
                <a className="pill-link" href={project.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </section>
        )}

        <footer className="showcase__footer">
          <Link
            className="panel__next"
            href={projectPath(next.slug)}
            onClick={leave(projectPath(next.slug))}
            style={{ "--next": ARTIFACT_PALETTE[next.type] } as React.CSSProperties}
          >
            <span className="panel__next-label">Next project</span>
            <span className="panel__next-title">{next.title}</span>
          </Link>
          <Link className="panel__esc" href={home} onClick={leave(home)}>
            Back to overview
          </Link>
        </footer>
      </article>
    </div>
  );
}
