// The three worlds of the universe.
// Add, remove or edit entries in `items` to change what each world shows.
// Each world's focused view lives in components/sections/<Name>.tsx, so it can
// grow into a full page of its own later.

export type SectionId = "dev" | "ai" | "lab";

export type Shape = "crystal" | "knot" | "gyro";

export interface WorkItem {
  title: string;
  summary: string;
  tags: string[];
  status: "Live" | "In progress" | "Concept";
  href?: string;
}

export interface Section {
  id: SectionId;
  title: string;
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
  items: WorkItem[];
}

export const sections: Section[] = [
  {
    id: "dev",
    title: "Dev Projects",
    tagline: "Software I've designed, built and shipped.",
    description:
      "Web apps, tools and engineering work, from first sketch to production.",
    color: "#5b8cff",
    accent: "#7fe3ff",
    shape: "crystal",
    position: [-3.1, 1.25, 0.4],
    portraitPosition: [-1.45, 1.35, 0.4],
    items: [
      {
        title: "Sample project one",
        summary: "A short line about what this app does and who it's for.",
        tags: ["Next.js", "TypeScript"],
        status: "Live",
      },
      {
        title: "Sample project two",
        summary: "Replace these with your own builds in lib/sections.ts.",
        tags: ["React Native", "API design"],
        status: "In progress",
      },
      {
        title: "Sample project three",
        summary: "Link each one to a case study, demo or repository.",
        tags: ["Node", "Postgres"],
        status: "Live",
      },
    ],
  },
  {
    id: "ai",
    title: "AI Studio",
    tagline: "Experiments with machine intelligence.",
    description:
      "AI workflows, generative visuals and concepts exploring what models can make with us.",
    color: "#c26bff",
    accent: "#ff5fa2",
    shape: "knot",
    position: [2.9, 1.55, -1.0],
    portraitPosition: [1.5, 1.65, -0.6],
    items: [
      {
        title: "Sample experiment one",
        summary: "A generative series and the workflow behind it.",
        tags: ["Image models", "Workflow"],
        status: "Live",
      },
      {
        title: "Sample experiment two",
        summary: "An agent that turns rough notes into finished drafts.",
        tags: ["LLMs", "Agents"],
        status: "In progress",
      },
      {
        title: "Sample experiment three",
        summary: "A visual exploration of how a model sees colour.",
        tags: ["Research", "Visuals"],
        status: "Concept",
      },
    ],
  },
  {
    id: "lab",
    title: "Innovation Lab",
    tagline: "Prototypes and ideas from the near future.",
    description:
      "Concept builds, inventions and creative experiments that are still taking shape.",
    color: "#ff9a4d",
    accent: "#ff5fa2",
    shape: "gyro",
    position: [0.4, -1.7, 1.3],
    portraitPosition: [0.1, -1.7, 1.0],
    items: [
      {
        title: "Sample prototype one",
        summary: "A physical-digital object, from napkin sketch to working model.",
        tags: ["Hardware", "Prototype"],
        status: "In progress",
      },
      {
        title: "Sample idea two",
        summary: "A concept for a tool that doesn't exist yet.",
        tags: ["Concept", "Product"],
        status: "Concept",
      },
      {
        title: "Sample experiment three",
        summary: "An interaction experiment you can try in the browser.",
        tags: ["WebGL", "Interaction"],
        status: "Live",
      },
    ],
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
