import type { Product } from "./product";

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
