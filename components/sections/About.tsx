import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { principles } from "@/lib/content";
import { site } from "@/lib/site";
import styles from "./About.module.css";

const facts = [
  { term: "Founded by", detail: site.founder },
  { term: "Current work", detail: "Software, artificial intelligence, web platforms" },
  { term: "Approach", detail: "Engineering-first, research-oriented" },
  { term: "Long-term vision", detail: "Aerospace, advanced mobility, spacetime, bionics" },
];

type Props = { variant?: "home" | "page" };

export function About({ variant = "home" }: Props) {
  const isPage = variant === "page";
  return (
    <section
      id="about"
      className={`${styles.section} ${isPage ? styles.page : ""}`}
      aria-labelledby="about-title"
    >
      <Container>
        <SectionHeading
          index="01"
          label="About"
          titleId="about-title"
          level={isPage ? 1 : 2}
          title="A technology company with a long horizon."
          lead="Darien Corporation builds useful technology today, and intends to take on much larger engineering and scientific challenges over time."
          action={isPage ? undefined : { href: "/about", label: "More about Darien" }}
        />

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p data-reveal="">
              We build software, AI, and digital products. We treat each one as an engineering problem:
              understand it precisely, build it carefully, and improve it through iteration.
            </p>
            <p data-reveal="" style={{ ["--reveal-delay" as string]: "80ms" }}>
              The company started with a simple aim: make technology that is actually useful. That aim now
              includes research, because the problems we care about most, such as flight, movement, the
              physics of space and time, and the link between people and machines, need patient and rigorous
              work before they can become products.
            </p>
            <p data-reveal="" style={{ ["--reveal-delay" as string]: "160ms" }}>
              We are a young company, and we are clear about where we stand. The work begins with what we can
              build today.
            </p>
          </div>

          <dl className={styles.facts} data-reveal="" style={{ ["--reveal-delay" as string]: "120ms" }}>
            {facts.map((f) => (
              <div key={f.term} className={styles.fact}>
                <dt className="meta">{f.term}</dt>
                <dd>{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {isPage ? (
          <div className={styles.principles}>
            <h2 id="principles-title" className={`${styles.principlesTitle} meta`} data-reveal="fade">
              How we work
            </h2>
            <ol role="list" className={styles.principleList}>
              {principles.map((p, i) => (
                <li
                  key={p.title}
                  className={styles.principle}
                  data-reveal=""
                  style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                >
                  <span className={`${styles.principleIndex} meta`}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={styles.principleName}>{p.title}</h3>
                  <p className={styles.principleBody}>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
