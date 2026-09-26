import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { PointerEffects } from "@/components/effects/PointerEffects";
import { RevealObserver } from "@/components/effects/RevealObserver";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/navigation/CommandMenu";
import { Header } from "@/components/layout/Header";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f3",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}${site.logo.src}`,
  description: site.description,
  founder: { "@type": "Person", name: site.founder },
  ...(site.contact.email ? { email: site.contact.email } : {}),
  ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Per-request nonce from proxy.ts; inline scripts without it are blocked by the CSP.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so reveal animations never hide content without JS. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body id="top">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        <RevealObserver />
        <PointerEffects />
        <CommandMenu />
      </body>
    </html>
  );
}
