import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartView } from "@/components/cart/CartView";
import { listProducts } from "@/api";

export default async function CartPage() {
  const products = await listProducts();

  return (
    <PageTransition>
      <PageHeader eyebrow="Your selection" title="Cart" />
      <CartView products={products} />
    </PageTransition>
  );
}
