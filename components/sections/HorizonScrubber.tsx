"use client";

import { startTransition, useCallback, useRef, useState, ViewTransition } from "react";
import { capabilities, visionAreas } from "@/lib/content";
import { VisionArt } from "./VisionArt";
import styles from "./Vision.module.css";

type Stop = {
  id: string;
  label: string;
  kind: "current" | "research";
  title: string;
  summary: string;
};

const stops: Stop[] = [
  {
    id: "today",
    label: "Today",
    kind: "current",
    title: "Current work",
    summary:
      "What Darien Corporation builds today: software, artificial intelligence, web platforms, and engineering research.",
  },
  ...visionAreas.map<Stop>((v) => ({
    id: v.id,
    label: v.title,
    kind: "research",
    title: v.title,
    summary: v.summary,
  })),
];

const last = stops.length - 1;

/**
 * A draggable "now → horizon" scrubber. The first stop is current work; every
 * stop after it is explicitly labelled as a long-term research direction.
 */
export function HorizonScrubber() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const activeRef = useRef(0);

  const commit = useCallback((i: number) => {
    const next = Math.max(0, Math.min(last, i));
    if (next === activeRef.current) return;
    activeRef.current = next;
    startTransition(() => setActive(next));
  }, []);

  const fractionAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const f = fractionAt(e.clientX);
    setDrag(f);
    commit(Math.round(f * last));
    (e.currentTarget.querySelector("[role=slider]") as HTMLElement | null)?.focus({ preventScroll: true });
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (drag === null) return;
    const f = fractionAt(e.clientX);
    setDrag(f);
    commit(Math.round(f * last));
  }

  function onPointerUp() {
    setDrag(null);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowUp: active + 1,
      PageUp: active + 1,
      ArrowLeft: active - 1,
      ArrowDown: active - 1,
      PageDown: active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      commit(map[e.key]);
    }
  }

  const stop = stops[active];
  const position = (drag ?? active / last) * 100;
  const todayPct = 0;

  return (
    <div className={styles.scrubber} data-reveal="">
      <div className={styles.scrubHead}>
        <p className={`${styles.phaseLabel} meta`}>
          <span className={styles.phaseDot} aria-hidden="true" />
          Today
        </p>
        <p className={`${styles.scrubHint} meta`} aria-hidden="true">
          Drag, tap, or use arrow keys
        </p>
        <p className={`${styles.phaseLabel} meta`} data-phase="horizon">
          Long-term horizon
          <span className={styles.phaseDotHollow} aria-hidden="true" />
        </p>
      </div>

      <div
        ref={trackRef}
        className={styles.scrubTrack}
        data-dragging={drag !== null || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className={styles.scrubRail} aria-hidden="true" />
        <span
          className={styles.scrubFill}
          style={{ width: `${Math.max(position, todayPct)}%` }}
          aria-hidden="true"
        />
        {stops.map((s, i) => (
          <span
            key={s.id}
            className={styles.scrubStop}
            data-kind={s.kind}
            data-on={i === active || undefined}
            data-passed={i < active || undefined}
            style={{ left: `${(i / last) * 100}%` }}
            aria-hidden="true"
          >
            <span className={styles.scrubStopLabel}>{s.label}</span>
          </span>
        ))}
        <span
          role="slider"
          tabIndex={0}
          aria-label="Explore from today to the long-term horizon"
          aria-valuemin={0}
          aria-valuemax={last}
          aria-valuenow={active}
          aria-valuetext={`${stop.label}: ${stop.kind === "current" ? "current work" : "long-term research direction"}`}
          className={styles.scrubHandle}
          style={{ left: `${position}%` }}
          onKeyDown={onKeyDown}
        />
      </div>

      <ViewTransition key={stop.id} name="horizon-panel" share="swap" enter="swap" default="none">
        <div className={styles.scrubPanel} data-kind={stop.kind} aria-live="polite">
          <div className={styles.scrubPanelText}>
            <span className={`${styles.badge} meta`} data-kind={stop.kind}>
              {stop.kind === "current" ? "Current work · Active" : "Research direction · Long-term"}
            </span>
            <h2 className={styles.scrubTitle}>{stop.title}</h2>
            <p className={styles.scrubSummary}>{stop.summary}</p>
            {stop.kind === "current" ? (
              <ul role="list" className={styles.scrubList}>
                {capabilities.map((c) => (
                  <li key={c.id}>{c.title}</li>
                ))}
              </ul>
            ) : (
              <p className={`${styles.scrubDisclaimer} meta`}>
                Exploratory. Not a current product or capability.
              </p>
            )}
          </div>
          <div className={styles.scrubArt} aria-hidden="true">
            {stop.kind === "current" ? (
              <svg viewBox="0 0 240 140" className={styles.mark}>
                {[0, 1, 2, 3].map((i) => (
                  <rect
                    key={i}
                    x={36 + i * 44}
                    y={70 - i * 12}
                    width="32"
                    height={40 + i * 12}
                    className={i === 3 ? styles.mBlockSolid : styles.mBlock}
                  />
                ))}
                <line x1="20" y1="124" x2="220" y2="124" className={styles.mFaint} />
              </svg>
            ) : (
              <VisionArt id={stop.id} />
            )}
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
