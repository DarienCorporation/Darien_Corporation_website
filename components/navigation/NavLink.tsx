"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { directionBetween } from "@/lib/navigation";

type Props = Omit<ComponentProps<typeof Link>, "href" | "transitionTypes"> & {
  href: string;
  /** Force a direction, e.g. "back" links. */
  direction?: "nav-forward" | "nav-back";
};

/**
 * Internal link that tags the navigation with a direction so pages can slide
 * forward or back (see PageTransition). Falls back to a plain navigation when
 * the browser has no View Transitions support.
 */
export function NavLink({ href, direction, ...rest }: Props) {
  const pathname = usePathname();
  const dir = direction ?? directionBetween(pathname, href);
  return <Link href={href} transitionTypes={dir ? [dir] : undefined} {...rest} />;
}
