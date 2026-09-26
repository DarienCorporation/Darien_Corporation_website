"use client";

import { startTransition, useEffect, useId, useRef, useState, ViewTransition } from "react";
import { capabilities, type Capability } from "@/lib/content";
import { TechGlyph } from "./TechGlyph";
import styles from "./Technology.module.css";

/** Re-mounts per area so the glyph assembles itself each time it is shown. */
function GlyphStage({ id }: { id: Capability["id"] }) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setLive(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);
  return (
    <div className={`${styles.stage} ${live ? "is-in" : ""}`} aria-hidden="true">
      <div className={styles.stageArt} data-glyph-host="" data-area={id}>
        <TechGlyph id={id} />
      </div>
    </div>
  );
}

export function TechExplorer() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const current = capabilities[active];

  function select(i: number, focus = false) {
    const next = (i + capabilities.length) % capabilities.length;
    startTransition(() => setActive(next));
    if (focus) tabsRef.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const keys: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: capabilities.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  }

  return (
    <div className={styles.explorer}>
      <div role="tablist" aria-label="Technology areas" className={styles.tabs}>
        {capabilities.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            id={`${uid}-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => select(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className={`${styles.tabIndex} meta`}>{c.index}</span>
            <span className={styles.tabTitle}>{c.title}</span>
            <span className={styles.tabBar} aria-hidden="true" />
          </button>
        ))}
      </div>

      <ViewTransition key={current.id} name="tech-panel" share="swap" enter="swap" default="none">
        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${current.id}`}
          className={styles.panel}
          data-spotlight=""
        >
          <GlyphStage id={current.id} />
          <div className={styles.panelBody}>
            <p className={`${styles.index} meta`}>
              <span>
                {current.index} / {String(capabilities.length).padStart(2, "0")}
              </span>
              <span className={styles.status}>Current work</span>
            </p>
            <h2 className={styles.panelTitle}>{current.title}</h2>
            <p className={styles.panelLead}>{current.summary}</p>
            <p className={styles.summary}>{current.detail}</p>
            <ul role="list" className={styles.points} aria-label={`${current.title} focus`}>
              {current.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className={styles.stepper}>
              <button type="button" className={styles.step} onClick={() => select(active - 1)}>
                <span aria-hidden="true">←</span>
                <span className="visually-hidden">Previous area</span>
              </button>
              <span className={`${styles.stepCount} meta`} aria-hidden="true">
                {capabilities.map((c, i) => (
                  <span key={c.id} data-on={i === active || undefined} />
                ))}
              </span>
              <button type="button" className={styles.step} onClick={() => select(active + 1)}>
                <span aria-hidden="true">→</span>
                <span className="visually-hidden">Next area</span>
              </button>
            </div>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
