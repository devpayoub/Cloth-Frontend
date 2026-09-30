import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { ShopClient } from "@/components/shop/ShopClient";
import { listCategories, listProducts } from "@/api";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return (
    <PageTransition>
      <PageHeader
        eyebrow="FW2026 Collection"
        title="Catalog"
        description="Every piece from the current season, cut in limited runs."
      />
      <ShopClient products={products} categories={categories} />
    </PageTransition>
  );
}
