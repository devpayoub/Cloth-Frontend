export interface ProductColor {
  name: string;
  hex: string;
}

/** A purchasable size+color combination resolved from the backend. */
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  variants?: ProductVariant[];
}
