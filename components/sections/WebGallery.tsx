import { useRouter } from "next/navigation";
import { projectsIn } from "@/lib/projects";
import { useUniverse } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/useNavigation";
import { PioneerMark } from "@/components/studio/PioneerMark";

/**
 * The Web Gallery world: a way into the Web Studio page, then a grid of site
 * cards that open in the preview window.
 */
export default function WebGallery() {
  const router = useRouter();
  const setPreview = useUniverse((s) => s.setPreview);
  const preview = useUniverse((s) => s.preview);

  const openStudio = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    useUniverse.getState().setWarp(true);
    setTimeout(() => router.push("/web/"), prefersReducedMotion() ? 0 : 450);
  };

  return (
    <>
      <a className="studio-entry" href="/web/" onClick={openStudio}>
        <PioneerMark size={34} className="studio-entry__mark" />
        <span className="studio-entry__text">
          <span className="studio-entry__title">Work with me at Pioneer Digital</span>
          <span className="studio-entry__line">My web studio: services, pricing and booking a call</span>
        </span>
        <span className="studio-entry__arrow" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 16 16">
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
      <ul className="gallery-grid">
        {projectsIn("web").map((p) => (
          <li key={p.slug}>
            <button
              className="gallery-card"
              aria-pressed={preview === p.slug}
              onClick={() => setPreview(p.slug)}
            >
              <span className="gallery-card__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/projects/${p.slug}/thumb.jpg`} alt="" loading="lazy" />
                <span className="gallery-card__open" aria-hidden>
                  Preview
                </span>
              </span>
              <span className="gallery-card__title">{p.title}</span>
              <span className="gallery-card__line">{p.line}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
