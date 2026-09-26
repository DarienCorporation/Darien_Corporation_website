import type { Metadata } from "next";
import { PageTransition } from "@/components/navigation/PageTransition";
import { Technology } from "@/components/sections/Technology";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Artificial intelligence, software, web technology, and engineering research: the areas Darien Corporation works in today.",
  alternates: { canonical: "/technology" },
};

export default function Page() {
  return (
    <PageTransition>
      <Technology variant="page" />
    </PageTransition>
  );
}
