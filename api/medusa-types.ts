/**
 * Minimal structural types for the Medusa v2 Store API responses we consume.
 * Kept local (instead of @medusajs/types) so the storefront stays
 * dependency-light; shapes follow https://docs.medusajs.com/api/store.
 */

export interface MedusaMoneyAmount {
  id?: string;
  currency_code?: string;
  amount?: number;
  original_amount?: number;
  calculated_amount?: number;
}

export interface MedusaProductOptionValue {
  id: string;
  value: string;
  option_id?: string;
}

export interface MedusaProductOption {
  id: string;
  title: string;
  values?: MedusaProductOptionValue[];
}

export interface MedusaProductVariant {
  id: string;
  title?: string;
  options?: (MedusaProductOptionValue & { option?: { title: string } })[];
  calculated_price?: MedusaMoneyAmount & {
    calculated_amount?: number;
    currency_code?: string;
  };
  inventory_quantity?: number;
  manage_inventory?: boolean;
}

export interface MedusaProductImage {
  id?: string;
  url: string;
}

export interface MedusaProductTag {
  id: string;
  value: string;
}

export interface MedusaProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
}

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  images?: MedusaProductImage[];
  options?: MedusaProductOption[];
  variants?: MedusaProductVariant[];
  tags?: MedusaProductTag[];
  categories?: MedusaProductCategory[];
  collection_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

export interface MedusaListResponse<T> {
  count: number;
  limit: number;
  offset: number;
}

export interface MedusaProductsResponse extends MedusaListResponse<MedusaProduct> {
  products: MedusaProduct[];
}

export interface MedusaCategoriesResponse
  extends MedusaListResponse<MedusaProductCategory> {
  product_categories: MedusaProductCategory[];
}

export interface MedusaCollectionsResponse
  extends MedusaListResponse<MedusaCollection> {
  collections: MedusaCollection[];
}

export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  countries?: { iso_2: string }[];
}

export interface MedusaRegionsResponse {
  regions: MedusaRegion[];
}

export interface MedusaLineItem {
  id: string;
  title: string;
  variant_id?: string | null;
  product_id?: string | null;
  thumbnail?: string | null;
  unit_price: number;
  quantity: number;
}

export interface MedusaCart {
  id: string;
  items?: MedusaLineItem[] | null;
  subtotal?: number;
  item_subtotal?: number;
  currency_code?: string;
}

export interface MedusaCartResponse {
  cart: MedusaCart;
}
