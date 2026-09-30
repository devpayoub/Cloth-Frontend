import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { AuthCard } from "@/components/account/AuthCard";

export default function AccountPage() {
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
