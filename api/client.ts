import {
  CATALOG_REVALIDATE_SECONDS,
  MEDUSA_BACKEND_URL,
  MEDUSA_PUBLISHABLE_KEY,
} from "./config";

export class MedusaApiError extends Error {
  status: number;
  path: string;

  constructor(status: number, path: string, message: string) {
    super(`Medusa API ${status} on ${path}: ${message}`);
    this.name = "MedusaApiError";
    this.status = status;
    this.path = path;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  /** Server-side cache window override (ignored on the client). */
  revalidate?: number;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildPath(path: string, query?: RequestOptions["query"]) {
  if (!query) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request<T>(
  path: string,
  { method = "GET", body, revalidate, query }: RequestOptions = {}
): Promise<T> {
  const url = `${MEDUSA_BACKEND_URL}${buildPath(path, query)}`;
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_KEY;
  }

  const isServer = typeof window === "undefined";
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    // Cache options only apply inside React Server Components.
    ...(isServer
      ? {
          next: {
            revalidate: revalidate ?? CATALOG_REVALIDATE_SECONDS,
          },
        }
      : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new MedusaApiError(res.status, buildPath(path, query), text || res.statusText);
  }
  return (await res.json()) as T;
}

export const medusaClient = {
  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, options);
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, { method: "POST", body });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: "DELETE" });
  },
};
