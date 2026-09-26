import styles from "./Hero.module.css";

/**
 * Decorative calibration dial. Purely ornamental (aria-hidden): a measurement
 * motif, not a depiction of any real system or research result.
 */

const OUTER = 460;
const INNER = 300;

function outerTicks() {
  const ticks = [];
  for (let deg = 0; deg < 360; deg += 2) {
    const major = deg % 30 === 0;
    const mid = deg % 10 === 0;
    const len = major ? 30 : mid ? 16 : 8;
    const a = (deg * Math.PI) / 180;
    const x1 = Math.sin(a) * OUTER;
    const y1 = -Math.cos(a) * OUTER;
    const x2 = Math.sin(a) * (OUTER - len);
    const y2 = -Math.cos(a) * (OUTER - len);
    ticks.push(
      <line
        key={deg}
        x1={x1.toFixed(2)}
        y1={y1.toFixed(2)}
        x2={x2.toFixed(2)}
        y2={y2.toFixed(2)}
        className={major ? styles.tickMajor : styles.tick}
      />,
    );
  }
  return ticks;
}

function outerLabels() {
  const labels = [];
  for (let deg = 0; deg < 360; deg += 30) {
    const a = (deg * Math.PI) / 180;
    const r = OUTER - 54;
    labels.push(
      <text
        key={deg}
        x={(Math.sin(a) * r).toFixed(2)}
        y={(-Math.cos(a) * r).toFixed(2)}
        className={styles.dialLabel}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${deg} ${(Math.sin(a) * r).toFixed(2)} ${(-Math.cos(a) * r).toFixed(2)})`}
      >
        {String(deg).padStart(3, "0")}
      </text>,
    );
  }
  return labels;
}

function innerTicks() {
  const ticks = [];
  for (let deg = 0; deg < 360; deg += 15) {
    const a = (deg * Math.PI) / 180;
    const len = deg % 45 === 0 ? 14 : 6;
    ticks.push(
      <line
        key={deg}
        x1={(Math.sin(a) * INNER).toFixed(2)}
        y1={(-Math.cos(a) * INNER).toFixed(2)}
        x2={(Math.sin(a) * (INNER + len)).toFixed(2)}
        y2={(-Math.cos(a) * (INNER + len)).toFixed(2)}
        className={styles.tick}
      />,
    );
  }
  return ticks;
}

// Arc path helper (angles in degrees, 0 = top, clockwise).
function arc(r: number, from: number, to: number) {
  const p = (d: number) => {
    const a = (d * Math.PI) / 180;
    return `${(Math.sin(a) * r).toFixed(2)} ${(-Math.cos(a) * r).toFixed(2)}`;
  };
  const large = to - from > 180 ? 1 : 0;
  return `M ${p(from)} A ${r} ${r} 0 ${large} 1 ${p(to)}`;
}

export function HeroInstrument() {
  return (
    <div className={styles.instrument} aria-hidden="true">
      <div className={styles.parallax} data-parallax="">
        <div className={styles.instrumentInner}>
          {/* Static frame */}
          <svg className={styles.layer} viewBox="-500 -500 1000 1000">
            <circle r={OUTER + 14} className={styles.ring} />
            <circle r={INNER - 40} className={styles.ringFaint} />
            <line x1="-500" y1="0" x2="500" y2="0" className={styles.cross} />
            <line x1="0" y1="-500" x2="0" y2="500" className={styles.cross} />
            <circle r="3" className={styles.center} />
          </svg>
          {/* Slow outer rotation */}
          <svg className={`${styles.layer} ${styles.spinSlow}`} viewBox="-500 -500 1000 1000">
            <circle r={OUTER} className={styles.ring} />
            {outerTicks()}
            {outerLabels()}
            <path d={arc(OUTER + 14, 318, 352)} className={styles.arcMark} />
          </svg>
          {/* Counter rotation */}
          <svg className={`${styles.layer} ${styles.spinReverse}`} viewBox="-500 -500 1000 1000">
            <circle r={INNER} className={styles.ring} />
            {innerTicks()}
            <path d={arc(INNER - 40, 100, 160)} className={styles.arcFaint} />
          </svg>
        </div>
      </div>
    </div>
  );
}
