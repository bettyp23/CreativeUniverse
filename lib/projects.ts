// Every project on the site lives here. The cards in each world, the 3D
// artifacts in the constellation and the /projects/<slug>/ pages all read
// from this one list.

import type { SectionId } from "./sections";

/** Decides the project's 3D artifact: ai → prism, software → nodes, prototype → wireframe, design → browser panes. */
export type ProjectType = "ai" | "software" | "prototype" | "design";

export interface Screenshot {
  /** Path under /public, e.g. "/projects/link2itinerary/1.png". */
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  section: SectionId;
  type: ProjectType;
  /** The one-line description shown on cards and as the page description. */
  line: string;
  tags: string[];
  /** Leave empty to hide the GitHub link. */
  github?: string;
  /** Leave empty to hide the live demo link. Web designs use it as the gallery's live preview. */
  demo?: string;
  /**
   * Web designs only: true if the live site allows being shown in an iframe.
   * When false, the gallery shows a scrollable full-page capture instead
   * (public/projects/<slug>/full.jpg and full-mobile.jpg).
   */
  embed?: boolean;
  problem: string;
  built: string;
  /** 2–3 images. Empty slots show a placeholder frame until you add them. */
  screenshots: Screenshot[];
}

export const projects: Project[] = [
  // ---------- Dev Projects ----------
  {
    slug: "link2itinerary",
    title: "Link2Itinerary",
    section: "dev",
    type: "software",
    line: "Paste the travel links you've been saving, and get back a real itinerary that fits your budget.",
    tags: ["React", "NestJS", "PostgreSQL", "TypeScript", "LLMs"],
    github: "https://github.com/bettyp23/Link2itinerary",
    problem:
      "Trip planning is scattered across saved posts, listings and tabs, and the real cost of a trip only shows up once you've already committed to it.",
    built:
      "A web app that turns the links you've collected into a day-by-day plan. An LLM planner drafts the itinerary, then a deterministic consistency engine checks it against your dates and budget before you ever see it. React on the front, a NestJS API split into Trips, Planner and Estimator modules, and Postgres underneath.",
    screenshots: [],
  },
  {
    slug: "secure-flask-portal",
    title: "Secure Flask Portal",
    section: "dev",
    type: "software",
    line: "A pay raise portal built with security in mind from the start.",
    tags: ["Python", "Flask", "SQLite", "Encryption"],
    github: "https://github.com/bettyp23/Secure-Flask-Portal",
    problem:
      "Salary data is about as sensitive as data gets, and small internal tools are exactly where security tends to be bolted on last.",
    built:
      "A Flask portal with credentialed login and sessions, three security levels enforced in both routes and templates, pay raise data encrypted at rest with Fernet, validated input everywhere, and protected routes that answer with a 404 instead of admitting they exist.",
    screenshots: [],
  },
  {
    slug: "business-command-center",
    title: "Business Command Center",
    section: "dev",
    type: "software",
    line: "One dashboard that brings a business's moving parts together.",
    tags: ["React Native", "Expo", "Express", "Prisma", "PostgreSQL"],
    github: "https://github.com/bettyp23/centralized-business-command-center.",
    problem:
      "Solo service businesses, like trainers, tutors and photographers, run clients, bookings, tasks and follow-ups across a pile of apps that don't talk to each other.",
    built:
      "A mobile-first app that puts clients, appointments, tasks and follow-ups in one place. An Expo and React Native client talks to an Express and Prisma API, with Supabase auth, Google Calendar and Gmail integrations, and shared domain types across the whole stack.",
    screenshots: [],
  },

  // ---------- AI Studio ----------
  {
    slug: "ai-stock-sentiment-advisor",
    title: "AI Stock Sentiment Advisor",
    section: "ai",
    type: "ai",
    line: "Reads the financial news and turns how it feels into investment insights.",
    tags: ["Python", "Flask", "OpenAI API", "Sentiment analysis"],
    github: "https://github.com/bettyp23/AI-Powered-Stock-Sentiment-Investment-Advisor",
    problem:
      "News moves markets, but reading all of it and judging its tone is slow, and the judgement is rarely consistent.",
    built:
      "A Flask app that uses a language model to score the sentiment of news about a stock, weighs it against recent price data, and turns the two into a plain buy, hold or sell recommendation that a non-specialist can read.",
    screenshots: [],
  },
  {
    slug: "huggingface-faq-chatbot",
    title: "Hugging Face FAQ Chatbot",
    section: "ai",
    type: "ai",
    line: "A tiny chatbot that would rather say 'I don't know' than make something up.",
    tags: ["Hugging Face", "Python", "NLP"],
    github: "https://github.com/bettyp23/huggingface-faq-chatbot",
    problem:
      "A chatbot that confidently invents answers is worse than no chatbot at all, especially when people rely on it for facts.",
    built:
      "A deliberately small chatbot that answers only from a local FAQ file. If a question doesn't match anything it knows, it says so and stops, instead of guessing.",
    screenshots: [],
  },
  {
    slug: "alwaysinai",
    title: "AlwaysInAI",
    section: "ai",
    type: "ai",
    // TODO: write AlwaysInAI's one-line description, problem and build.
    line: "Details coming soon.",
    tags: ["AI"],
    problem: "Write-up coming soon.",
    built: "Write-up coming soon.",
    screenshots: [],
  },

  // ---------- Innovation Lab ----------
  {
    slug: "creative-universe",
    title: "Creative Universe",
    section: "lab",
    type: "prototype",
    line: "This site, a universe built to hold everything else I make.",
    tags: ["Next.js", "React Three Fiber", "Three.js", "GLSL", "TypeScript"],
    github: "https://github.com/bettyp23/CreativeUniverse",
    problem:
      "A list of links can't show how pieces of work relate to each other, or make exploring them feel like anything.",
    built:
      "A 3D constellation where each world holds a kind of work and each artifact holds a project. Built with Next.js and React Three Fiber, with custom GLSL shaders, camera flights between worlds, a static export that runs on any host, and a calmer path for anyone who prefers reduced motion.",
    screenshots: [
      { src: "/projects/creative-universe/1.jpg", alt: "The full universe view with three glowing worlds around the core" },
      { src: "/projects/creative-universe/2.jpg", alt: "The AI Studio world in focus, with its project panel open" },
      { src: "/projects/creative-universe/3.jpg", alt: "A project showcase page with its artifact as the hero" },
    ],
  },
  {
    slug: "bubble-sort-visualizer",
    title: "Bubble Sort Visualizer",
    section: "lab",
    type: "prototype",
    line: "Watch a sorting algorithm dance its way to order.",
    tags: ["Algorithms", "Visualization", "Animation"],
    problem: "Sorting algorithms are easy to recite and surprisingly hard to picture.",
    built:
      "An animated visualizer that steps through bubble sort one comparison at a time, swapping bars as it goes, so you can watch order emerge out of noise.",
    screenshots: [],
  },

  // ---------- Web Gallery ----------
  // Lines and write-ups are drafts; edit them freely.
  {
    slug: "perez-team",
    title: "The Perez Team",
    section: "web",
    type: "design",
    line: "A South Florida real estate site where searching, saving and comparing homes all happen in one calm place.",
    tags: ["HTML", "CSS", "JavaScript", "Real estate"],
    demo: "https://perez-demo.vercel.app/",
    embed: false,
    problem:
      "A real estate team needs a site that feels as considered as the homes it sells, and that lets buyers search, shortlist and compare without signing up for anything.",
    built:
      "A 26-page site with property filters and a map, listing galleries, saved homes, side-by-side comparison of up to three, a mortgage estimate and tour requests. Plain HTML, CSS and a little JavaScript, with no framework and no third-party requests.",
    screenshots: [
      { src: "/projects/perez-team/1.jpg", alt: "The homepage" },
      { src: "/projects/perez-team/2.jpg", alt: "A section further down the homepage" },
      { src: "/projects/perez-team/3.jpg", alt: "A later section of the homepage" },
    ],
  },
  {
    slug: "it-is-well",
    title: "It Is Well",
    section: "web",
    type: "design",
    line: "A calm, welcoming home for an IV therapy and integrative wellness clinic in Melbourne, Florida.",
    tags: ["Astro", "TypeScript", "Wellness"],
    demo: "https://itiswell-demo.vercel.app/",
    embed: false,
    problem:
      "A clinic's website is often the first stop for someone who isn't feeling their best, so it has to feel calm and make booking obvious.",
    built:
      "An Astro site that walks visitors through services and featured IV drips, introduces the founder, shares client reviews and sends every Book button straight to the clinic's online scheduler.",
    screenshots: [
      { src: "/projects/it-is-well/1.jpg", alt: "The homepage" },
      { src: "/projects/it-is-well/2.jpg", alt: "A section further down the homepage" },
      { src: "/projects/it-is-well/3.jpg", alt: "A later section of the homepage" },
    ],
  },
  {
    slug: "precision-services",
    title: "Precision Services",
    section: "web",
    type: "design",
    line: "A bold, no-nonsense site for a demolition and excavation crew in Warrington, PA.",
    tags: ["HTML", "CSS", "JavaScript", "Contractor"],
    demo: "https://precision-demo.vercel.app/",
    embed: true,
    problem:
      "Contractors win jobs on trust and speed: a homeowner wants to see the work, know the crew is licensed and insured, and get an estimate fast.",
    built:
      "A heavy-type, high-contrast site built around field footage, services and past work, with a free-estimate call to action and click-to-call on every screen.",
    screenshots: [
      { src: "/projects/precision-services/1.jpg", alt: "The homepage" },
      { src: "/projects/precision-services/2.jpg", alt: "A section further down the homepage" },
      { src: "/projects/precision-services/3.jpg", alt: "A later section of the homepage" },
    ],
  },
  {
    slug: "substantiation-sciences",
    title: "Substantiation Sciences",
    section: "web",
    type: "design",
    line: "A clear, credible redesign for a science consultancy that takes products from concept to market.",
    tags: ["HTML", "CSS", "JavaScript", "Motion design"],
    demo: "https://subsci-demo.vercel.app/",
    embed: false,
    problem:
      "Science-heavy services are hard to explain, and a consultancy serving regulated industries has to earn trust within a few seconds.",
    built:
      "A static redesign with a clear services structure, founder profiles, blog and video sections, and restrained scroll-reveal motion that respects reduced-motion settings.",
    screenshots: [
      { src: "/projects/substantiation-sciences/1.jpg", alt: "The homepage" },
      { src: "/projects/substantiation-sciences/2.jpg", alt: "A section further down the homepage" },
      { src: "/projects/substantiation-sciences/3.jpg", alt: "A later section of the homepage" },
    ],
  },
  {
    slug: "infinite-life-medical",
    title: "Infinite Life Medical",
    section: "web",
    type: "design",
    line: "A guided rebuild for a Pembroke Pines wellness clinic that starts with where each patient is.",
    tags: ["Astro", "Tailwind CSS", "TypeScript"],
    demo: "https://infinite-life-demo.vercel.app/",
    embed: true,
    problem:
      "A clinic offering everything from chiropractic care to weight loss can overwhelm new patients before they find the care they came for.",
    built:
      "An Astro and Tailwind rebuild organised around one question, “Where are you starting?”, with a single source for phone and booking links, strict security headers and an automated QA script that checks titles, links, alt text and schema on every build.",
    screenshots: [
      { src: "/projects/infinite-life-medical/1.jpg", alt: "The homepage" },
      { src: "/projects/infinite-life-medical/2.jpg", alt: "A section further down the homepage" },
      { src: "/projects/infinite-life-medical/3.jpg", alt: "A later section of the homepage" },
    ],
  },
  {
    slug: "havana-nights",
    title: "Havana Nightz",
    section: "web",
    type: "design",
    line: "Neon, late-night energy for a Miami-area Cuban food truck.",
    tags: ["HTML", "CSS", "JavaScript"],
    demo: "https://havananights.vercel.app/",
    embed: true,
    problem:
      "A food truck lives on cravings and word of mouth. Its site has to make people hungry, then tell them where to find it.",
    built:
      "A five-page responsive site with a neon Miami look: the menu, meal prep, catering inquiries, the story behind the truck and where to find it. Plain HTML, CSS and JavaScript with no build step.",
    screenshots: [
      { src: "/projects/havana-nights/1.jpg", alt: "The homepage" },
      { src: "/projects/havana-nights/2.jpg", alt: "A section further down the homepage" },
      { src: "/projects/havana-nights/3.jpg", alt: "A later section of the homepage" },
    ],
  },
];

export const projectsIn = (section: SectionId) => projects.filter((p) => p.section === section);

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const projectPath = (slug: string) => `/projects/${slug}/`;
