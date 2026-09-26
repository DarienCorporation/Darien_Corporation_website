import type { Metadata } from "next";
import { PageTransition } from "@/components/navigation/PageTransition";
import { Vision } from "@/components/sections/Vision";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Darien Corporation’s long-term research directions: aerospace, advanced mobility, spacetime, and bionics. Exploratory, not current products.",
  alternates: { canonical: "/vision" },
};

export default function Page() {
  return (
    <PageTransition>
      <Vision variant="page" />
    </PageTransition>
  );
}
