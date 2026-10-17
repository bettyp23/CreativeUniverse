"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";
import { Mark } from "./Mark";
import { ContactForm } from "./ContactForm";

/** A short About panel: what I make and how I think, plus where to find me. */
export function AboutPanel() {
  const about = useUniverse((s) => s.about);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (about) {
      setShown(true);
      const t = setTimeout(() => setOpen(true), 30);
      return () => clearTimeout(t);
    }
    setOpen(false);
    const t = setTimeout(() => setShown(false), 600);
    return () => clearTimeout(t);
  }, [about]);

  useEffect(() => {
    if (open) backRef.current?.focus({ preventScroll: true });
  }, [open]);

  if (!shown) return null;
  const { about: copy, links } = site;

  return (
    <section
      className="panel panel--about"
      data-open={open}
      aria-labelledby="about-title"
      style={{ "--node": "#c26bff", "--accent": "#ff5fa2" } as React.CSSProperties}
    >
      <div className="panel__scroll">
        <button ref={backRef} className="panel__back" onClick={() => goTo(null)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Overview
        </button>

        <header className="panel__header">
          <Mark size={40} className="about__mark" />
          <h2 id="about-title" className="panel__title">{copy.title}</h2>
          <p className="panel__tagline">{copy.intro}</p>
        </header>

        <h3 className="about__heading">How I think</h3>
        <ul className="about__list">
          {copy.principles.map((p) => (
            <li key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>

        {site.contact.formspreeId && <ContactForm formId={site.contact.formspreeId} />}

        <footer className="about__links">
          {links.github && (
            <a className="pill-link" href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {links.linkedin && (
            <a className="pill-link" href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {links.email && (
            <a className="pill-link" href={`mailto:${links.email}`}>
              Email
            </a>
          )}
        </footer>
      </div>
    </section>
  );
}
