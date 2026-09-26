"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "@/components/navigation/NavLink";
import { openCommandMenu } from "@/components/navigation/CommandMenu";
import { Logo } from "@/components/ui/Logo";
import { isActivePath } from "@/lib/navigation";
import { legalNav, primaryNav, site } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Compress the header once the page has scrolled.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, trap focus, close on Escape or on resize to desktop.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add(styles.locked);

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => mq.matches && close(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.classList.remove(styles.locked);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  // Close the menu after navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className={styles.bar}>
        <NavLink
          href="/"
          className={styles.brand}
          aria-label={`${site.name} — home`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span className={styles.logoWrap}>
            <Logo width={112} priority alt="" />
          </span>
        </NavLink>

        <div className={styles.right}>
          <nav className={styles.nav} aria-label="Primary">
            <ul role="list" className={styles.navList}>
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <NavLink
                    href={item.href}
                    className={styles.navLink}
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button type="button" className={styles.command} onClick={openCommandMenu}>
            <span className={styles.commandLabel}>Search</span>
            <kbd className={styles.kbd} aria-hidden="true">
              ⌘K
            </kbd>
            <span className="visually-hidden">(press Command K or Control K)</span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.toggleLine} />
            <span className={styles.toggleLine} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ol role="list" className={styles.panelList}>
            {[{ label: "Home", href: "/", id: "home", description: "" }, ...primaryNav].map((item, i) => (
              <li key={item.id} style={{ ["--i" as string]: i }}>
                <NavLink
                  href={item.href}
                  className={styles.panelLink}
                  aria-current={
                    (item.href === "/" ? pathname === "/" : isActivePath(pathname, item.href))
                      ? "page"
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className={`${styles.panelIndex} meta`}>{String(i).padStart(2, "0")}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.panelFoot}>
          <a href={`mailto:${site.contact.email}`} className={styles.panelEmail}>
            {site.contact.email}
          </a>
          <ul role="list" className={`${styles.panelLegal} meta`}>
            {legalNav.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
