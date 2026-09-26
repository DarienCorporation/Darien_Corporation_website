import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/lib/site";
import { HeroInstrument } from "./HeroInstrument";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.light} />
      </div>
      <HeroInstrument />

      <Container className={styles.inner}>
        <div className={styles.content}>
          <p className={`${styles.eyebrow} meta`}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            {site.name}
          </p>

          <SplitText
            as="h1"
            id="hero-title"
            text={site.tagline}
            srPrefix={`${site.name}:`}
            className={styles.title}
            observe={false}
          />

          <p className={styles.lead}>
            We develop software, AI, and digital products, and we are working toward a long-term vision in
            engineering and scientific research.
          </p>

          <div className={styles.actions}>
            <Button href="/projects">Explore our work</Button>
            <Button href="/about" variant="secondary">
              Learn about Darien
            </Button>
          </div>
        </div>

        <dl className={styles.index}>
          <div className={styles.indexCol}>
            <dt className="meta">Now</dt>
            <dd>Software, AI, and web platforms</dd>
          </div>
          <div className={styles.indexRule} aria-hidden="true">
            {Array.from({ length: 41 }, (_, i) => (
              <span key={i} className={i % 10 === 0 ? styles.ruleMajor : undefined} />
            ))}
          </div>
          <div className={styles.indexCol}>
            <dt className="meta">Horizon</dt>
            <dd>Aerospace, mobility, spacetime, bionics</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
