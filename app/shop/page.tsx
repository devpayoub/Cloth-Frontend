import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { ShopClient } from "@/components/shop/ShopClient";
import { listCategories, listProducts } from "@/api";
import { catalogContent } from "@/content/site";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return (
    <PageTransition>
      <PageHeader
        eyebrow={catalogContent.eyebrow}
        title={catalogContent.title}
        description={catalogContent.description}
      />
      <ShopClient products={products} categories={categories} />
    </PageTransition>
  );
}
