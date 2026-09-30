"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { SITE_CONFIG } from "@/constants";
import { cn } from "@/utils";

type Mode = "signin" | "register";

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setDone(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError(null);
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md border border-neutral-200 p-8 sm:p-10"
    >
      <div className="grid grid-cols-2 border-b border-neutral-200">
        {(["signin", "register"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => switchMode(tab)}
            className={cn(
              "-mb-px border-b-2 pb-4 text-xs uppercase tracking-widest transition-colors",
              mode === tab
                ? "border-black text-black"
                : "border-transparent text-neutral-400 hover:text-black"
            )}
          >
            {tab === "signin" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-start gap-4"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
            <Check className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="font-display text-3xl tracking-wide">
            {mode === "signin" ? "Welcome back" : "Welcome to " + SITE_CONFIG.name}
          </p>
          <p className="text-sm leading-relaxed text-neutral-600">
            {mode === "signin"
              ? "You're signed in on this device. Your cart is saved."
              : "Your account has been created on this device."}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {mode === "register" && (
              <motion.div
                key="name"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-neutral-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="mt-2 border border-black bg-black px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            {submitting
              ? "One moment…"
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </motion.button>

          <p className="text-center text-xs leading-relaxed text-neutral-400">
            Demo only — nothing is sent to a server and details stay in this
            browser.
          </p>
        </form>
      )}
    </motion.div>
  );
}
