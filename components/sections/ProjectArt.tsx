import type { Project } from "@/lib/content";
import styles from "./Projects.module.css";

/** Decorative project artwork (aria-hidden), used until product imagery is supplied. */

function MyFolksArt() {
  // Three circles of interest; the shared region is where people meet.
  const people = [
    { x: 150, y: 120, n: 0 },
    { x: 340, y: 110, n: 1 },
    { x: 250, y: 318, n: 2 },
    { x: 118, y: 220, n: 3 },
    { x: 380, y: 230, n: 4 },
    { x: 200, y: 70, n: 5 },
  ];
  return (
    <svg viewBox="0 0 500 360" className={styles.artSvg}>
      <g className={styles.circles}>
        <circle cx="200" cy="150" r="100" className={styles.circle} />
        <circle cx="300" cy="150" r="100" className={styles.circle} />
        <circle cx="250" cy="236.6" r="100" className={styles.circle} />
      </g>
      <path
        d="M 200 150 A 100 100 0 0 1 300 150 A 100 100 0 0 1 250 236.6 A 100 100 0 0 1 200 150 Z"
        className={styles.overlapSoft}
      />
      <circle cx="250" cy="179" r="6" className={styles.core} />
      {people.map((p) => (
        <circle
          key={p.n}
          cx={p.x}
          cy={p.y}
          r="4.5"
          className={styles.person}
          style={{
            ["--n" as string]: p.n,
            ["--dx" as string]: `${(250 - p.x) * 0.55}px`,
            ["--dy" as string]: `${(179 - p.y) * 0.55}px`,
          }}
        />
      ))}
    </svg>
  );
}

function LoremArt() {
  // Isometric wireframe on a grid floor: an engineer's drawing motif.
  const c = Math.cos(Math.PI / 6);
  const iso = (x: number, y: number, z: number) => {
    const px = 250 + (x - y) * c;
    const py = 200 + (x + y) * 0.5 - z;
    return `${px.toFixed(1)} ${py.toFixed(1)}`;
  };
  const s = 110;
  const edges: Array<[number[], number[]]> = [
    [
      [0, 0, 0],
      [s, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, s, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, s],
    ],
    [
      [s, 0, 0],
      [s, s, 0],
    ],
    [
      [0, s, 0],
      [s, s, 0],
    ],
    [
      [s, 0, 0],
      [s, 0, s],
    ],
    [
      [0, s, 0],
      [0, s, s],
    ],
    [
      [s, s, 0],
      [s, s, s],
    ],
    [
      [0, 0, s],
      [s, 0, s],
    ],
    [
      [0, 0, s],
      [0, s, s],
    ],
    [
      [s, 0, s],
      [s, s, s],
    ],
    [
      [0, s, s],
      [s, s, s],
    ],
  ];
  const floor = [];
  for (let i = -2; i <= 4; i++) {
    floor.push([
      [i * 45, -90, -40],
      [i * 45, 200, -40],
    ]);
    floor.push([
      [-90, i * 45, -40],
      [200, i * 45, -40],
    ]);
  }
  return (
    <svg viewBox="0 0 500 360" className={styles.artSvg}>
      <g className={styles.floor}>
        {floor.map(([a, b], i) => (
          <path key={i} d={`M ${iso(a[0], a[1], a[2])} L ${iso(b[0], b[1], b[2])}`} />
        ))}
      </g>
      <g className={styles.cube}>
        <path
          d={`M ${iso(0, 0, s)} L ${iso(s, 0, s)} L ${iso(s, s, s)} L ${iso(0, s, s)} Z`}
          className={styles.cubeTop}
        />
        {edges.map(([a, b], i) => (
          <path key={i} d={`M ${iso(a[0], a[1], a[2])} L ${iso(b[0], b[1], b[2])}`} className={styles.edge} />
        ))}
      </g>
    </svg>
  );
}

export function ProjectArt({ art }: { art: Project["art"] }) {
  if (art === "myfolks") return <MyFolksArt />;
  if (art === "lorem") return <LoremArt />;
  return null;
}
