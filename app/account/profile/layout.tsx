"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { User, MapPin, LogOut } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/store/auth";
import { cn } from "@/utils";

const TABS = [
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
    description: "Name, email & password",
  },
  {
    label: "Shipping",
    href: "/account/profile/shipping",
    icon: MapPin,
    description: "Delivery addresses",
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.status === "guest") router.replace("/account");
  }, [state.status, router]);

  if (state.status === "loading" || state.status === "guest") return null;

  const customer = state.customer;

  return (
    <PageTransition>
      {/* Page header */}
      <div className="border-b border-neutral-100 bg-white pt-28 pb-10 px-6 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
            Account
          </p>
          <h1 className="font-display text-4xl tracking-wide">
            {customer.first_name
              ? `${customer.first_name} ${customer.last_name ?? ""}`
              : customer.email}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{customer.email}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 sm:px-10 py-10 flex flex-col md:flex-row gap-10">
        {/* Sidebar nav */}
        <aside className="md:w-52 shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const active =
                pathname === tab.href ||
                (tab.href !== "/account/profile" &&
                  pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-none border-l-2",
                    active
                      ? "border-black text-black font-medium"
                      : "border-transparent text-neutral-500 hover:text-black hover:border-neutral-300"
                  )}
                >
                  <tab.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-black" : "text-neutral-400 group-hover:text-black"
                    )}
                    strokeWidth={1.5}
                  />
                  <span>{tab.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="group flex items-center gap-3 px-4 py-3 text-sm border-l-2 border-transparent text-neutral-400 hover:text-red-600 hover:border-red-300 transition-colors mt-4"
            >
              <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Page content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-0"
        >
          {children}
        </motion.main>
      </div>
    </PageTransition>
  );
}
