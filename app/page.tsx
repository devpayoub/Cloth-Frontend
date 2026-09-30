import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { CollectionBanner } from "@/components/home/CollectionBanner";
import { PageTransition } from "@/components/layout/PageTransition";
import { listProducts } from "@/api";

export default async function Home() {
  const products = await listProducts();
  const spotlight = products[0];

  return (
    <PageTransition>
      <HeroSection />
      <FeaturedProducts morph />
      {spotlight && <ProductSpotlight product={spotlight} />}
      <CollectionBanner
        imageSrc="/banner-womens.webp"
        pretitle="FW2026"
        title="Women's Exclusive"
        buttonLabel="Shop Now"
        href="/collections/womens-new-arrivals"
      />
      <FeaturedProducts />
      <CollectionBanner
        imageSrc="/banner-man.webp"
        pretitle="FW2026"
        title="Men's Exclusive"
        buttonLabel="Shop Now"
        href="/collections/mens-new-arrivals"
      />
      <CollectionBanner
        imageSrc="/banner-man2.webp"
        pretitle="FW2026"
        title="New Arrivals"
        buttonLabel="Shop Now"
        href="/collections/new-arrivals"
      />
    </PageTransition>
  );
}
