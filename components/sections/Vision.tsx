import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilities, visionAreas } from "@/lib/content";
import { HorizonScrubber } from "./HorizonScrubber";
import { VisionArt } from "./VisionArt";
import styles from "./Vision.module.css";

type Props = { variant?: "home" | "page" };

export function Vision({ variant = "home" }: Props) {
  const isPage = variant === "page";
  return (
    <section
      id="vision"
      className={`${styles.section} ${isPage ? styles.page : ""}`}
      aria-labelledby="vision-title"
    >
      <div className={styles.surface}>
        <div className={styles.backdrop} aria-hidden="true" />
        <Container className={styles.inner}>
          <SectionHeading
            index="04"
            label="Long-term vision"
            titleId="vision-title"
            title="Where we’re going next."
            tone="dark"
            level={isPage ? 1 : 2}
            action={isPage ? undefined : { href: "/vision", label: "Explore the horizon" }}
            lead="These are the areas we plan to explore over the coming years and decades. They are research directions, not current products or capabilities."
          />

          {/* Current work → long-term vision, made explicit. */}
          {isPage ? (
            <HorizonScrubber />
          ) : (
            <div className={styles.horizon} data-reveal="">
              <div className={styles.phase} data-phase="now">
                <p className={`${styles.phaseLabel} meta`}>
                  <span className={styles.phaseDot} aria-hidden="true" />
                  Today · Current work
                </p>
                <p className={styles.phaseItems}>{capabilities.map((c) => c.title).join(" · ")}</p>
              </div>
              <div className={styles.track} aria-hidden="true">
                <span className={styles.trackNow} />
                <span className={styles.trackMarker} />
                <span className={styles.trackFuture} />
              </div>
              <div className={styles.phase} data-phase="horizon">
                <p className={`${styles.phaseLabel} meta`}>
                  <span className={styles.phaseDot} aria-hidden="true" />
                  Horizon · Long-term research
                </p>
                <p className={styles.phaseItems}>{visionAreas.map((v) => v.title).join(" · ")}</p>
              </div>
            </div>
          )}

          <ul role="list" className={styles.grid}>
            {visionAreas.map((area, i) => (
              <li
                key={area.id}
                className={styles.item}
                data-reveal=""
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              >
                <article className={styles.card} data-spotlight="" aria-labelledby={`vision-${area.id}`}>
                  <div className={styles.cardHead}>
                    <span className="meta">H—{String(i + 1).padStart(2, "0")}</span>
                    <span className={`${styles.badge} meta`}>Research direction</span>
                  </div>
                  <div className={styles.art} aria-hidden="true">
                    <VisionArt id={area.id} />
                  </div>
                  <h3 id={`vision-${area.id}`} className={styles.title}>
                    {area.title}
                  </h3>
                  <p className={styles.summary}>{area.summary}</p>
                </article>
              </li>
            ))}
          </ul>

          <p className={`${styles.note} meta`} data-reveal="fade">
            Status: exploratory. Darien Corporation does not currently offer products in these areas.
          </p>
        </Container>
      </div>
    </section>
  );
}
