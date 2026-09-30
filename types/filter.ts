export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: SortOption;
  query?: string;
}
