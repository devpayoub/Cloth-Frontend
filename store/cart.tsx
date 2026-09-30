"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks";
import { listProducts, resolveVariantId } from "@/api";
import {
  addLineItem as apiAddLineItem,
  createCart,
  getCart,
  removeLineItem as apiRemoveLineItem,
  updateLineItem as apiUpdateLineItem,
} from "@/api";

export type CartItem = {
  slug: string;
  size: string;
  color: string;
  qty: number;
  /** Resolved Medusa ids — present once the item is synced to the backend. */
  variantId?: string;
  lineItemId?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (item: Omit<CartItem, "qty">) => void;
  setQty: (item: Omit<CartItem, "qty">, qty: number) => void;
  clear: () => void;
};

const CART_ID_KEY = "cloth-medusa-cart-id";

const CartContext = createContext<CartContextValue | null>(null);

function sameItem(a: Omit<CartItem, "qty">, b: CartItem) {
  return a.slug === b.slug && a.size === b.size && a.color === b.color;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cloth-cart", []);
  const [cartId, setCartId] = useLocalStorage<string | null>(CART_ID_KEY, null);
  const [prices, setPrices] = useState<Record<string, number>>({});

  // Resolve unit prices for everything in the cart from the catalog.
  useEffect(() => {
    let cancelled = false;
    const slugs = [...new Set(items.map((item) => item.slug))];
    const missing = slugs.filter((slug) => prices[slug] === undefined);
    if (missing.length === 0) return;
    (async () => {
      try {
        const catalog = await listProducts();
        if (cancelled) return;
        const next: Record<string, number> = {};
        for (const product of catalog) next[product.slug] = product.price;
        setPrices((prev) => ({ ...prev, ...next }));
      } catch {
        // Prices stay unresolved when the backend is unreachable.
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  /** Lazily create the Medusa cart and remember its id. */
  const ensureCart = useCallback(async (): Promise<string | null> => {
    if (cartId) {
      const existing = await getCart(cartId);
      if (existing) return existing.id;
    }
    const created = await createCart();
    if (!created) return null;
    setCartId(created.id);
    return created.id;
  }, [cartId, setCartId]);

  /** Push a locally-known item to the backend and store its line-item id. */
  const syncAdd = useCallback(
    async (item: Omit<CartItem, "qty">, qty: number) => {
      try {
        const id = await ensureCart();
        if (!id) return;
        const variantId =
          item.variantId ?? (await resolveVariantId(item.slug, item.size, item.color));
        if (!variantId) return;
        await apiAddLineItem(id, variantId, qty);
        setItems((prev) =>
          prev.map((entry) =>
            sameItem(item, entry) ? { ...entry, variantId } : entry
          )
        );
      } catch {
        // Offline-first: the local cart still works without the backend.
      }
    },
    [ensureCart, setItems]
  );

  const add = useCallback(
    (item: Omit<CartItem, "qty">) => {
      let newQty = 1;
      setItems((prev) => {
        const existing = prev.find((entry) => sameItem(item, entry));
        newQty = (existing?.qty ?? 0) + 1;
        return existing
          ? prev.map((entry) =>
              sameItem(item, entry) ? { ...entry, qty: entry.qty + 1 } : entry
            )
          : [...prev, { ...item, qty: 1 }];
      });
      void syncAdd(item, newQty);
    },
    [setItems, syncAdd]
  );

  const setQty = useCallback(
    (item: Omit<CartItem, "qty">, qty: number) => {
      const target = items.find((entry) => sameItem(item, entry));
      setItems((prev) =>
        qty <= 0
          ? prev.filter((entry) => !sameItem(item, entry))
          : prev.map((entry) => (sameItem(item, entry) ? { ...entry, qty } : entry))
      );
      (async () => {
        if (!cartId || !target?.lineItemId) return;
        try {
          if (qty <= 0) {
            await apiRemoveLineItem(cartId, target.lineItemId);
          } else {
            await apiUpdateLineItem(cartId, target.lineItemId, qty);
          }
        } catch {
          // Offline-first: local state already updated.
        }
      })();
    },
    [items, cartId, setItems]
  );

  const remove = useCallback(
    (item: Omit<CartItem, "qty">) => {
      const target = items.find((entry) => sameItem(item, entry));
      setItems((prev) => prev.filter((entry) => !sameItem(item, entry)));
      (async () => {
        if (!cartId || !target?.lineItemId) return;
        try {
          await apiRemoveLineItem(cartId, target.lineItemId);
        } catch {
          // Offline-first.
        }
      })();
    },
    [items, cartId, setItems]
  );

  const clear = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + (prices[item.slug] ?? 0) * item.qty,
      0
    );
    return { items, count, subtotal, add, remove, setQty, clear };
  }, [items, prices, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
