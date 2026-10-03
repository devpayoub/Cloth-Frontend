"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";
import { updateCustomer, changePassword } from "@/api/auth";
import { cn } from "@/utils";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl tracking-wide mb-6">{children}</h2>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-neutral-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function inputCls(extra?: string) {
  return cn(
    "w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black",
    extra
  );
}

function StatusBadge({ ok, msg }: { ok: boolean; msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex items-center gap-1.5 text-xs",
        ok ? "text-green-700" : "text-red-600"
      )}
    >
      {ok && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
      {msg}
    </motion.p>
  );
}

// ─── Profile info section ────────────────────────────────────────────────────

function ProfileInfo() {
  const { state, refresh } = useAuth();
  if (state.status !== "authenticated") return null;
  const { customer, token } = state;

  const [firstName, setFirstName] = useState(customer.first_name ?? "");
  const [lastName, setLastName] = useState(customer.last_name ?? "");
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateCustomer(token, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      });
      await refresh();
      setStatus({ ok: true, msg: "Profile updated." });
    } catch (err: unknown) {
      setStatus({
        ok: false,
        msg: err instanceof Error ? err.message : "Update failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border border-neutral-200 p-6 sm:p-8">
      <SectionTitle>Personal info</SectionTitle>
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
              className={inputCls()}
            />
          </Field>
          <Field label="Last name">
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
              className={inputCls()}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={inputCls()}
            />
          </Field>
          <Field label="Phone number">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              className={inputCls()}
            />
          </Field>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            className="flex items-center gap-2 border border-black bg-black px-7 py-2.5 text-xs uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save changes
          </motion.button>
          <AnimatePresence>
            {status && <StatusBadge ok={status.ok} msg={status.msg} />}
          </AnimatePresence>
        </div>
      </form>
    </section>
  );
}

// ─── Change password section ─────────────────────────────────────────────────

function ChangePassword() {
  const { state } = useAuth();
  if (state.status !== "authenticated") return null;
  const { customer } = state;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) {
      setStatus({ ok: false, msg: "New password must be at least 8 characters." });
      return;
    }
    if (next !== confirm) {
      setStatus({ ok: false, msg: "Passwords don't match." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await changePassword(customer.email, current, next);
      setStatus({ ok: true, msg: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err: unknown) {
      setStatus({
        ok: false,
        msg: err instanceof Error ? err.message : "Password change failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border border-neutral-200 p-6 sm:p-8 mt-6">
      <SectionTitle>Change password</SectionTitle>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <Field label="Current password">
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className={inputCls()}
          />
        </Field>
        <Field label="New password">
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className={inputCls()}
          />
        </Field>
        <Field label="Confirm new password">
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputCls()}
          />
        </Field>

        <div className="flex items-center gap-4 pt-2">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            className="flex items-center gap-2 border border-black bg-black px-7 py-2.5 text-xs uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Update password
          </motion.button>
          <AnimatePresence>
            {status && <StatusBadge ok={status.ok} msg={status.msg} />}
          </AnimatePresence>
        </div>
      </form>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  return (
    <div>
      <ProfileInfo />
      <ChangePassword />
    </div>
  );
}
