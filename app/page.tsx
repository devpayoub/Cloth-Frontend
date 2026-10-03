import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { CollectionBanner } from "@/components/home/CollectionBanner";
import { PageTransition } from "@/components/layout/PageTransition";
import { listProducts } from "@/api";
import { getSiteContent } from "@/api";

export default async function Home() {
  const [products, content] = await Promise.all([listProducts(), getSiteContent()]);
  const spotlight = products[0];
  const [womensBanner, mensBanner, newArrivalsBanner] = content.banners;

  return (
    <PageTransition>
      <HeroSection content={content.hero} />
      <FeaturedProducts morph />
      {spotlight && <ProductSpotlight product={spotlight} />}
      {womensBanner?.image && (
        <CollectionBanner
          imageSrc={womensBanner.image}
          alt={womensBanner.alt}
          pretitle={womensBanner.pretitle}
          title={womensBanner.title}
          buttonLabel={womensBanner.buttonLabel}
          href={womensBanner.href}
        />
      )}
      <FeaturedProducts />
      {mensBanner?.image && (
        <CollectionBanner
          imageSrc={mensBanner.image}
          alt={mensBanner.alt}
          pretitle={mensBanner.pretitle}
          title={mensBanner.title}
          buttonLabel={mensBanner.buttonLabel}
          href={mensBanner.href}
        />
      )}
      {newArrivalsBanner?.image && (
        <CollectionBanner
          imageSrc={newArrivalsBanner.image}
          alt={newArrivalsBanner.alt}
          pretitle={newArrivalsBanner.pretitle}
          title={newArrivalsBanner.title}
          buttonLabel={newArrivalsBanner.buttonLabel}
          href={newArrivalsBanner.href}
        />
      )}
    </PageTransition>
  );
}
