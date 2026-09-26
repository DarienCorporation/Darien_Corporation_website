import { NavLink } from "@/components/navigation/NavLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { projects, type Project } from "@/lib/content";
import { site } from "@/lib/site";
import { projectNumber } from "./Projects";
import { ProjectName, ProjectVisual } from "./ProjectVisual";
import projectStyles from "./Projects.module.css";
import styles from "./ProjectDetail.module.css";

export function ProjectDetail({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const hasNext = next.slug !== project.slug;

  return (
    <article className={styles.page} aria-labelledby="project-title">
      <Container>
        <nav aria-label="Breadcrumb" className="page-rise">
          <ol role="list" className={`${styles.crumbs} meta`}>
            <li>
              <NavLink href="/projects" direction="nav-back" className={styles.back}>
                <span aria-hidden="true" className={styles.backArrow}>
                  ←
                </span>
                Projects
              </NavLink>
            </li>
            <li aria-current="page">{project.name}</li>
          </ol>
        </nav>

        <header className={styles.header}>
          <p className={`${styles.meta} meta page-rise`} style={{ ["--rise-delay" as string]: "80ms" }}>
            <span>{project.category}</span>
            <span className={styles.owner}>P—{projectNumber(index)} · A Darien Corporation project</span>
          </p>
          <h1 id="project-title" className={styles.title}>
            <ProjectName project={project}>{project.name}</ProjectName>
          </h1>
          <p className={`${styles.lead} page-rise`} style={{ ["--rise-delay" as string]: "200ms" }}>
            {project.summary}
          </p>
        </header>

        <div className={styles.visualWrap} data-spotlight="">
          <ProjectVisual
            project={project}
            number={projectNumber(index)}
            className={styles.visual}
            sizes="100vw"
            priority
          />
        </div>

        <div className={styles.body}>
          <div className={`${styles.overview} page-rise`} style={{ ["--rise-delay" as string]: "320ms" }}>
            <h2 className={`${styles.sectionLabel} meta`}>Overview</h2>
            {project.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {project.href ? (
              <div className={styles.actions}>
                <Button href={project.href} external icon={<ArrowUpRight />}>
                  Visit {project.name}
                </Button>
              </div>
            ) : null}
          </div>

          <dl className={`${styles.facts} page-rise`} style={{ ["--rise-delay" as string]: "420ms" }}>
            <div className={styles.fact}>
              <dt className="meta">Category</dt>
              <dd>{project.category}</dd>
            </div>
            <div className={styles.fact}>
              <dt className="meta">Built by</dt>
              <dd>{site.name}</dd>
            </div>
            <div className={styles.fact}>
              <dt className="meta">Focus</dt>
              <dd>
                <ul role="list" className={projectStyles.focus}>
                  {project.focus.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className={styles.fact}>
              <dt className="meta">Questions</dt>
              <dd>
                <NavLink href="/contact" className={styles.inlineLink}>
                  Contact us about {project.name}
                </NavLink>
              </dd>
            </div>
          </dl>
        </div>

        {hasNext ? (
          <NavLink
            href={`/projects/${next.slug}`}
            direction="nav-forward"
            className={styles.next}
            data-spotlight=""
            aria-label={`Next project: ${next.name}`}
          >
            <div className={styles.nextText}>
              <span className={`${styles.nextLabel} meta`}>Next project</span>
              <span className={styles.nextName}>{next.name}</span>
              <span className={styles.nextCategory}>{next.category}</span>
              <span className={styles.nextArrow} aria-hidden="true">
                <ArrowRight />
              </span>
            </div>
            <div className={styles.nextVisual}>
              <ProjectVisual project={next} number={projectNumber(projects.indexOf(next))} sizes="40vw" />
            </div>
          </NavLink>
        ) : null}
      </Container>
    </article>
  );
}
