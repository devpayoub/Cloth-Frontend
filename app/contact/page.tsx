import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <PageTransition>
      <PageHeader
        eyebrow="We're listening"
        title="Contact"
        description="Questions about a piece, an order, or a collaboration — write to us."
      />
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <ContactInfoRow label="Email" value="hello@cloth.example" />
            <ContactInfoRow label="Phone" value="+1 (555) 010-2026" />
            <ContactInfoRow
              label="Studio"
              value="14 Mercer Street, New York, NY"
            />
            <ContactInfoRow
              label="Hours"
              value="Monday — Saturday, 10:00 to 19:00"
            />
          </div>
          <ContactForm />
        </div>
      </section>
    </PageTransition>
  );
}

function ContactInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-neutral-200 pt-5">
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-lg">{value}</p>
    </div>
  );
}
