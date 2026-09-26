"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, ViewTransition } from "react";
import { NavLink } from "@/components/navigation/NavLink";
import { legalNav } from "@/lib/site";
import styles from "./LegalPage.module.css";

/** Segmented switch between the legal documents. */
export function LegalSwitch() {
  const pathname = usePathname();
  const index = Math.max(
    0,
    legalNav.findIndex((l) => l.href === pathname),
  );
  return (
    <nav aria-label="Legal documents" className={styles.switch} style={{ ["--i" as string]: index }}>
      {/* Named so the thumb glides between documents instead of sliding with the page. */}
      <ViewTransition name="legal-switch-thumb" share="morph" default="none">
        <span className={styles.switchThumb} aria-hidden="true" />
      </ViewTransition>
      {legalNav.map((l) => (
        <NavLink
          key={l.href}
          href={l.href}
          className={styles.switchItem}
          aria-current={pathname === l.href ? "page" : undefined}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** "On this page" contents built from the document's h2 headings, with scroll tracking. */
export function LegalToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<Array<{ id: string; text: string }>>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLHeadingElement>("[data-legal-prose] h2"));
    const list = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent ?? "");
      return { id: h.id, text: h.textContent ?? "" };
    });
    setItems(list);
    setActive(list[0]?.id ?? null);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className={styles.toc}>
      <p className={`${styles.tocTitle} meta`}>On this page</p>
      <ol role="list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={styles.tocLink}
              aria-current={active === item.id ? "location" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
