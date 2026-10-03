"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { AuthCard } from "@/components/account/AuthCard";
import { useAuth } from "@/store/auth";

export default function AccountPage() {
  const { state } = useAuth();
  const router = useRouter();
  const [initiallyAuthenticated] = useState(
    () => state.status === "authenticated"
  );

  useEffect(() => {
    // If the user visited /account while already logged in, redirect them to their profile
    if (initiallyAuthenticated) {
      router.replace("/account/profile");
    }
  }, [initiallyAuthenticated, router]);

  // While checking session or if already authenticated on arrival, avoid flash
  if (initiallyAuthenticated || state.status === "loading") {
    return null;
  }

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Members"
        title="Account"
        description="Sign in to track orders, save pieces, and check out faster."
      />
      <section className="flex justify-center px-6 py-16 sm:px-10">
        <AuthCard />
      </section>
    </PageTransition>
  );
}
