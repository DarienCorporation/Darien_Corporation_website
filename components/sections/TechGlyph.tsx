import type { Capability } from "@/lib/content";
import styles from "./Technology.module.css";

/**
 * Abstract marks, one per capability area. Decorative only (aria-hidden).
 * Each animates on card hover/focus through CSS in Technology.module.css.
 */

function AiGlyph() {
  // Three layers of nodes, fully connected between adjacent layers.
  const layers = [
    [60, 100, 140],
    [40, 80, 120, 160],
    [70, 130],
  ];
  const xs = [70, 160, 250];
  const edges: Array<[number, number, number, number]> = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (const y1 of layers[l]) for (const y2 of layers[l + 1]) edges.push([xs[l], y1, xs[l + 1], y2]);
  }
  let n = 0;
  return (
    <svg viewBox="0 0 320 200" className={styles.glyph}>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.gEdge} />
      ))}
      {layers.map((ys, l) =>
        ys.map((y) => (
          <circle
            key={`${l}-${y}`}
            cx={xs[l]}
            cy={y}
            r={l === 1 ? 5 : 6}
            className={styles.gNode}
            style={{ ["--n" as string]: n++ }}
          />
        )),
      )}
    </svg>
  );
}

function SoftwareGlyph() {
  return (
    <svg viewBox="0 0 320 200" className={styles.glyph}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={styles.gLayer} style={{ ["--n" as string]: i }}>
          <path
            d={`M ${96 + i * 6} ${150 - i * 30} L ${236 + i * 6} ${150 - i * 30} L ${220 + i * 6} ${168 - i * 30} L ${80 + i * 6} ${168 - i * 30} Z`}
            className={i === 3 ? styles.gFillStrong : styles.gFill}
          />
        </g>
      ))}
    </svg>
  );
}

function WebGlyph() {
  const cols = 9;
  const rows = 5;
  const pts = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pts.push({ x: 40 + c * 30, y: 40 + r * 30, c, r });
    }
  }
  return (
    <svg viewBox="0 0 320 200" className={styles.glyph}>
      {Array.from({ length: rows }, (_, r) => (
        <line key={`h${r}`} x1="40" x2="280" y1={40 + r * 30} y2={40 + r * 30} className={styles.gEdge} />
      ))}
      {Array.from({ length: cols }, (_, c) => (
        <line key={`v${c}`} y1="40" y2="160" x1={40 + c * 30} x2={40 + c * 30} className={styles.gEdge} />
      ))}
      {pts.map((p) => (
        <rect
          key={`${p.c}-${p.r}`}
          x={p.x - 2.5}
          y={p.y - 2.5}
          width="5"
          height="5"
          className={styles.gPoint}
          style={{ ["--n" as string]: p.c + p.r }}
        />
      ))}
    </svg>
  );
}

function ResearchGlyph() {
  // Damped oscillation on a measured axis.
  const pts: string[] = [];
  for (let x = 0; x <= 240; x += 3) {
    const t = x / 240;
    const y = 100 - Math.sin(t * Math.PI * 6) * 52 * Math.exp(-t * 2.2);
    pts.push(`${(40 + x).toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 320 200" className={styles.glyph}>
      <line x1="40" y1="100" x2="290" y2="100" className={styles.gAxis} />
      <line x1="40" y1="36" x2="40" y2="164" className={styles.gAxis} />
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={i}
          x1={40 + i * 24}
          x2={40 + i * 24}
          y1="100"
          y2={i % 5 === 0 ? 108 : 104}
          className={styles.gAxis}
        />
      ))}
      <polyline points={pts.join(" ")} pathLength={1} className={styles.gWave} />
    </svg>
  );
}

export function TechGlyph({ id }: { id: Capability["id"] }) {
  switch (id) {
    case "ai":
      return <AiGlyph />;
    case "software":
      return <SoftwareGlyph />;
    case "web":
      return <WebGlyph />;
    case "research":
      return <ResearchGlyph />;
  }
}
