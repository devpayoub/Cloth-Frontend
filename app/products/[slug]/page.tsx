import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/api";
import { ProductDetail } from "@/components/product/ProductDetail";
import { PageTransition } from "@/components/layout/PageTransition";

export default async function ProductPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await listProducts({ category: product.category });

  return (
    <PageTransition>
      <ProductDetail product={product} relatedProducts={related} />
    </PageTransition>
  );
}
