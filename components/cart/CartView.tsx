"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { ROUTES } from "@/constants";
import { useCart, type CartItem } from "@/store/cart";
import { formatPrice } from "@/utils";
import type { Product } from "@/types";

type CartViewProps = {
  products: Product[];
};

export function CartView({ products }: CartViewProps) {
  const { items, count, subtotal, setQty, remove } = useCart();
  const [checkoutNote, setCheckoutNote] = useState(false);

  if (count === 0) {
    return (
      <section className="flex flex-col items-center gap-6 px-6 py-32 text-center">
          <ShoppingBag className="h-8 w-8 text-neutral-300" strokeWidth={1.5} />
          <p className="font-display text-4xl tracking-wide text-neutral-300">
            Your cart is empty
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
            Pieces you add will be kept here, on this device, until you are
            ready.
          </p>
          <Link
            href={ROUTES.shop}
            transitionTypes={["nav-forward"]}
            className="border border-black bg-black px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </section>
    );
  }

  return (
    <section className="px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <CartRow
              key={`${item.slug}-${item.size}-${item.color}`}
              item={item}
              products={products}
              onQty={(qty) => setQty(item, qty)}
              onRemove={() => remove(item)}
            />
          ))}
        </AnimatePresence>

        <div className="mt-12 flex flex-col gap-8 border-t border-neutral-200 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="text-sm text-neutral-500">
            <p className="uppercase tracking-widest">
              Subtotal — {formatPrice(subtotal)}
            </p>
            <p className="mt-2 text-xs leading-relaxed">
              Shipping and taxes are calculated at checkout. Free shipping on
              orders over $150.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:items-end">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setCheckoutNote(true);
                window.setTimeout(() => setCheckoutNote(false), 2500);
              }}
              className="w-full border border-black bg-black px-10 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 md:w-auto"
            >
              Checkout — {formatPrice(subtotal)}
            </motion.button>
            <AnimatePresence>
              {checkoutNote && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs uppercase tracking-widest text-neutral-500"
                >
                  Checkout is coming soon
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartRow({
  item,
  products,
  onQty,
  onRemove,
}: {
  item: CartItem;
  products: Product[];
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const product = products.find((p) => p.slug === item.slug);
  if (!product) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-5 border-b border-neutral-200 py-6"
    >
      <Link
        href={ROUTES.product(product.slug)}
        transitionTypes={["nav-forward"]}
        className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-neutral-100 sm:w-24"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={ROUTES.product(product.slug)}
          transitionTypes={["nav-forward"]}
          className="text-sm font-medium text-neutral-900 transition-opacity hover:opacity-60"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
          Size {item.size}
          {item.color ? ` · ${item.color}` : ""}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center border border-neutral-300">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onQty(item.qty - 1)}
              className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-neutral-100"
            >
              <Minus className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm">{item.qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onQty(item.qty + 1)}
              className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-neutral-100"
            >
              <Plus className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from cart`}
            className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-black"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            Remove
          </button>
        </div>
      </div>

      <p className="text-sm font-bold">
        {formatPrice(product.price * item.qty, product.currency)}
      </p>
    </motion.div>
  );
}
