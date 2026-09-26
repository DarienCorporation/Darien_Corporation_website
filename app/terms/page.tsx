import type { Metadata } from "next";
import { NavLink } from "@/components/navigation/NavLink";
import { PageTransition } from "@/components/navigation/PageTransition";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms that apply to your use of the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageTransition>
      <LegalPage title="Terms of Use" updated="September 26, 2026">
        <p>These terms apply to your use of the {site.name} website. By using the site, you agree to them.</p>

        <h2>Use of the website</h2>
        <p>
          You may browse and share this website for lawful purposes. Do not attempt to disrupt the site,
          access it in unauthorized ways, or misuse its contact features.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The {site.name} name, logo, and the content of this website belong to {site.name} unless stated
          otherwise. You may not use them in a way that suggests endorsement or affiliation without our
          written permission.
        </p>

        <h2>Forward-looking statements</h2>
        <p>
          This website describes our long-term vision and research interests, including areas such as
          aerospace, advanced mobility, spacetime, and bionics. These describe what we hope to explore in the
          future. They are not products, services, or capabilities that exist today, and they are not
          commitments to deliver any particular outcome.
        </p>

        <h2>No warranty</h2>
        <p>
          The website is provided “as is”. We work to keep it accurate and available, but we do not guarantee
          that it will always be complete, current, or uninterrupted.
        </p>

        <h2>External links</h2>
        <p>
          Links to other websites are provided for convenience. We are not responsible for their content or
          practices.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms from time to time. The date above shows when they last changed.</p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent through our <NavLink href="/contact">contact page</NavLink>.
        </p>
      </LegalPage>
    </PageTransition>
  );
}
