import { ViewTransition } from "react";

const NAVIGATION_TYPES = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/**
 * Must be rendered inside each page.tsx (not the layout): layouts persist
 * across navigations, so enter/exit animations never fire there.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={NAVIGATION_TYPES}
      exit={NAVIGATION_TYPES}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
