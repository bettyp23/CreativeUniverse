// Everything on the Web Studio page (/web/) lives here: services, pricing, process and FAQs.
// The work shown on the page comes from the Web Gallery projects in lib/projects.ts.

export const studio = {
  // The Web Studio page carries the Pioneer Digital brand.
  brand: "Pioneer Digital",
  eyebrow: "Tech solutions for a more effortless tomorrow",
  /** The last word of the heading is drawn in the brand gradient. */
  heading: ["Ideas", "Engineered", "Forward."],
  intro:
    "Websites and digital systems built to help modern businesses grow, operate smarter, and move faster.",
  cta: "Get Started",
  secondary: "View Work",
  // TODO: paste your scheduling link (Calendly, Cal.com, Google Calendar booking page).
  // While this is empty, "Get Started" and "Book a call" scroll to the contact section instead.
  bookingUrl: "",
};

export type ServiceIcon = "build" | "redesign" | "care" | "seo";

export interface Service {
  icon: ServiceIcon;
  title: string;
  body: string;
  points: string[];
}

export const services: Service[] = [
  {
    icon: "build",
    title: "Website design & build",
    body: "A custom site designed around your business and your customers, not a template with your logo dropped in.",
    points: ["Custom design", "Mobile-first", "Fast, hand-built pages"],
  },
  {
    icon: "redesign",
    title: "Redesigns",
    body: "Give an outdated or hard-to-edit site a modern look, clearer structure and a real path to booking or buying.",
    points: ["Content carried over", "Clearer calls to action", "Speed & accessibility fixes"],
  },
  {
    icon: "care",
    title: "Hosting & care plan",
    body: "I host, update and back up your site, and handle the small edits so it never goes stale.",
    points: ["Hosting & SSL", "Monthly updates & backups", "Small edits included"],
  },
  {
    icon: "seo",
    title: "SEO & Google setup",
    body: "Get found locally: Google Business Profile, search basics and analytics so you can see what's working.",
    points: ["Google Business Profile", "Local SEO foundations", "Analytics & Search Console"],
  },
];

export interface Tier {
  name: string;
  /** Shown after "Starting at". */
  price: string;
  blurb: string;
  features: string[];
  /** Highlights the tier as the most popular choice. */
  featured?: boolean;
}

// TODO: these prices are placeholders. Replace them with your real starting prices.
export const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$1,200",
    blurb: "A polished one-to-three page site to get you online and looking professional.",
    features: ["Up to 3 pages", "Mobile-friendly design", "Contact form", "Basic SEO setup", "1 round of revisions"],
  },
  {
    name: "Business",
    price: "$2,500",
    blurb: "A full custom site for a business that's ready to grow and get found.",
    features: [
      "Up to 8 pages",
      "Custom design & animations",
      "Booking or menu integration",
      "Google Business Profile setup",
      "2 rounds of revisions",
    ],
    featured: true,
  },
  {
    name: "Custom",
    price: "$4,500",
    blurb: "Larger sites with listings, galleries, search or other custom features.",
    features: ["Unlimited pages", "Custom features & integrations", "Content migration", "Priority support", "3 rounds of revisions"],
  },
];

// TODO: placeholder price for the monthly care plan.
export const carePlan = {
  title: "Hosting & care plan",
  price: "$75/mo",
  body: "Hosting, SSL, updates, backups and up to an hour of edits each month. Available with any package.",
};

export const steps = [
  { title: "Discovery call", body: "A free 20-minute call about your business, your customers and what the site needs to do." },
  { title: "Design", body: "I design the key pages and we refine them together until they feel right." },
  { title: "Build", body: "I build the site, connect your booking, forms and Google tools, and test it on every screen size." },
  { title: "Launch & care", body: "We go live on your domain, and I keep it fast, secure and up to date." },
];

// Drafts: edit freely.
export const faqs = [
  {
    q: "How long does a website take?",
    a: "Most Starter sites launch in 2–3 weeks and Business sites in 4–6 weeks. The biggest factor is how quickly content and feedback come together.",
  },
  {
    q: "Do I need to provide the content and photos?",
    a: "It helps, but you don't have to have it all ready. I can help shape your copy, and use quality stock photos until you have your own.",
  },
  {
    q: "Will I be able to edit the site myself?",
    a: "Yes. I can set up simple editing for things like hours, menus and listings, or you can send changes to me and I'll handle them.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. Projects are usually split into a deposit to start and the rest at launch. Larger projects can be split into more payments.",
  },
  {
    q: "What if I already have a domain or a website?",
    a: "No problem. I'll work with the domain you have, and for redesigns I carry over your existing content and keep your search rankings intact.",
  },
  {
    q: "Is hosting included?",
    a: "Hosting is part of the monthly care plan, which also covers updates, backups and small edits. You're free to host elsewhere if you prefer.",
  },
];
