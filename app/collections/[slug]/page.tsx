import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCollection, listCollectionSlugs } from "@/api";

export function generateStaticParams() {
  // Collections resolve at request time against the backend catalog.
  return listCollectionSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export default async function CollectionPage(
  props: PageProps<"/collections/[slug]">
) {
  const { slug } = await props.params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <PageTransition>
      <PageHeader
        eyebrow={collection.pretitle}
        title={collection.title}
        description={collection.description}
      />
      <section className="px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <ProductGrid products={collection.products} morph />
        </div>
      </section>
    </PageTransition>
  );
}
