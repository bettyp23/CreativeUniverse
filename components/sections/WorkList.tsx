import type { WorkItem } from "@/lib/sections";

/** A simple list of pieces of work. Shared by all three worlds. */
export function WorkList({ items }: { items: WorkItem[] }) {
  return (
    <ul className="work-list">
      {items.map((item) => {
        const body = (
          <>
            <div className="work-item__head">
              <h3>{item.title}</h3>
              <span className="work-item__status" data-status={item.status}>
                {item.status}
              </span>
            </div>
            <p>{item.summary}</p>
            <div className="work-item__tags">
              {item.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </>
        );
        return (
          <li key={item.title} className="work-item">
            {item.href ? <a href={item.href}>{body}</a> : <div>{body}</div>}
          </li>
        );
      })}
    </ul>
  );
}
