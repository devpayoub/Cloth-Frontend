import type { MedusaCartResponse, MedusaLineItem } from "./medusa-types";
import { medusaClient } from "./client";
import { getDefaultRegionId } from "./regions";

/** Line item as the cart store consumes it. */
export interface CartLineItem {
  lineItemId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface MedusaCartState {
  id: string;
  items: CartLineItem[];
  subtotal: number;
}

function mapLineItems(items: MedusaLineItem[] | null | undefined): CartLineItem[] {
  return (items ?? [])
    .filter((item) => item.variant_id)
    .map((item) => ({
      lineItemId: item.id,
      variantId: item.variant_id as string,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));
}

function mapCart(cart: NonNullable<MedusaCartResponse["cart"]>): MedusaCartState {
  return {
    id: cart.id,
    items: mapLineItems(cart.items),
    subtotal: cart.item_subtotal ?? cart.subtotal ?? 0,
  };
}

export async function createCart(): Promise<MedusaCartState | null> {
  const regionId = await getDefaultRegionId();
  const response = await medusaClient.post<MedusaCartResponse>("/store/carts", {
    region_id: regionId ?? undefined,
  });
  return mapCart(response.cart);
}

export async function getCart(cartId: string): Promise<MedusaCartState | null> {
  try {
    const response = await medusaClient.get<MedusaCartResponse>(
      `/store/carts/${cartId}`
    );
    return mapCart(response.cart);
  } catch {
    // The cart no longer exists (expired/cleared server-side).
    return null;
  }
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<MedusaCartState | null> {
  const response = await medusaClient.post<MedusaCartResponse>(
    `/store/carts/${cartId}/line-items`,
    { variant_id: variantId, quantity }
  );
  return mapCart(response.cart);
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<MedusaCartState | null> {
  const response = await medusaClient.post<MedusaCartResponse>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    { quantity }
  );
  return mapCart(response.cart);
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<MedusaCartState | null> {
  const response = await medusaClient.delete<MedusaCartResponse>(
    `/store/carts/${cartId}/line-items/${lineItemId}`
  );
  return mapCart(response.cart);
}
