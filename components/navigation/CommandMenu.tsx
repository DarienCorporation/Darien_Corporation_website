"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { projects } from "@/lib/content";
import { directionBetween } from "@/lib/navigation";
import { legalNav, primaryNav, site } from "@/lib/site";
import styles from "./CommandMenu.module.css";

const OPEN_EVENT = "darien:command-menu";

/** Opens the command menu from anywhere (e.g. the header button). */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Item = {
  id: string;
  group: "Pages" | "Projects" | "Actions" | "Legal";
  label: string;
  hint?: string;
  run: { type: "route"; href: string } | { type: "copy"; value: string } | { type: "external"; href: string };
};

function buildItems(): Item[] {
  return [
    { id: "home", group: "Pages", label: "Home", hint: "Start", run: { type: "route", href: "/" } },
    ...primaryNav.map<Item>((n) => ({
      id: n.id,
      group: "Pages",
      label: n.label,
      hint: n.description,
      run: { type: "route", href: n.href },
    })),
    ...projects.map<Item>((p) => ({
      id: `project-${p.slug}`,
      group: "Projects",
      label: p.name,
      hint: p.category,
      run: { type: "route", href: `/projects/${p.slug}` },
    })),
    {
      id: "email",
      group: "Actions",
      label: "Email Darien Corporation",
      hint: site.contact.email,
      run: { type: "external", href: `mailto:${site.contact.email}` },
    },
    {
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      hint: site.contact.email,
      run: { type: "copy", value: site.contact.email },
    },
    ...legalNav.map<Item>((l) => ({
      id: `legal-${l.href}`,
      group: "Legal",
      label: l.label === "Privacy" ? "Privacy Policy" : "Terms of Use",
      run: { type: "route", href: l.href },
    })),
  ];
}

/** Relevance: label prefix > label contains > hint/group contains. 0 = no match. */
function score(item: Item, q: string): number {
  if (!q) return 1;
  const label = item.label.toLowerCase();
  const hay = `${label} ${item.hint ?? ""} ${item.group}`.toLowerCase();
  const parts = q.toLowerCase().split(/\s+/);
  if (!parts.every((part) => hay.includes(part))) return 0;
  if (label.startsWith(parts[0])) return 3;
  if (parts.every((part) => label.includes(part))) return 2;
  return 1;
}

export function CommandMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const uid = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const all = useMemo(buildItems, []);
  const q = query.trim();
  const results = useMemo(
    () =>
      all
        .map((item, i) => ({ item, s: score(item, q), i }))
        .filter((r) => r.s > 0)
        // Best matches first while searching; otherwise keep the grouped order.
        .sort((a, b) => (q ? b.s - a.s : 0) || a.i - b.i)
        .map((r) => r.item),
    [all, q],
  );

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setQuery("");
    setActive(0);
    d.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  // Global shortcut: ⌘K / Ctrl+K, plus "/" when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      } else if (e.key === "/" && !typing && !dialogRef.current?.open) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, open);
    };
  }, [open, close]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  // Keep the active option in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  async function run(item: Item) {
    if (item.run.type === "route") {
      const dir = directionBetween(pathname, item.run.href);
      close();
      router.push(item.run.href, { transitionTypes: dir ? [dir] : undefined });
    } else if (item.run.type === "external") {
      close();
      window.location.href = item.run.href;
    } else {
      try {
        await navigator.clipboard.writeText(item.run.value);
        setToast("Email address copied");
      } catch {
        setToast("Couldn’t access the clipboard");
      }
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) void run(item);
    }
  }

  let lastGroup: string | null = null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Quick navigation"
      onClick={(e) => {
        // Click on the backdrop closes the menu.
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.search}>
          <span className={styles.searchBar} aria-hidden="true" />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={results[active] ? `${uid}-${results[active].id}` : undefined}
            aria-autocomplete="list"
            placeholder="Where would you like to go?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.esc}>Esc</kbd>
        </div>

        <ul ref={listRef} id={`${uid}-list`} role="listbox" className={styles.list} aria-label="Results">
          {results.length === 0 ? (
            <li className={styles.empty} role="presentation">
              Nothing matches “{query}”.
            </li>
          ) : (
            results.map((item, i) => {
              const header = !q && item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              return (
                <li key={item.id} role="presentation">
                  {header ? (
                    <p className={`${styles.group} meta`} aria-hidden="true">
                      {header}
                    </p>
                  ) : null}
                  <div
                    id={`${uid}-${item.id}`}
                    role="option"
                    aria-selected={i === active}
                    data-index={i}
                    className={styles.option}
                    onMouseMove={() => setActive(i)}
                    onClick={() => void run(item)}
                  >
                    <span className={styles.optionLabel}>{item.label}</span>
                    {item.hint ? <span className={styles.optionHint}>{item.hint}</span> : null}
                    <span className={styles.optionIcon} aria-hidden="true">
                      {item.run.type === "route" ? <ArrowRight /> : <ArrowUpRight />}
                    </span>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className={`${styles.foot} meta`} aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
          <span className={styles.footBrand}>{site.name}</span>
        </div>

        <p className={styles.toast} role="status" data-show={toast ? "" : undefined}>
          {toast}
        </p>
      </div>
    </dialog>
  );
}
