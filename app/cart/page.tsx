import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartView } from "@/components/cart/CartView";
import { listProducts } from "@/api";
import { getSiteContent } from "@/api";

export default async function CartPage() {
  const [products, content] = await Promise.all([listProducts(), getSiteContent()]);

  return (
    <PageTransition>
      <PageHeader eyebrow={content.cart.eyebrow} title={content.cart.title} />
      <CartView products={products} />
    </PageTransition>
  );
}
