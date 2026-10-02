"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ROUTES } from "@/constants";
import type { Product } from "@/types";

type ProductSpotlightProps = {
  product: Product;
};

export function ProductSpotlight({ product }: ProductSpotlightProps) {
  const [leftImage] = product.images;
  // Products with a single image reuse it for the right panel.
  const rightImage = product.images[1] ?? leftImage;
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [maxTravel, setMaxTravel] = useState(0);

  useEffect(() => {
    function measure() {
      if (containerRef.current && overlayRef.current) {
        setMaxTravel(
          containerRef.current.offsetHeight - overlayRef.current.offsetHeight
        );
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "start start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, maxTravel]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2">
      <div
        ref={containerRef}
        className="relative aspect-[4/5] w-full max-h-[900px] overflow-hidden bg-neutral-100"
      >
        <Image
          src={leftImage}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          style={{ objectPosition: "50% 18%" }}
          className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
        />

        <motion.div
          ref={overlayRef}
          style={{ y }}
          className="absolute inset-x-0 top-0 z-10 flex h-56 flex-col justify-end px-8 pb-8 text-white"
        >
          <span className="text-xl font-semibold">{product.name}</span>
          <span className="mt-1 text-sm capitalize text-gray-300">
            {product.category}
          </span>
          <Link
            href={ROUTES.product(product.slug)}
            transitionTypes={["nav-forward"]}
            className="mt-4 w-fit border border-white px-6 py-2 text-sm uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>

      <div className="relative aspect-[4/5] w-full max-h-[900px] overflow-hidden bg-neutral-100">
        <Image
          src={rightImage}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          style={{ objectPosition: "50% 18%" }}
          className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
        />
      </div>
    </section>
  );
}
