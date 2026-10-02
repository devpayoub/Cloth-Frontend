"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

type CollectionBannerProps = {
  imageSrc: string;
  alt?: string;
  pretitle: string;
  title: string;
  buttonLabel: string;
  href: string;
};

export function CollectionBanner({
  imageSrc,
  alt = "",
  pretitle,
  title,
  buttonLabel,
  href,
}: CollectionBannerProps) {
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
    <section
      ref={containerRef}
      className="relative aspect-[2/1] w-full max-h-[900px] overflow-hidden bg-neutral-100"
    >
      <Image src={imageSrc} alt={alt} fill sizes="100vw" className="object-cover" />

      <motion.div
        ref={overlayRef}
        style={{ y }}
        className="absolute inset-x-0 top-0 z-10 flex h-56 flex-col justify-end px-8 pb-8 text-white sm:px-12"
      >
        <p className="text-sm uppercase tracking-widest text-gray-300">
          {pretitle}
        </p>
        <h2 className="mt-1 font-display text-5xl tracking-wide sm:text-6xl">
          {title}
        </h2>
        <Link
          href={href}
          transitionTypes={["nav-forward"]}
          className="mt-4 w-fit border border-white px-6 py-2 text-sm uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
        >
          {buttonLabel}
        </Link>
      </motion.div>
    </section>
  );
}
