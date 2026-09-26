"use client";

import { useEffect } from "react";

/**
 * Desktop-only pointer refinements, via event delegation (no per-element
 * listeners):
 *  - [data-spotlight]: exposes --mx / --my for a soft light that follows the pointer.
 *  - [data-magnetic]:  a small pull toward the pointer (max ~6px).
 *  - [data-parallax]:  exposes --px / --py (-1..1) for pointer-driven depth.
 * Disabled for touch/coarse pointers and for reduced-motion users.
 */
export function PointerEffects() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty("--mag-x", "0px");
      el.style.setProperty("--mag-y", "0px");
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e || !(e.target instanceof Element)) return;

      // Parallax layers respond to the pointer position across the viewport.
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });

      const spot = e.target.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const mag = e.target.closest<HTMLElement>("[data-magnetic]");
      if (mag !== magnet) {
        release(magnet);
        magnet = mag;
      }
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        mag.style.setProperty("--mag-x", `${(dx * 6).toFixed(2)}px`);
        mag.style.setProperty("--mag-y", `${(dy * 4).toFixed(2)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      release(magnet);
      magnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
