/**
 * Site content. Kept separate from components so copy and projects can be
 * edited — or new projects added — without touching layout code.
 *
 * Content rule: describe only what is true today. Future areas are framed as
 * long-term research directions, never as existing capabilities.
 */

export type Capability = {
  id: "ai" | "software" | "web" | "research";
  index: string;
  title: string;
  summary: string;
  /** Longer description shown in the technology explorer. */
  detail: string;
  points: string[];
};

export const capabilities: Capability[] = [
  {
    id: "ai",
    index: "01",
    title: "Artificial Intelligence",
    summary: "AI systems, intelligent software, and automation built into useful products.",
    detail:
      "We use AI where it makes software more useful: understanding information, automating repetitive work, and powering features inside our products. The goal is dependable, practical intelligence, not AI for its own sake.",
    points: ["Applied machine learning", "Intelligent automation", "AI-powered features"],
  },
  {
    id: "software",
    index: "02",
    title: "Software",
    summary: "Production software and digital platforms designed to solve real problems.",
    detail:
      "Software is the foundation of everything we do. We design and build products end to end, with careful attention to architecture, quality, and the people who will use them.",
    points: ["Product engineering", "Digital products", "Systems design"],
  },
  {
    id: "web",
    index: "03",
    title: "Web Technology",
    summary: "Modern web platforms and the digital infrastructure behind them.",
    detail:
      "The web is how most people will meet our work. We build fast, accessible, and secure web platforms, along with the services and infrastructure that keep them running.",
    points: ["Web platforms", "APIs and services", "Performance and reliability"],
  },
  {
    id: "research",
    index: "04",
    title: "Engineering & Research",
    summary: "Working on hard technical and scientific problems through careful study and experiment.",
    detail:
      "Some problems can’t be solved with existing tools. We study them carefully, build prototypes, and run experiments. This is the practice that connects our current work to our long-term vision.",
    points: ["Technical research", "Prototyping", "Experimentation"],
  },
];

export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  /** Paragraphs for the project page. */
  overview: string[];
  focus: string[];
  /** Visual treatment key for the card artwork. */
  art: "myfolks" | "lorem" | "default";
  /** Optional external URL. Only set when the project has a public site. */
  href?: string;
  /** Optional product image in /public. Falls back to the generated artwork. */
  image?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    slug: "myfolks",
    name: "myFolks",
    category: "Social discovery",
    summary:
      "A social discovery platform that helps people find common ground and meaningful connections through shared interests and interactive discovery.",
    overview: [
      "myFolks is built around a simple idea: people connect more easily when they can see what they have in common.",
      "The platform focuses on discovering shared interests and turning that discovery into something interactive, so finding your people feels natural rather than forced.",
    ],
    focus: ["Interest-based discovery", "Meaningful connections", "Interactive experiences"],
    art: "myfolks",
  },
  {
    slug: "lorem",
    name: "Lorem",
    category: "Technical platform",
    summary: "A technology platform for engineers, scientists, and technically minded people.",
    overview: [
      "Lorem is being built for engineers, scientists, and technically minded people.",
      "It reflects the same values behind Darien Corporation: precision, curiosity, and a serious approach to technical work.",
    ],
    focus: ["Engineers", "Scientists", "Technical communities"],
    art: "lorem",
  },
];

export type VisionArea = {
  id: string;
  title: string;
  summary: string;
};

export const visionAreas: VisionArea[] = [
  {
    id: "aerospace",
    title: "Aerospace",
    summary: "Long-term interest in advanced aerospace and space technologies.",
  },
  {
    id: "mobility",
    title: "Advanced Mobility",
    summary: "The future of transportation and vehicle technology.",
  },
  {
    id: "spacetime",
    title: "Spacetime",
    summary:
      "Exploring advanced ideas in physics related to spacetime, including research directions such as teleportation.",
  },
  {
    id: "bionics",
    title: "Bionics",
    summary:
      "Technology that connects engineering, biology, and human capability, including advanced human–technology interfaces.",
  },
];

export const principles = [
  {
    title: "Build",
    body: "Make useful technology instead of only talking about it. Real products are how ideas get tested.",
  },
  {
    title: "Explore",
    body: "Work on difficult technical and scientific problems, including those without obvious answers.",
  },
  {
    title: "Engineer",
    body: "Approach every problem through engineering: measure, experiment, iterate.",
  },
  {
    title: "Think long-term",
    body: "Build today’s technology without losing sight of what could become possible.",
  },
];

export type Leader = {
  name: string;
  role: string;
  bio: string;
};

export const leadership: Leader[] = [
  {
    name: "Rashidh James Darien",
    role: "Founder",
    bio: "Rashidh James Darien founded Darien Corporation to build useful technology now and to work, over the long term, toward ambitious engineering and scientific goals. The company’s direction, from its current products to its long-term vision, comes from that founding idea.",
  },
];
