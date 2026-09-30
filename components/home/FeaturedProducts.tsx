import { ProductCard } from "@/components/product/ProductCard";
import { listProducts } from "@/api";
import type { Product } from "@/types";

type FeaturedProductsProps = {
  category?: string;
  /**
   * Enables the shared-element morph names on the cards. Enable on only one
   * grid per page: two mounted components with the same name break view
   * transitions.
   */
  morph?: boolean;
};

export async function FeaturedProducts({
  category,
  morph,
}: FeaturedProductsProps = {}) {
  const products = await listProducts(category ? { category } : {});
  const featured: Product[] = products.slice(0, 4);

  return (
    <section className="w-full py-20">
      <div className="grid grid-cols-2 gap-x-1 gap-y-10 sm:grid-cols-4 sm:gap-x-1">
        {featured.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            viewTransitionName={morph ? `product-${product.slug}` : undefined}
          />
        ))}
      </div>
    </section>
  );
}
