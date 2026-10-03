/**
 * Single source of truth for backend connection settings.
 * Nothing else in the app may read these env vars or hardcode URLs/tokens.
 */
export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

/** Server-side fetch cache window for catalog reads.
 * 0 in development so admin edits are visible immediately; 60 s in production. */
export const CATALOG_REVALIDATE_SECONDS =
  process.env.NODE_ENV === "development" ? 0 : 60;

export const DEFAULT_CURRENCY = "usd";
