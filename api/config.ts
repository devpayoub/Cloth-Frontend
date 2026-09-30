/**
 * Single source of truth for backend connection settings.
 * Nothing else in the app may read these env vars or hardcode URLs/tokens.
 */
export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

/** Server-side fetch cache window for catalog reads. */
export const CATALOG_REVALIDATE_SECONDS = 60;

export const DEFAULT_CURRENCY = "usd";
