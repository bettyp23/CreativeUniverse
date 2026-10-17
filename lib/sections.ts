// The three worlds of the universe.
// The projects inside each world live in lib/projects.ts.

export type SectionId = "dev" | "ai" | "lab" | "web";

export type Shape = "crystal" | "knot" | "gyro" | "panes";

export interface Section {
  id: SectionId;
  title: string;
  /** Shorter name for the phone navbar. */
  shortTitle: string;
  tagline: string;
  description: string;
  /** Main glow color for the world's object and accents. */
  color: string;
  /** Secondary tint used for gradients. */
  accent: string;
  shape: Shape;
  /** Position of the world in the 3D scene (the core sits at 0,0,0). */
  position: [number, number, number];
  /** Tighter position used on tall, narrow screens such as phones. */
  portraitPosition: [number, number, number];
}

export const sections: Section[] = [
  {
    id: "dev",
    title: "Dev Projects",
    shortTitle: "Dev",
    tagline: "Software I've designed, built and shipped.",
    description:
      "Web apps, tools and engineering work, from first sketch to production.",
    color: "#5b8fe8",
    accent: "#a8c8ff",
    shape: "crystal",
    position: [-3.1, 1.25, 0.4],
    portraitPosition: [-1.45, 1.35, 0.4],
  },
  {
    id: "ai",
    title: "AI Studio",
    shortTitle: "AI",
    tagline: "Experiments with machine intelligence.",
    description:
      "AI workflows, generative visuals and concepts exploring what models can make with us.",
    color: "#8f80e8",
    accent: "#c6bdff",
    shape: "knot",
    position: [2.9, 1.55, -1.0],
    portraitPosition: [1.5, 1.65, -0.6],
  },
  {
    id: "lab",
    title: "Innovation Lab",
    shortTitle: "Lab",
    tagline: "Prototypes and ideas from the near future.",
    description:
      "Concept builds, inventions and creative experiments that are still taking shape.",
    color: "#d39268",
    accent: "#f0c8a8",
    shape: "gyro",
    position: [-1.7, -2.0, 1.2],
    portraitPosition: [-1.2, -1.3, 1.0],
  },
  {
    id: "web",
    title: "Web Gallery",
    shortTitle: "Web",
    tagline: "Websites designed and built for real businesses.",
    description:
      "Live sites for local businesses, from real estate to wellness clinics. Open one to explore it right here.",
    color: "#4fbfa8",
    accent: "#a6e6d8",
    shape: "panes",
    position: [2.5, -1.75, 0.5],
    portraitPosition: [1.25, -1.05, 0.4],
  },
];

export const positionFor = (s: Section, portrait: boolean) =>
  portrait ? s.portraitPosition : s.position;

/** Phones and other tall screens get a tighter layout. */
export const isPortrait = (w: number, h: number) => w / h < 0.9;

export const sectionById = (id: SectionId) =>
  sections.find((s) => s.id === id)!;

export const isSectionId = (v: string): v is SectionId =>
  sections.some((s) => s.id === v);
