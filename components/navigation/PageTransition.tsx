import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page so it slides in the direction of travel during client-side
 * navigation. Must be used in each page (not the layout): layouts persist, so
 * enter/exit never fire there.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
