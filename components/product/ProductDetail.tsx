"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ViewTransition } from "react";
import { ArrowLeft, Check, Plus, Star } from "lucide-react";
import type { Product } from "@/types";
import { ROUTES } from "@/constants";
import { useCart } from "@/store/cart";
import { useMediaQuery } from "@/hooks";
import { cn, formatPrice } from "@/utils";
import { ProductGrid } from "@/components/product/ProductGrid";

type ProductDetailProps = {
  product: Product;
  relatedProducts: Product[];
};

const enter = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function AccordionRow({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-xs uppercase tracking-widest text-neutral-900 transition-opacity hover:opacity-60"
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-neutral-600">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [primaryImage, secondaryImage] = product.images;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? null);
  const [added, setAdded] = useState(false);
  const [sizeHint, setSizeHint] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  // The sticky parallax experience only applies on large screens; mobile
  // renders a normal flowing layout.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveImage(v < 0.5 ? 0 : 1);
  });
  const primaryY = useTransform(scrollYProgress, [0, 1], ["0vh", "-100vh"]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], ["100vh", "0vh"]);

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeHint(true);
      window.setTimeout(() => setSizeHint(false), 2000);
      return;
    }
    add({
      slug: product.slug,
      size: selectedSize,
      color: selectedColor?.name ?? "",
      variantId: product.variants?.find(
        (variant) =>
          variant.size === selectedSize &&
          (!selectedColor || variant.color === selectedColor.name)
      )?.id,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <div ref={scrollRef} className="relative bg-white text-black lg:h-[200vh]">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden lg:px-10 lg:py-0">
          <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.4fr_1fr] lg:items-center lg:gap-4">
            <div className="order-1 lg:order-2">
              <ViewTransition
                name={`product-${product.slug}`}
                share="morph"
                default="none"
              >
                <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
                  <motion.div
                    style={isDesktop ? { y: primaryY } : undefined}
                    className="absolute inset-0"
                  >
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 33vw, 90vw"
                      className="object-cover"
                    />
                  </motion.div>
                  {secondaryImage && isDesktop && (
                    <motion.div style={{ y: secondaryY }} className="absolute inset-0">
                      <Image
                        src={secondaryImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, 90vw"
                        className="object-cover"
                      />
                    </motion.div>
                  )}

                  {secondaryImage && (
                    <div className="absolute inset-x-0 bottom-5 z-10 hidden flex-col items-center gap-2 lg:flex">
                      <div className="h-px w-12 overflow-hidden bg-black/15">
                        <motion.div
                          style={{ scaleX: scrollYProgress }}
                          className="h-full w-full origin-left bg-black"
                        />
                      </div>
                      <div className="flex items-center gap-2 font-display text-xs tracking-[0.3em] text-white mix-blend-difference">
                        <span className={activeImage === 0 ? "text-white" : "text-white/40"}>
                          01
                        </span>
                        <span>/</span>
                        <span className={activeImage === 1 ? "text-white" : "text-white/40"}>
                          02
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ViewTransition>

              {/* Mobile: second image shown as a normal block under the first */}
              {secondaryImage && (
                <div className="relative mx-auto mt-4 aspect-[4/5] w-full max-w-md lg:hidden">
                  <Image
                    src={secondaryImage}
                    alt=""
                    fill
                    sizes="90vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <motion.div
              variants={enter}
              initial="hidden"
              animate="visible"
              custom={0.15}
              className="order-2 lg:order-1"
            >
              <Link
                href={ROUTES.shop}
                transitionTypes={["nav-back"]}
                className="group inline-flex items-center gap-2 text-sm"
              >
                <ArrowLeft
                  className="h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-x-1"
                  strokeWidth={1.5}
                />
                <span className="uppercase tracking-widest">Back</span>
              </Link>

              <div className="mt-8 flex items-center gap-3 lg:mt-10">
                <span className="text-xs uppercase tracking-widest text-neutral-500">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="border border-black px-1.5 py-0.5 text-[10px] uppercase tracking-widest">
                    New
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
                <Star className="h-3.5 w-3.5 fill-current text-black" strokeWidth={1.5} />
                <span>
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
                {product.description}
              </p>
            </motion.div>

            <motion.div
              variants={enter}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="order-3 flex flex-col items-start lg:items-end lg:text-right"
            >
              <p className="text-2xl font-bold">
                {formatPrice(product.price, product.currency)}
              </p>

              {product.colors.length > 0 && (
                <div className="mt-6 w-full lg:flex lg:flex-col lg:items-end">
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
                    Colour{selectedColor ? ` — ${selectedColor.name}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color.name}
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={color.name}
                        aria-pressed={selectedColor?.name === color.name}
                        className={cn(
                          "h-7 w-7 rounded-full border border-neutral-300 transition-shadow",
                          selectedColor?.name === color.name &&
                            "ring-1 ring-black ring-offset-2"
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 w-full lg:flex lg:flex-col lg:items-end">
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  Size
                </p>
                <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeHint(false);
                      }}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center border text-sm transition-colors",
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 hover:border-black"
                      )}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {sizeHint && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Please select a size
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "mt-8 flex w-full items-center justify-center gap-2 border border-black px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors lg:w-auto",
                  added ? "bg-neutral-700" : "bg-black hover:bg-neutral-800"
                )}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={2} />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </motion.button>

              <div className="mt-10 w-full border-b border-neutral-200 lg:max-w-xs">
                <AccordionRow title="Details">
                  <span className="mb-2 block text-xs uppercase tracking-widest text-neutral-400">
                    {product.tags.join(" · ")}
                  </span>
                  Part of the FW2026 collection. Relaxed fit — take your usual
                  size. Model is 186 cm and wears a size{" "}
                  {product.sizes[Math.floor(product.sizes.length / 2)]}.
                </AccordionRow>
                <AccordionRow title="Shipping & Returns">
                  Free shipping on orders over $150. Delivered within 3–5
                  business days. Free returns within 30 days.
                </AccordionRow>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <ProductGrid products={relatedProducts} />
        </div>
      </section>
    </>
  );
}
