import type { Metadata } from "next";
import { PageTransition } from "@/components/navigation/PageTransition";
import { About } from "@/components/sections/About";
import { Company } from "@/components/sections/Company";
export const metadata: Metadata = {
  title: "About",
  description:
    "Darien Corporation is a young technology company building useful software and AI today, with a long-term vision in engineering and scientific research.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <PageTransition>
      <About variant="page" />
      <Company />
    </PageTransition>
  );
}
