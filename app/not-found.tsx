import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import styles from "@/components/layout/LegalPage.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.header}>
          <p className={`${styles.label} meta`}>
            <span className={styles.bar} aria-hidden="true" />
            Error 404
          </p>
          <h1 className={styles.title}>This page doesn’t exist.</h1>
          <p className={styles.prose}>The link may be broken, or the page may have moved.</p>
        </header>
        <Button href="/">Return home</Button>
      </Container>
    </section>
  );
}
