import type { Metadata } from "next";
import { PageTransition } from "@/components/navigation/PageTransition";
import { Projects } from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "myFolks and Lorem: technology projects developed by Darien Corporation.",
  alternates: { canonical: "/projects" },
};

export default function Page() {
  return (
    <PageTransition>
      <Projects variant="page" />
    </PageTransition>
  );
}
