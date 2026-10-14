import Link from "next/link";
import { projectPath, type Project } from "@/lib/projects";
import { openProject } from "@/lib/useNavigation";

/** Project cards for a world. Shared by all three worlds. */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="work-list">
      {projects.map((p) => (
        <li key={p.slug} className="work-item">
          <h3>
            <Link
              className="work-item__link"
              href={projectPath(p.slug)}
              onClick={(e) => {
                // Plain clicks fly to the artifact first; modified clicks open normally.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                openProject(p.slug);
              }}
            >
              {p.title}
            </Link>
          </h3>
          <p>{p.line}</p>
          <div className="work-item__foot">
            <div className="work-item__tags">
              {p.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {p.github && (
              <a className="work-item__gh" href={p.github} target="_blank" rel="noreferrer" aria-label={`${p.title} on GitHub`}>
                GitHub
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
