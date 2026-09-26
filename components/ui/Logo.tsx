import Image from "next/image";
import { site } from "@/lib/site";

type Props = {
  /** Rendered width in CSS pixels; height follows the original aspect ratio. */
  width: number;
  priority?: boolean;
  className?: string;
  /** Pass "" when the logo sits inside a link that already has a label. */
  alt?: string;
};

/**
 * The official Darien Corporation logo. Always rendered from the source
 * artwork at its native aspect ratio — never redrawn, recolored, or filtered.
 */
export function Logo({ width, priority, className, alt = site.logo.alt }: Props) {
  const height = Math.round((width * site.logo.height) / site.logo.width);
  return (
    <Image
      src={site.logo.src}
      width={width}
      height={height}
      alt={alt}
      priority={priority}
      className={className}
      unoptimized
      style={{ width, height: "auto", aspectRatio: `${site.logo.width} / ${site.logo.height}` }}
    />
  );
}
