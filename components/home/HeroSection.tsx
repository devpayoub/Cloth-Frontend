"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { EASE, SITE_CONFIG } from "@/constants";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // 0 = hero fully in view, 1 = hero scrolled past; the title glides up
  // toward the navbar and dissolves just as it reaches it.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, "-42vh"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.28, 0.85], [1, 1, 0]);
  const titleBlur = useTransform(scrollYProgress, [0.5, 0.95], ["blur(0px)", "blur(8px)"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-neutral-950"
    >
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: EASE.out }}
        className="absolute inset-0 mx-auto h-full w-full max-w-[1920px]"
      >
        <Image
          src="/HOME.png"
          alt="HOME"
          fill
          priority
          sizes="(min-width: 1920px) 1920px, 100vw"
          className="object-cover object-[50%_25%]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-black/30"
      />

      <motion.h1
        style={{
          y: titleY,
          opacity: titleOpacity,
          scale: titleScale,
          filter: titleBlur,
        }}
        className="relative z-10 overflow-hidden text-center font-display text-7xl tracking-[0.2em] text-white sm:text-9xl"
      >
        <motion.span
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE.out }}
          className="inline-block"
        >
          {SITE_CONFIG.name}
        </motion.span>
      </motion.h1>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
        >
          <motion.div
            style={{ opacity: chevronOpacity }}
            className="animate-bounce text-white"
          >
            <ChevronDown className="h-6 w-6" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
