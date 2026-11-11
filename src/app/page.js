'use client';

import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryArches from '../components/CategoryArches';
import BestsellersSection from '../components/BestsellersSection';
import StorySection from '../components/StorySection';
import TrustBadges from '../components/TrustBadges';
import ShadowsDropSection from '../components/ShadowsDropSection';
import QuickViewModal from '../components/QuickViewModal';
import VideoModal from '../components/VideoModal';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const { addToCart, openSearch } = useCart();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <>
      {/* Main Hero Banner with Interactive Slider */}
      <HeroSection onShopClick={() => {}} />

      {/* Arched Category Dome Grid */}
      <CategoryArches onSelectCategory={() => openSearch()} />

      {/* Bestseller Products Section: OUR ICONS */}
      <BestsellersSection
        onAddToCart={addToCart}
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      {/* Brand Story Split Banner */}
      <StorySection onOpenVideo={() => setIsVideoOpen(true)} />

      {/* Trust Badges Strip */}
      <TrustBadges />

      {/* New Drop Banner: SHADOWS DROP */}
      <ShadowsDropSection onExploreClick={() => openSearch()} />

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
}
