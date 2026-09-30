"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/utils";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please enter a valid email";
    if (form.message.trim().length < 10)
      next.message = "A few more words would help (min. 10 characters)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-start gap-4 self-center border border-neutral-200 p-10"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
          <Check className="h-5 w-5" strokeWidth={2} />
        </span>
        <p className="font-display text-3xl tracking-wide">Message sent</p>
        <p className="text-sm leading-relaxed text-neutral-600">
          Thank you, {form.name.split(" ")[0]}. We reply within one business
          day.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ name: "", email: "", message: "" });
            setSent(false);
          }}
          className="mt-2 text-xs uppercase tracking-widest text-neutral-500 underline-offset-4 transition-colors hover:text-black hover:underline"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field
        label="Name"
        value={form.name}
        error={errors.name}
        onChange={(v) => update("name", v)}
        placeholder="Your name"
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        error={errors.email}
        onChange={(v) => update("email", v)}
        placeholder="you@example.com"
      />
      <Field
        label="Message"
        value={form.message}
        error={errors.message}
        onChange={(v) => update("message", v)}
        placeholder="What can we help with?"
        textarea
      />
      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        disabled={sending}
        className="mt-2 w-full border border-black bg-black px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {sending ? "Sending…" : "Send Message"}
      </motion.button>
    </form>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest text-neutral-500">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className={cn(
            "resize-none border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400",
            error ? "border-neutral-900" : "border-neutral-300 focus:border-black"
          )}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400",
            error ? "border-neutral-900" : "border-neutral-300 focus:border-black"
          )}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-neutral-500"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
