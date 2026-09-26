import { PageTransition } from "@/components/navigation/PageTransition";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Technology } from "@/components/sections/Technology";
import { Vision } from "@/components/sections/Vision";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <About />
      <Technology />
      <Projects />
      <Vision />
      <Contact />
    </PageTransition>
  );
}
