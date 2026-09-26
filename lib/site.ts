/**
 * Central site configuration.
 *
 * Contact details and social profiles can be overridden per deployment with
 * environment variables. Social links left empty are simply not rendered.
 */

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

function resolveSiteUrl(): string {
  const raw = clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export type SocialLink = { label: string; href: string };

const socialCandidates: Array<{ label: string; href: string | undefined }> = [
  { label: "LinkedIn", href: clean(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) },
  { label: "X", href: clean(process.env.NEXT_PUBLIC_SOCIAL_X) },
  { label: "GitHub", href: clean(process.env.NEXT_PUBLIC_SOCIAL_GITHUB) },
];

export const site = {
  name: "Darien Corporation",
  shortName: "Darien",
  tagline: "Building technology for what comes next.",
  title: "Darien Corporation — Building Technology for What Comes Next",
  description:
    "Darien Corporation is a technology company building software, AI, and digital products today while pursuing a long-term vision in engineering and scientific research.",
  url: resolveSiteUrl(),
  founder: "Rashidh James Darien",
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "dariencorporation@gmail.com",
  },
  social: socialCandidates.filter((s): s is SocialLink => Boolean(s.href)),
  logo: {
    src: "/brand/darien-corporation-logo.png",
    width: 410,
    height: 154,
    alt: "Darien Corporation",
  },
} as const;

export type NavItem = { label: string; href: string; id: string; description: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about", id: "about", description: "Who we are and how we work" },
  { label: "Technology", href: "/technology", id: "technology", description: "What we build today" },
  { label: "Projects", href: "/projects", id: "projects", description: "myFolks and Lorem" },
  { label: "Vision", href: "/vision", id: "vision", description: "Long-term research directions" },
  { label: "Contact", href: "/contact", id: "contact", description: "Start a conversation" },
];

export const legalNav = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
