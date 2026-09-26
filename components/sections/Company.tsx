import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { leadership } from "@/lib/content";
import styles from "./Company.module.css";

export function Company() {
  return (
    <section id="company" className={styles.section} aria-labelledby="company-title">
      <Container>
        <SectionHeading
          index="01"
          label="Leadership"
          titleId="company-title"
          title="Who is building it."
          align="stack"
        />

        <ul role="list" className={styles.people}>
          {leadership.map((person) => (
            <li key={person.name} className={styles.person} data-reveal="">
              <div className={styles.role}>
                <span className={styles.roleBar} aria-hidden="true" />
                <span className="meta">{person.role}</span>
              </div>
              <div className={styles.detail}>
                <h3 className={styles.name}>{person.name}</h3>
                <p className={styles.bio}>{person.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
