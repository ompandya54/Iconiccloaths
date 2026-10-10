'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategoryArches from '../components/CategoryArches';
import BestsellersSection from '../components/BestsellersSection';
import StorySection from '../components/StorySection';
import TrustBadges from '../components/TrustBadges';
import ShadowsDropSection from '../components/ShadowsDropSection';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SearchModal from '../components/SearchModal';
import QuickViewModal from '../components/QuickViewModal';
import VideoModal from '../components/VideoModal';

export default function Home() {
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'Minimal Logo Tee',
      price: 999,
      selectedColor: 'Black',
      size: 'L',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
    }
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart operations
  const handleAddToCart = (product, selectedColor, size = 'L') => {
    const colorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && item.selectedColor === selectedColor);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          selectedColor: selectedColor || colorObj.name,
          size: size,
          quantity: 1,
          image: colorObj.image
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, selectedColor, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, selectedColor);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedColor === selectedColor
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (id, selectedColor) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedColor === selectedColor)));
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#08080a] text-white selection:bg-white selection:text-black">
      {/* Fixed Navigation Bar */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Hero Banner with Interactive Slider */}
      <HeroSection onShopClick={() => setIsCartOpen(false)} />

      {/* Arched Category Dome Grid */}
      <CategoryArches onSelectCategory={() => setIsSearchOpen(true)} />

      {/* Bestseller Products Section: OUR ICONS */}
      <BestsellersSection
        onAddToCart={handleAddToCart}
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      {/* Brand Story Split Banner */}
      <StorySection onOpenVideo={() => setIsVideoOpen(true)} />

      {/* Trust Badges Strip */}
      <TrustBadges />

      {/* New Drop Banner: SHADOWS DROP */}
      <ShadowsDropSection onExploreClick={() => setIsSearchOpen(true)} />

      {/* Footer */}
      <Footer />

      {/* Modals and Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSearch={() => setIsSearchOpen(false)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </main>
  );
}
