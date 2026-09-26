import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilities } from "@/lib/content";
import { TechExplorer } from "./TechExplorer";
import { TechGlyph } from "./TechGlyph";
import styles from "./Technology.module.css";

type Props = { variant?: "home" | "page" };

export function Technology({ variant = "home" }: Props) {
  const isPage = variant === "page";
  return (
    <section
      id="technology"
      className={`${styles.section} ${isPage ? styles.page : ""}`}
      aria-labelledby="technology-title"
    >
      <Container>
        <SectionHeading
          index="02"
          label="Technology"
          titleId="technology-title"
          level={isPage ? 1 : 2}
          title="What we’re building today."
          lead={
            isPage
              ? "Our current work covers four connected areas. Select one to see what it means at Darien Corporation."
              : "Our current work covers four connected areas. Each one supports the others, and all of them lead toward the harder problems ahead."
          }
          action={isPage ? undefined : { href: "/technology", label: "Explore our technology" }}
        />

        {isPage ? (
          <div className="page-rise" style={{ ["--rise-delay" as string]: "520ms" }}>
            <TechExplorer />
          </div>
        ) : (
          <ul role="list" className={styles.cards}>
            {capabilities.map((c, i) => (
              <li
                key={c.id}
                className={styles.item}
                data-reveal=""
                style={{ ["--reveal-delay" as string]: `${(i % 2) * 90}ms` }}
              >
                <article className={styles.card} data-area={c.id} data-glyph-host="" data-spotlight="">
                  <div className={styles.art} aria-hidden="true">
                    <TechGlyph id={c.id} />
                  </div>
                  <div className={styles.body}>
                    <p className={`${styles.index} meta`}>
                      <span>{c.index}</span>
                      <span className={styles.status}>Current work</span>
                    </p>
                    <h3 className={styles.title}>{c.title}</h3>
                    <p className={styles.summary}>{c.summary}</p>
                    <ul role="list" className={styles.points}>
                      {c.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
