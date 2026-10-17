import { projectsIn } from "@/lib/projects";
import { useUniverse } from "@/lib/store";

/** The Web Gallery world: a grid of site cards that open in the preview window. */
export default function WebGallery() {
  const setPreview = useUniverse((s) => s.setPreview);
  const preview = useUniverse((s) => s.preview);

  return (
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
  );
}
