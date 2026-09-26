import { NavLink } from "@/components/navigation/NavLink";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/lib/content";
import { ProjectName, ProjectVisual } from "./ProjectVisual";
import styles from "./Projects.module.css";

export const projectNumber = (index: number) => String(index + 1).padStart(2, "0");

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className={styles.card}
      data-art={project.art}
      data-spotlight=""
      aria-labelledby={`project-${project.slug}`}
    >
      <ProjectVisual project={project} number={projectNumber(index)} />

      <div className={styles.content} data-reveal="">
        <p className={`${styles.meta} meta`}>
          <span>{project.category}</span>
          <span className={styles.owner}>A Darien Corporation project</span>
        </p>
        <h3 id={`project-${project.slug}`} className={styles.name}>
          {/* Stretched link: the whole card is clickable, with one accessible link. */}
          <NavLink href={`/projects/${project.slug}`} className={styles.stretch}>
            <ProjectName project={project}>{project.name}</ProjectName>
          </NavLink>
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul role="list" className={styles.focus} aria-label={`${project.name} focus areas`}>
          {project.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className={styles.cta} aria-hidden="true">
          <span>View project</span>
          <ArrowRight className={styles.ctaIcon} />
        </p>
      </div>
    </article>
  );
}

type Props = { variant?: "home" | "page" };

export function Projects({ variant = "home" }: Props) {
  const isPage = variant === "page";
  return (
    <section
      id="projects"
      className={`${styles.section} ${isPage ? styles.page : ""}`}
      aria-labelledby="projects-title"
    >
      <Container>
        <SectionHeading
          index="03"
          label="Projects"
          titleId="projects-title"
          level={isPage ? 1 : 2}
          title="Technology becoming real products."
          lead="Darien Corporation’s initiatives are where our engineering meets real people and real problems."
          action={isPage ? undefined : { href: "/projects", label: "All projects" }}
        />

        <ol role="list" className={styles.list}>
          {projects.map((project, i) => (
            <li key={project.slug}>
              <ProjectCard project={project} index={i} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
