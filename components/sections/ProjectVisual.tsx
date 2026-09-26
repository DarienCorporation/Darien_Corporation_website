import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/lib/content";
import { ProjectArt } from "./ProjectArt";
import styles from "./Projects.module.css";

type Props = {
  project: Project;
  number: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Project artwork. Shares a view-transition name across the project card and
 * the project page, so it morphs between them during navigation.
 */
export function ProjectVisual({ project, number, className, sizes, priority }: Props) {
  return (
    <ViewTransition name={`project-art-${project.slug}`} share="morph" default="none">
      <div
        className={`${styles.visual} ${className ?? ""}`}
        data-art={project.art}
        aria-hidden={project.image ? undefined : true}
      >
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 1100px) 56vw, 100vw"}
            className={styles.image}
          />
        ) : (
          <ProjectArt art={project.art} />
        )}
        <span className={`${styles.visualTag} meta`} aria-hidden="true">
          P—{number}
        </span>
      </div>
    </ViewTransition>
  );
}

export function ProjectName({ project, children }: { project: Project; children: React.ReactNode }) {
  return (
    <ViewTransition name={`project-name-${project.slug}`} share="morph" default="none">
      <span className={styles.nameInner}>{children}</span>
    </ViewTransition>
  );
}
