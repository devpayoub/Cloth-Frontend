import type { Product } from "@/types";
import type { MedusaRegionsResponse } from "./medusa-types";
import { medusaClient } from "./client";
import { DEFAULT_CURRENCY } from "./config";

let regionIdPromise: Promise<string | null> | null = null;

/** The region that prices and carts are resolved against (USD by default). */
export async function getDefaultRegionId(): Promise<string | null> {
  regionIdPromise ??= medusaClient
    .get<MedusaRegionsResponse>("/store/regions", { query: { limit: 20 } })
    .then(
      (response) =>
        response.regions.find(
          (region) => region.currency_code === DEFAULT_CURRENCY
        )?.id ?? response.regions[0]?.id ?? null
    )
    .catch(() => null);
  return regionIdPromise;
}
