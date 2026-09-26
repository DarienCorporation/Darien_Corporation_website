/**
 * Navigation direction for route transitions. Pages have a fixed order that
 * matches the story of the site; moving to a later page slides forward,
 * moving to an earlier one slides back.
 */

const ORDER = ["/", "/about", "/technology", "/projects", "/vision", "/contact", "/privacy", "/terms"];

function rank(path: string): number {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const exact = ORDER.indexOf(clean);
  if (exact !== -1) return exact;
  // Nested routes (e.g. /projects/myfolks) sit just after their parent.
  const parent = ORDER.findIndex((p) => p !== "/" && clean.startsWith(`${p}/`));
  return parent === -1 ? ORDER.length : parent + 0.5;
}

export type NavDirection = "nav-forward" | "nav-back";

export function directionBetween(from: string, to: string): NavDirection | null {
  const target = to.split("#")[0] || from;
  if (!target.startsWith("/")) return null;
  const a = rank(from);
  const b = rank(target);
  if (a === b) return null;
  return b > a ? "nav-forward" : "nav-back";
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
