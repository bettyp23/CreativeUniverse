"use client";

import { useEffect, useRef, useState } from "react";
import { projectBySlug, projectsIn } from "@/lib/projects";
import { useUniverse } from "@/lib/store";
import { openProject } from "@/lib/useNavigation";

type Mode = "desktop" | "mobile";

/** Move the preview to the previous or next site in the gallery. */
function step(d: number) {
  const { preview, setPreview } = useUniverse.getState();
  const list = projectsIn("web");
  const idx = list.findIndex((p) => p.slug === preview);
  if (idx < 0) return;
  setPreview(list[(idx + d + list.length) % list.length].slug);
}

/**
 * The Web Gallery's preview window: a browser-style frame that shows the live
 * site when it allows embedding, or a scrollable full-page capture when it doesn't.
 */
export function GalleryViewer() {
  const preview = useUniverse((s) => s.preview);
  const setPreview = useUniverse((s) => s.setPreview);
  const [shown, setShown] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("desktop");
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (preview) {
      setShown(preview);
      setLoaded(false);
      const t = setTimeout(() => setOpen(true), 20);
      return () => clearTimeout(t);
    }
    setOpen(false);
    const t = setTimeout(() => setShown(null), 450);
    return () => clearTimeout(t);
  }, [preview]);

  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Phones always get the mobile layout.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    if (mq.matches) setMode("mobile");
  }, []);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  if (!shown) return null;
  const project = projectBySlug(shown)!;
  const url = project.demo ?? "";
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setLoaded(false);
    setMode(m);
  };

  return (
    <div className="viewer" data-open={open}>
      <div className="viewer__backdrop" onClick={() => setPreview(null)} aria-hidden />
      <section className="viewer__window" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
        <header className="viewer__bar">
          <span className="viewer__dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="viewer__url" title={url}>
            {host}
          </span>
          <div className="viewer__modes" role="group" aria-label="Preview size">
            {(["desktop", "mobile"] as Mode[]).map((m) => (
              <button key={m} aria-pressed={mode === m} onClick={() => switchMode(m)}>
                {m === "desktop" ? "Desktop" : "Mobile"}
              </button>
            ))}
          </div>
          <div className="viewer__nav">
            <button onClick={() => step(-1)} aria-label="Previous site">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => step(1)} aria-label="Next site">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button ref={closeRef} onClick={() => setPreview(null)} aria-label="Close preview">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <div className="viewer__body" data-mode={mode}>
          <div className="viewer__screen">
            {project.embed ? (
              <>
                {!loaded && <span className="viewer__loading">Loading {project.title}…</span>}
                <iframe
                  key={`${shown}-${mode}`}
                  src={url}
                  title={`${project.title}, live preview`}
                  data-loaded={loaded}
                  onLoad={() => setLoaded(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </>
            ) : (
              <div className="viewer__scroll" key={`${shown}-${mode}`} tabIndex={0} aria-label={`${project.title}, full-page capture`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/projects/${shown}/${mode === "mobile" ? "full-mobile" : "full"}.jpg`}
                  alt={`The full ${project.title} homepage`}
                />
              </div>
            )}
          </div>
        </div>

        <footer className="viewer__foot">
          <div className="viewer__info">
            <h2 id="viewer-title">{project.title}</h2>
            <p>
              {project.line}
              {!project.embed && <span className="viewer__note"> Scroll the capture, or visit the live site to click around.</span>}
            </p>
          </div>
          <div className="viewer__actions">
            <button className="pill-link" onClick={() => openProject(project.slug)}>
              Case study
            </button>
            {url && (
              <a className="cta" href={url} target="_blank" rel="noreferrer">
                <span className="cta__glow" aria-hidden />
                Visit site ↗
              </a>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}
