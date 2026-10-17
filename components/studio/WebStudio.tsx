"use client";

import { useEffect, useRef } from "react";
import { projectsIn } from "@/lib/projects";
import { site } from "@/lib/site";
import { carePlan, faqs, services, steps, studio, tiers } from "@/lib/services";
import { prefersReducedMotion } from "@/lib/useNavigation";
import { ContactForm } from "@/components/ui/ContactForm";
import { PioneerLogo } from "./PioneerMark";
import "./studio.css";

const NAV = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/** The small up-right arrow used on labels and links. */
function Arrow() {
  return (
    <svg className="s-arrow" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The Pioneer Digital site: a warm, editorial single page of work, services,
 * pricing, process, FAQs and contact, set in rounded sections on a beige canvas.
 */
export default function WebStudio() {
  const scroller = useRef<HTMLDivElement>(null);
  const work = projectsIn("web");
  const { links, contact } = site;
  const booking = studio.bookingUrl;
  // The last word of the headline is set in a lighter tone.
  const headline = studio.heading.slice(0, -1);
  const lastWord = studio.heading[studio.heading.length - 1];

  // Sections settle gently into place as they scroll into view.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "true");
            io.unobserve(e.target);
          }
        }),
      { root, threshold: 0.1 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const bookProps = booking
    ? { href: booking, target: "_blank", rel: "noreferrer" }
    : { href: "#contact", onClick: jump("contact") };
  const hasContact = booking || links.email || links.linkedin || contact.formspreeId;

  return (
    <div ref={scroller} className="studio">
      <div className="s-frame">
        <header className="s-bar">
          <a className="s-bar__brand" href="#top" onClick={jump("top")} aria-label={studio.brand}>
            <PioneerLogo tone="black" size={28} />
          </a>
          <nav className="s-bar__nav" aria-label="Page sections">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={jump(n.id)}>
                {n.label}
              </a>
            ))}
          </nav>
          <a className="s-btn s-btn--sm" {...bookProps}>
            {studio.cta}
            <Arrow />
          </a>
        </header>

        <section id="top" className="s-card s-hero">
          <p className="s-eyebrow">{studio.eyebrow}</p>
          <h1 className="s-hero__title">
            {headline.map((w) => (
              <span key={w}>{w}</span>
            ))}
            <span className="s-muted">{lastWord}</span>
          </h1>
          <div className="s-hero__foot">
            <p className="s-hero__intro">{studio.intro}</p>
            <div className="s-actions">
              <a className="s-btn" {...bookProps}>
                {studio.cta}
                <Arrow />
              </a>
              <a className="s-btn s-btn--ghost" href="#work" onClick={jump("work")}>
                {studio.secondary}
              </a>
            </div>
          </div>
        </section>

        <ul className="s-ticker" aria-label="Services">
          {services.map((s) => (
            <li key={s.title}>
              <a href="#services" onClick={jump("services")}>
                {s.title}
                <Arrow />
              </a>
            </li>
          ))}
        </ul>

        <section id="work" className="s-card s-card--dark" data-reveal>
          <header className="s-head s-head--split">
            <p className="s-eyebrow">
              Selected work <Arrow />
            </p>
            <h2 className="s-title">Sites built for real businesses</h2>
          </header>
          <ul className="s-work__grid">
            {work.map((p) => (
              <li key={p.slug}>
                <a className="s-project" href={p.demo} target="_blank" rel="noreferrer">
                  <span className="s-project__frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/projects/${p.slug}/thumb.jpg`} alt="" loading="lazy" />
                  </span>
                  <span className="s-project__title">
                    {p.title}
                    <Arrow />
                  </span>
                  <span className="s-project__line">{p.line}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="services" className="s-card s-card--stone" data-reveal>
          <header className="s-head s-head--split">
            <p className="s-eyebrow">
              Services <Arrow />
            </p>
            <h2 className="s-title">Everything your site needs, start to finish</h2>
          </header>
          <ol className="s-services">
            {services.map((s, i) => (
              <li key={s.title} className="s-service">
                <span className="s-index">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="s-service__title">{s.title}</h3>
                <p className="s-service__body">{s.body}</p>
                <ul className="s-list">
                  {s.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="s-section" data-reveal>
          <header className="s-head s-head--split">
            <p className="s-eyebrow">
              Pricing <Arrow />
            </p>
            <div>
              <h2 className="s-title">Clear packages, no surprises</h2>
              <p className="s-sub">Every project gets a fixed quote after our first call.</p>
            </div>
          </header>
          <ul className="s-tiers">
            {tiers.map((t) => (
              <li key={t.name} className="s-tier" data-featured={t.featured || undefined}>
                <div className="s-tier__top">
                  <h3>{t.name}</h3>
                  {t.featured && <span className="s-badge">Most popular</span>}
                </div>
                <p className="s-tier__price">
                  <span>Starting at</span>
                  {t.price}
                </p>
                <p className="s-tier__blurb">{t.blurb}</p>
                <ul className="s-list">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className={t.featured ? "s-btn s-btn--light" : "s-btn s-btn--ghost"} {...bookProps}>
                  Get started
                </a>
              </li>
            ))}
          </ul>
          <div className="s-care">
            <div>
              <h3>{carePlan.title}</h3>
              <p>{carePlan.body}</p>
            </div>
            <p className="s-care__price">{carePlan.price}</p>
          </div>
        </section>

        <section className="s-card s-card--white" data-reveal>
          <header className="s-head s-head--split">
            <p className="s-eyebrow">
              How it works <Arrow />
            </p>
            <h2 className="s-title">From first call to launch</h2>
          </header>
          <ol className="s-steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="s-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="s-section s-faq" data-reveal>
          <header className="s-head">
            <p className="s-eyebrow">
              FAQ <Arrow />
            </p>
            <h2 className="s-title">Questions, answered</h2>
          </header>
          <div className="s-faq__list">
            {faqs.map((f) => (
              <details key={f.q} className="s-faq__item">
                <summary>
                  {f.q}
                  <span className="s-faq__icon" aria-hidden />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="s-card s-card--dark s-contact" data-reveal>
          <div className="s-contact__main">
            <p className="s-eyebrow">
              Contact <Arrow />
            </p>
            <h2 className="s-contact__title">Let&apos;s build your site</h2>
            <p className="s-sub">
              Book a free 20-minute call. We&apos;ll talk about your business, what your site needs to do, and which
              package fits.
            </p>
            <div className="s-actions">
              {booking && (
                <a className="s-btn s-btn--light" href={booking} target="_blank" rel="noreferrer">
                  Book a call
                  <Arrow />
                </a>
              )}
              {links.email && (
                <a className="s-btn s-btn--outline-light" href={`mailto:${links.email}`}>
                  {links.email}
                </a>
              )}
              {links.linkedin && (
                <a className="s-btn s-btn--outline-light" href={links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
            {contact.formspreeId && <ContactForm formId={contact.formspreeId} />}
            {!hasContact && process.env.NODE_ENV === "development" && (
              <p className="s-todo">
                Only you see this, in development: add a booking link in lib/services.ts, or an email, LinkedIn or
                Formspree ID in lib/site.ts.
              </p>
            )}
          </div>
        </section>

        <footer className="s-footer">
          <PioneerLogo tone="black" size={22} />
          <span>
            © {new Date().getFullYear()} {studio.brand}
          </span>
          <a href="#top" onClick={jump("top")}>
            Back to top <Arrow />
          </a>
        </footer>
      </div>
    </div>
  );
}
