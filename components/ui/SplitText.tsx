import type { CSSProperties, ElementType } from "react";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  id?: string;
  /** Delay before the first word begins, in ms. */
  baseDelay?: number;
  /** When false, the reveal is controlled by a parent adding `.is-in`. */
  observe?: boolean;
  /** Extra words read by assistive tech and crawlers but not shown, e.g. the company name. */
  srPrefix?: string;
};

/**
 * Word-by-word mask reveal for major headings. The full text is exposed to
 * assistive technology via aria-label; the animated words are hidden from it.
 */
export function SplitText({
  as: Tag = "h2",
  text,
  className,
  id,
  baseDelay = 0,
  observe = true,
  srPrefix,
}: Props) {
  const words = text.split(" ");
  const label = srPrefix ? `${srPrefix} ${text}` : text;
  return (
    <Tag
      id={id}
      className={className}
      data-split=""
      data-observe={observe ? "" : undefined}
      aria-label={label}
      style={{ "--split-base": `${baseDelay}ms` } as CSSProperties}
    >
      {srPrefix ? <span className="visually-hidden">{srPrefix} </span> : null}
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="split-word">
            <span style={{ "--i": i } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
