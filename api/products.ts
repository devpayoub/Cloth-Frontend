import type { Product, Category } from "@/types";
import type {
  MedusaCategoriesResponse,
  MedusaProductsResponse,
  MedusaProductCategory,
} from "./medusa-types";
import { medusaClient } from "./client";
import { getDefaultRegionId } from "./regions";
import { CATALOG_REVALIDATE_SECONDS } from "./config";
import { mapMedusaProduct, type MappedProduct } from "./mappers";

export type ProductSort = "newest" | "price-asc" | "price-desc" | "rating";

export type ListProductsOptions = {
  category?: string;
  q?: string;
  sort?: ProductSort;
  limit?: number;
};

/**
 * Fetch all catalog products once; the catalog is small, so filtering and
 * sorting happen here after the fetch (Medusa can't sort by our metadata).
 * Pricing requires region context, variant option titles need the option
 * relation expanded.
 */
async function fetchRawProducts(): Promise<MappedProduct[]> {
  const regionId = await getDefaultRegionId();
  const response = await medusaClient.get<MedusaProductsResponse>(
    "/store/products",
    {
      query: {
        limit: 100,
        region_id: regionId ?? undefined,
        fields:
          "*variants.calculated_price,+variants.options.option,+metadata,+categories.handle",
      },
    }
  );
  return response.products.map(mapMedusaProduct);
}

let productsCache: { promise: Promise<MappedProduct[]>; at: number } | null =
  null;

/** Memo so client components share one in-flight request, TTL-bounded. */
function cachedProducts(): Promise<MappedProduct[]> {
  const now = Date.now();
  const ttlMs = CATALOG_REVALIDATE_SECONDS * 1000;
  if (!productsCache || now - productsCache.at > ttlMs) {
    productsCache = { promise: fetchRawProducts(), at: now };
  }
  return productsCache.promise;
}

function sortProducts(products: MappedProduct[], sort: ProductSort = "newest") {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export async function listProducts(
  options: ListProductsOptions = {}
): Promise<Product[]> {
  const { category, q, sort, limit } = options;
  let products = await cachedProducts();

  if (category) {
    products = products.filter((product) => product.category === category);
  }
  if (q) {
    const needle = q.toLowerCase();
    products = products.filter((product) =>
      [product.name, product.category, ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }

  return sortProducts(products, sort).slice(0, limit ?? products.length);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await cachedProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

/** Resolve the exact Medusa variant for the chosen size + color pair. */
export async function resolveVariantId(
  slug: string,
  size: string,
  color: string
): Promise<string | null> {
  const product = await getProduct(slug);
  if (!product) return null;
  const variants = (product as MappedProduct).variants ?? [];
  const match =
    variants.find(
      (variant) =>
        variant.size === size &&
        (variant.color === color || !variant.color || !color)
    ) ??
    variants.find((variant) => variant.size === size) ??
    variants[0];
  return match?.id ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const response = await medusaClient.get<MedusaCategoriesResponse>(
    "/store/product-categories",
    { query: { limit: 50 } }
  );
  return response.product_categories
    .filter((category: MedusaProductCategory) => !category.handle.includes("root"))
    .map((category) => ({
      id: category.id,
      slug: category.handle,
      name: category.name,
      description: category.description,
    }));
}
