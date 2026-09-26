import type { CSSProperties, ReactNode } from "react";
import { NavLink } from "@/components/navigation/NavLink";
import { ArrowRight } from "./Icons";
import { SplitText } from "./SplitText";
import styles from "./SectionHeading.module.css";

type Props = {
  index: string;
  label: string;
  title: string;
  titleId: string;
  lead?: ReactNode;
  tone?: "light" | "dark";
  align?: "split" | "stack";
  /** 1 = page title (h1, animates on load); 2 = section title (animates on scroll). */
  level?: 1 | 2;
  /** Link to the section's full page, shown on the home page. */
  action?: { href: string; label: string };
};

export function SectionHeading({
  index,
  label,
  title,
  titleId,
  lead,
  tone = "light",
  align = "split",
  level = 2,
  action,
}: Props) {
  const isPage = level === 1;
  // Page headings animate on load; section headings reveal on scroll.
  const rise = (delay: number) =>
    isPage
      ? { className: "page-rise", style: { "--rise-delay": `${delay}ms` } as CSSProperties }
      : { "data-reveal": "", style: { "--reveal-delay": `${delay}ms` } as CSSProperties };

  return (
    <header
      className={[styles.heading, styles[align], tone === "dark" && styles.dark, isPage && styles.page]
        .filter(Boolean)
        .join(" ")}
    >
      <p
        className={`${styles.label} meta ${isPage ? "page-rise" : ""}`}
        data-reveal={isPage ? undefined : "fade"}
      >
        <span className={styles.bar} aria-hidden="true" />
        <span className={styles.index}>{index}</span>
        <span className={styles.sep} aria-hidden="true">
          /
        </span>
        <span>{label}</span>
      </p>
      <div className={styles.body}>
        <SplitText
          as={isPage ? "h1" : "h2"}
          id={titleId}
          text={title}
          className={`${styles.title} ${isPage ? `${styles.pageTitle} page-title` : ""}`}
          observe={!isPage}
        />
        {lead || action ? (
          <div className={styles.aside}>
            {lead ? (
              <p {...rise(isPage ? 420 : 240)} className={`${styles.lead} ${isPage ? "page-rise" : ""}`}>
                {lead}
              </p>
            ) : null}
            {action ? (
              <div {...rise(isPage ? 520 : 320)} className={isPage ? "page-rise" : undefined}>
                <NavLink href={action.href} className={styles.action}>
                  <span>{action.label}</span>
                  <ArrowRight className={styles.actionIcon} />
                </NavLink>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
