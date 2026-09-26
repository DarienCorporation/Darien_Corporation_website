import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/navigation/PageTransition";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { projects } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${project.name}: ${project.summary} A ${site.name} project.`,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.name} — ${site.name}`, description: project.summary },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <PageTransition>
      <ProjectDetail project={project} />
    </PageTransition>
  );
}
