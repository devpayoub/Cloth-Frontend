"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, EyeOff } from "lucide-react";
import { SITE_CONFIG, ROUTES } from "@/constants";
import { cn } from "@/utils";
import { useAuth } from "@/store/auth";

type Mode = "signin" | "register";

export function AuthCard() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setDone(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (mode === "register" && (!firstName.trim() || !lastName.trim())) {
      setError("Please enter your first and last name");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        await register(email, password, firstName.trim(), lastName.trim());
      }
      setDone(true);
      // Redirect to home after a short success flash
      setTimeout(() => {
        router.push(ROUTES.home);
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md border border-neutral-200 p-8 sm:p-10"
    >
      {/* Tab switcher */}
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
              ? "You're signed in. Redirecting you home…"
              : "Your account is ready. Redirecting you home…"}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {mode === "register" && (
              <motion.div
                key="name-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden flex flex-col gap-4"
              >
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
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
            autoComplete="email"
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
          />

          {/* Password with show/hide toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full border border-neutral-300 px-4 py-3 pr-12 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1 text-xs text-red-600"
              >
                <p>{error}</p>
                {error.toLowerCase().includes("already exists") && (
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="self-start text-neutral-800 underline font-medium hover:text-black"
                  >
                    Switch to Sign In &rarr;
                  </button>
                )}
              </motion.div>
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
        </form>
      )}
    </motion.div>
  );
}
