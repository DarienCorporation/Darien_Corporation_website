import styles from "./Vision.module.css";

/** Minimal line marks for each long-term direction. Decorative (aria-hidden). */

function Aerospace() {
  const ticks = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = 20 + t * 200;
    const y = 120 - Math.pow(t, 1.8) * 96;
    ticks.push(<circle key={i} cx={x} cy={y} r={i === 8 ? 3.5 : 1.5} className={styles.mDot} />);
  }
  return (
    <svg viewBox="0 0 240 140" className={styles.mark}>
      <line x1="0" y1="124" x2="240" y2="124" className={styles.mFaint} />
      <path d="M 20 120 Q 150 118 220 24" className={styles.mLine} pathLength={1} />
      {ticks}
    </svg>
  );
}

function Mobility() {
  return (
    <svg viewBox="0 0 240 140" className={styles.mark}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={30 + i * 14}
          x2={210 - (4 - i) * 10}
          y1={34 + i * 18}
          y2={34 + i * 18}
          className={i === 2 ? styles.mLine : styles.mFaint}
          pathLength={1}
          style={{ ["--n" as string]: i }}
        />
      ))}
      <path d="M 196 52 L 222 70 L 196 88" className={styles.mLine} pathLength={1} />
    </svg>
  );
}

function Spacetime() {
  // Grid lines bending toward a point: curvature as an abstract motif.
  const lines = [];
  for (let i = 0; i <= 8; i++) {
    const y = 18 + i * 13;
    const depth = 30 * Math.exp(-Math.pow((y - 70) / 34, 2));
    lines.push(<path key={`h${i}`} d={`M 20 ${y} Q 120 ${y + depth} 220 ${y}`} className={styles.mFaint} />);
  }
  for (let i = 0; i <= 10; i++) {
    const x = 20 + i * 20;
    const pull = (120 - x) * 0.18 * Math.exp(-Math.pow((x - 120) / 60, 2));
    lines.push(<path key={`v${i}`} d={`M ${x} 18 Q ${x + pull} 90 ${x} 122`} className={styles.mFaint} />);
  }
  return (
    <svg viewBox="0 0 240 140" className={styles.mark}>
      {lines}
      <circle cx="120" cy="92" r="4" className={styles.mDotSolid} />
    </svg>
  );
}

function Bionics() {
  return (
    <svg viewBox="0 0 240 140" className={styles.mark}>
      <path d="M 40 110 L 110 60 L 190 84" className={styles.mLine} pathLength={1} />
      <circle cx="40" cy="110" r="5" className={styles.mJoint} />
      <circle cx="110" cy="60" r="7" className={styles.mJoint} />
      <circle cx="190" cy="84" r="5" className={styles.mJoint} />
      <path d="M 92 44 A 26 26 0 0 1 132 50" className={styles.mFaint} />
      <line x1="20" y1="124" x2="220" y2="124" className={styles.mFaint} />
    </svg>
  );
}

const marks = { aerospace: Aerospace, mobility: Mobility, spacetime: Spacetime, bionics: Bionics } as const;

export function VisionArt({ id }: { id: string }) {
  const Mark = marks[id as keyof typeof marks];
  return Mark ? <Mark /> : null;
}
