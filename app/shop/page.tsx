import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { ShopClient } from "@/components/shop/ShopClient";
import { listCategories, listProducts } from "@/api";
import { getSiteContent } from "@/api";

export default async function ShopPage() {
  const [products, categories, content] = await Promise.all([
    listProducts(),
    listCategories(),
    getSiteContent(),
  ]);

  return (
    <PageTransition>
      <PageHeader
        eyebrow={content.catalog.eyebrow}
        title={content.catalog.title}
        description={content.catalog.description}
      />
      <ShopClient products={products} categories={categories} />
    </PageTransition>
  );
}
