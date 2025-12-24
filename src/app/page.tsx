import HeroSlider from '@/components/HeroSlider';
import ProductGrid from '@/components/ProductGrid';
import CategoriesSection from '@/components/CategoriesSection';
import OffersSection from '@/components/OffersSection';
import DeliveryBanner from '@/components/DeliveryBanner';
import FeaturesSection from '@/components/FeaturesSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <OffersSection />
      <ProductGrid />
      <CategoriesSection />
      <DeliveryBanner />
      <FeaturesSection />
    </main>
  );
}
