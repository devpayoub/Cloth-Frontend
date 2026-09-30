import type { Product } from "@/types";
import type { MedusaProduct, MedusaProductVariant } from "./medusa-types";

/** Variant identity the UI needs for "add to cart". */
export interface MappedProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
}

export interface MappedProduct extends Product {
  variants: MappedProductVariant[];
}

const FALLBACK_COLOR_HEX: Record<string, string> = {
  black: "#111111",
  white: "#f5f5f5",
  beige: "#c8b89a",
  olive: "#5c5c3d",
  indigo: "#2e4a6b",
  navy: "#1f2d3d",
  grey: "#9ca3af",
  gray: "#9ca3af",
  brown: "#6b4f3a",
  green: "#3d5c45",
  red: "#8c2f2f",
  blue: "#2e4a6b",
};

/** Medusa amounts are minor units (cents for USD); convert to major units. */
const CURRENCY_DECIMALS: Record<string, number> = {
  usd: 2,
  eur: 2,
  gbp: 2,
  jpy: 0,
  krw: 0,
};

function toMajorUnits(amount: number | undefined, currency = "usd"): number {
  if (amount === undefined) return 0;
  const decimals = CURRENCY_DECIMALS[currency.toLowerCase()] ?? 2;
  return amount / 10 ** decimals;
}

function metadataOf(product: MedusaProduct): Record<string, unknown> {
  return (product.metadata ?? {}) as Record<string, unknown>;
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function optionValues(product: MedusaProduct, optionTitle: string): string[] {
  const option = product.options?.find(
    (option) => option.title.toLowerCase() === optionTitle.toLowerCase()
  );
  return (option?.values ?? []).map((value) => value.value);
}

function variantOptionValue(
  variant: MedusaProductVariant,
  optionTitle: string
): string {
  const option = variant.options?.find(
    (option) => option.option?.title?.toLowerCase() === optionTitle.toLowerCase()
  );
  return option?.value ?? "";
}

/**
 * Medusa stores absolute image URLs. When they point at the storefront's own
 * origin (seeded that way), strip back to a local path so next/image treats
 * them as local assets.
 */
function normalizeImage(url: string): string {
  if (!url.startsWith("http")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/clo/")) return parsed.pathname;
    return url;
  } catch {
    return url;
  }
}

function imagesOf(product: MedusaProduct): string[] {
  const urls = [
    product.thumbnail ?? "",
    ...(product.images ?? []).map((image) => image.url),
  ]
    .filter(Boolean)
    .map(normalizeImage);
  return [...new Set(urls)];
}

function colorsOf(product: MedusaProduct): Product["colors"] {
  const metadata = metadataOf(product);
  const seeded = parseJson<Product["colors"]>(metadata.colors, []);
  if (seeded.length > 0) return seeded;

  return optionValues(product, "color").map((name) => ({
    name,
    hex: FALLBACK_COLOR_HEX[name.toLowerCase()] ?? "#9ca3af",
  }));
}

function mapVariants(
  product: MedusaProduct,
  currency: string
): MappedProductVariant[] {
  return (product.variants ?? []).map((variant) => ({
    id: variant.id,
    size: variantOptionValue(variant, "Size"),
    color: variantOptionValue(variant, "Color"),
    price: toMajorUnits(variant.calculated_price?.calculated_amount, currency),
  }));
}

export function mapMedusaProduct(product: MedusaProduct): MappedProduct {
  const metadata = metadataOf(product);
  const currency =
    product.variants?.find((v) => v.calculated_price?.currency_code)
      ?.calculated_price?.currency_code ?? "usd";
  const variants = mapVariants(product, currency);
  const prices = variants.map((variant) => variant.price).filter((p) => p > 0);

  return {
    id: product.id,
    slug: product.handle,
    name: product.title,
    description: product.description ?? "",
    price: prices.length > 0 ? Math.min(...prices) : 0,
    currency: currency.toUpperCase(),
    images: imagesOf(product),
    category: product.categories?.[0]?.handle ?? "",
    tags: parseJson<string[]>(metadata.tags, []),
    sizes: optionValues(product, "size"),
    colors: colorsOf(product),
    rating: typeof metadata.rating === "number" ? metadata.rating : 0,
    reviewCount:
      typeof metadata.reviewCount === "number" ? metadata.reviewCount : 0,
    inStock: variants.length > 0,
    isFeatured:
      metadata.isFeatured === true || metadata.isFeatured === "true",
    isNew: metadata.isNew === true || metadata.isNew === "true",
    createdAt: product.created_at ?? new Date(0).toISOString(),
    variants,
  };
}
