"use client";

import { motion } from "motion/react";
import { EASE } from "@/constants";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="border-b border-neutral-200 px-6 pb-12 pt-40 sm:px-10">
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.out }}
            className="text-xs uppercase tracking-widest text-neutral-500"
          >
            {eyebrow}
          </motion.p>
        )}
        <h1 className="mt-4 overflow-hidden font-display text-6xl tracking-wide sm:text-8xl">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE.out }}
            className="inline-block"
          >
            {title}
          </motion.span>
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE.out }}
            className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600"
          >
            {description}
          </motion.p>
        )}
      </div>
    </header>
  );
}
