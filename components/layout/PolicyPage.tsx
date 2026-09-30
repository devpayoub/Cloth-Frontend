import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import type { ReactNode } from "react";

type PolicySection = {
  title: string;
  body: ReactNode;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: PolicySection[];
};

export function PolicyPage({
  eyebrow,
  title,
  description,
  sections,
}: PolicyPageProps) {
  return (
    <PageTransition>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="grid gap-4 border-t border-neutral-200 py-8 sm:grid-cols-[80px_1fr]"
            >
              <span className="font-display text-2xl text-neutral-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-sm uppercase tracking-widest">
                  {section.title}
                </h2>
                <div className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {section.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
