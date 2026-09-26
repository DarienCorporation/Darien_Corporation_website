import type { Metadata } from "next";
import { PageTransition } from "@/components/navigation/PageTransition";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Darien Corporation about the company, its projects, or working together.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <PageTransition>
      <Contact variant="page" />
    </PageTransition>
  );
}
