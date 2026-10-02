import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartView } from "@/components/cart/CartView";
import { listProducts } from "@/api";
import { cartContent } from "@/content/site";

export default async function CartPage() {
  const products = await listProducts();

  return (
    <PageTransition>
      <PageHeader eyebrow={cartContent.eyebrow} title={cartContent.title} />
      <CartView products={products} />
    </PageTransition>
  );
}
