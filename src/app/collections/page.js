'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  Layers,
  Shirt,
  Scissors,
  CheckCircle2,
  SlidersHorizontal,
  Eye,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import QuickViewModal from '@/components/QuickViewModal';
import { getProducts } from '@/app/api/productapi';

// Curated Signature Capsule Drops
const CAPSULE_DROPS = [
  {
    id: 'capsule-midnight',
    number: 'CAPSULE 01',
    title: 'SHADOWS & MIDNIGHT',
    subtitle: 'Gothic Nocturnal & Cyberpunk Streetwear',
    tag: 'BESTSELLER DROP',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description:
      'All-black heavyweight silhouettes engineered with high-density puff graphics, cryptic typography, and pitch-black reactive dye.',
    image: '/images/hero_bg_1.jpg',
    gsm: '260 GSM',
    fit: 'Drop Shoulder Oversized',
    fabric: '100% French Terry Cotton',
    themeFilter: 'Cyberpunk',
    categoryFilter: 'graphic',
    stats: '18 pieces remaining',
  },
  {
    id: 'capsule-vintage',
    number: 'CAPSULE 02',
    title: 'ACID WASH & RETRO 90S',
    subtitle: 'Enzyme-Dyed Vintage Aesthetics',
    tag: 'LIMITED ARCHIVE',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description:
      'Individually hand-distressed and enzyme-washed tees featuring cracked screenprints, raw edges, and authentic 1990s skate culture roots.',
    image: '/images/cat_collections.jpg',
    gsm: '240 GSM',
    fit: 'Boxy Cut',
    fabric: 'Heavy Combed Cotton',
    themeFilter: 'Vintage',
    categoryFilter: 'oversized',
    stats: 'Limited run of 100 units',
  },
  {
    id: 'capsule-essentials',
    number: 'CAPSULE 03',
    title: 'RAW ESSENTIALS MONOCHROME',
    subtitle: 'Minimalist Luxe Daily Armor',
    tag: 'CORE UNIFORM',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description:
      'Zero branding, pure architectural shape. Built for timeless layering with heavyweight 280 GSM loopknit construction and pre-shrunk bio-wash.',
    image: '/images/cat_essentials.jpg',
    gsm: '280 GSM',
    fit: 'Relaxed Fit',
    fabric: 'Ultra-Compact Loopknit',
    themeFilter: 'Minimal',
    categoryFilter: 'essentials',
    stats: 'Permanent in-stock core',
  },
  {
    id: 'capsule-anime',
    number: 'CAPSULE 04',
    title: 'TOKYO CYBER & MANGA INK',
    subtitle: 'Subculture Graphic Capsule',
    tag: 'NEW DROP',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description:
      'High-contrast Japanese manga line art combined with neon cyberpunk aesthetics and vibrant high-density screen inks.',
    image: '/images/cat_graphic.jpg',
    gsm: '240 GSM',
    fit: 'Oversized Fit',
    fabric: '100% Organic Cotton',
    themeFilter: 'Anime',
    categoryFilter: 'graphic',
    stats: 'Seasonal exclusive',
  },
];

// Fit Styles Guide
const FIT_STYLES = [
  {
    name: 'Oversized Fit',
    badge: 'Streetwear Standard',
    description: 'Extra room through the chest and body with exaggerated dropped shoulders for the signature loose streetwear silhouette.',
    measurements: '+3 inches chest ease • Elongated length',
    gsmRecommended: '240–260 GSM',
  },
  {
    name: 'Boxy Cut',
    badge: 'High-Fashion Cut',
    description: 'Square proportions with a wide chest and slightly cropped hem sitting right at the waistline. Pairs perfectly with wide cargos.',
    measurements: 'Wide pit-to-pit • Cropped bottom hem',
    gsmRecommended: '260 GSM Heavyweight',
  },
  {
    name: 'Drop Shoulder',
    badge: 'Relaxed Slouch',
    description: 'Shoulder seam sits 2–3 inches down the upper arm creating an effortless, non-restrictive slouch with structured sleeves.',
    measurements: 'Low armhole • Tapered ribbed neck',
    gsmRecommended: '240 GSM French Terry',
  },
  {
    name: 'Relaxed Fit',
    badge: 'Everyday Classic',
    description: 'A refined casual drape that neither clings nor billows. Clean aesthetic suitable for minimalist styling and daily wear.',
    measurements: 'Standard chest • True-to-size drape',
    gsmRecommended: '210–220 GSM Cotton',
  },
];

// Aesthetic Themes Moodboard
const THEME_MOODS = [
  { id: 'all', label: 'All Aesthetics', icon: '✦' },
  { id: 'Street', label: 'Urban Streetwear', icon: '⚡' },
  { id: 'Vintage', label: '90s Acid Wash', icon: '📼' },
  { id: 'Cyberpunk', label: 'Tokyo Cyberpunk', icon: '🌆' },
  { id: 'Anime', label: 'Manga & Subculture', icon: '🎌' },
  { id: 'Minimal', label: 'Monochrome Minimal', icon: '⚪' },
  { id: 'Typography', label: 'Heavy Typography', icon: '✒️' },
];

export default function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('all');

  // Cart & UI Modals
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Email Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch live products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await getProducts({ limit: 40 });
        const list = res?.data || res?.products || [];
        setProducts(list);
      } catch (err) {
        console.error('Error fetching collection products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Cart Handlers
  const handleAddToCart = (product, selectedColor, size = 'L') => {
    const colorObj = product.colors?.[0] || { name: 'Standard', image: product.image };
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === (product.id || product._id) && item.selectedColor === (selectedColor || colorObj.name)
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          selectedColor: selectedColor || colorObj.name,
          size: size,
          quantity: 1,
          image: colorObj.image || product.image,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id, selectedColor, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) =>
        prev.filter((i) => !(i.id === id && i.selectedColor === selectedColor))
      );
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedColor === selectedColor ? { ...i, quantity: newQty } : i
      )
    );
  };

  const handleRemoveItem = (id, selectedColor) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedColor === selectedColor))
    );
  };

  // Filtered products for the interactive moodboard
  const filteredProducts = products.filter((p) => {
    if (selectedTheme === 'all') return true;
    return p.theme?.toLowerCase().includes(selectedTheme.toLowerCase());
  });

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans antialiased selection:bg-white selection:text-black">
      {/* Sticky Top Navbar */}
      <Navbar
        activePage="collections"
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Cart Drawer & Search Modal */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Hero Banner / Lookbook Header */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden border-b border-white/10">
        {/* Ambient Glow & Grid Texture */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.25em] uppercase text-gray-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>ICONIC ARCHIVE • SEASON 2026</span>
          </div>

          {/* Large Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-black tracking-tight uppercase text-white leading-none">
            CURATED CAPSULES &amp; DROPS
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-400 leading-relaxed tracking-wide">
            Architectural streetwear cuts, custom heavyweight loopknit fabrics (240–280 GSM), and high-density ink prints engineered for those who challenge the mundane.
          </p>

          {/* Live Drop Alert Banner */}
          <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 text-xs shadow-2xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-gray-300 tracking-wider uppercase text-[11px]">
              Live Drop: <span className="text-white">Cyberpunk 2.0 Capsule</span>
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-emerald-400 font-mono font-bold text-[11px]">
              Only 42 Pieces Worldwide
            </span>
          </div>

          {/* Navigation Jump Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs font-bold uppercase tracking-wider">
            <a
              href="#capsules"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black transition-all border border-white/15"
            >
              Signature Drops
            </a>
            <a
              href="#fits"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10"
            >
              Shop By Fit Cut
            </a>
            <a
              href="#moodboard"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10"
            >
              Aesthetic Themes
            </a>
            <a
              href="#fabric-manifesto"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10"
            >
              Fabric Manifesto
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: SIGNATURE CAPSULE DROPS */}
      <section id="capsules" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-blue-400 uppercase">
              // ARCHIVE DROPS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight uppercase text-white">
              Signature Capsule Series
            </h2>
            <p className="text-xs text-gray-400">
              Each capsule represents a distinct counter-culture aesthetic, fabric weight, and silhouette.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-white hover:text-gray-300 group"
          >
            <span>View All Products in Shop</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Capsule Cards Grid (2x2 Big Impact Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {CAPSULE_DROPS.map((capsule) => (
            <div
              key={capsule.id}
              className="group bg-[#0d0d12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between hover:border-white/30 transition-all duration-500"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black/40">
                <img
                  src={capsule.image}
                  alt={capsule.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/15 uppercase tracking-wider">
                    {capsule.number}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${capsule.tagColor}`}
                  >
                    {capsule.tag}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-white/10">
                    {capsule.stats}
                  </span>
                </div>
              </div>

              {/* Content Block */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-[11px] font-mono font-bold tracking-widest text-blue-400 uppercase">
                    {capsule.subtitle}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white uppercase group-hover:text-gray-200 transition-colors">
                    {capsule.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {capsule.description}
                  </p>
                </div>

                {/* Tech Specs Micro-Row */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/10 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Weight</span>
                    <span className="font-bold text-white text-[11px]">{capsule.gsm}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Cut / Fit</span>
                    <span className="font-bold text-white text-[11px] truncate block">{capsule.fit}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Fabric</span>
                    <span className="font-bold text-white text-[11px] truncate block">{capsule.fabric}</span>
                  </div>
                </div>

                {/* CTA Link Button */}
                <Link
                  href={`/shop?category=${capsule.categoryFilter}`}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-white hover:bg-gray-200 text-black font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                >
                  <span>Explore Capsule Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: SHOP BY FIT SILHOUETTE */}
      <section id="fits" className="py-20 bg-[#060608] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-blue-400 uppercase">
              // ARCHITECTURAL SILHOUETTES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight uppercase text-white">
              Shop by Fit Style
            </h2>
            <p className="text-xs text-gray-400">
              Streetwear begins with the drape. Choose your desired structural silhouette engineered for your posture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FIT_STYLES.map((fitItem) => (
              <div
                key={fitItem.name}
                className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/30 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-blue-500/50 transition-all">
                    <Scissors className="w-5 h-5 text-blue-400" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                      {fitItem.badge}
                    </span>
                    <h3 className="text-lg font-bold uppercase text-white mt-0.5">
                      {fitItem.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {fitItem.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="text-[11px] text-gray-300 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Spec:</span>
                      <span className="font-bold text-white text-[10px]">{fitItem.measurements}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">GSM:</span>
                      <span className="font-bold text-blue-400 text-[10px]">{fitItem.gsmRecommended}</span>
                    </div>
                  </div>

                  <Link
                    href={`/shop`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white text-gray-300 hover:text-black font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
                  >
                    <span>View {fitItem.name}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: AESTHETIC THEMES MOODBOARD (INTERACTIVE FILTER) */}
      <section id="moodboard" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-blue-400 uppercase">
              // DESIGN CLASSIFICATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight uppercase text-white">
              Shop by Aesthetic Theme
            </h2>
            <p className="text-xs text-gray-400">
              Filter drops by subculture vibe, visual graphics, and counter-culture design DNA.
            </p>
          </div>

          <div className="text-xs font-mono text-gray-400">
            Displaying <span className="font-bold text-white">{filteredProducts.length}</span> live items
          </div>
        </div>

        {/* Theme Pills Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {THEME_MOODS.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedTheme === theme.id
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              <span>{theme.icon}</span>
              <span>{theme.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Products Grid Matching Selected Theme */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
              Loading Aesthetic Archive...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#0d0d12] border border-white/10 rounded-3xl p-8">
            <p className="text-sm font-bold text-gray-300">
              No products found under "{selectedTheme}" at this moment.
            </p>
            <button
              onClick={() => setSelectedTheme('all')}
              className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Reset to All Themes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product) => {
              const displayImg =
                product.image ||
                product.colors?.[0]?.image ||
                '/images/prod_discipline.jpg';

              return (
                <div
                  key={product._id || product.id}
                  className="group bg-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all duration-300"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[3/4] w-full bg-black/60 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={product.name}
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Ribbon Badge */}
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[9px] font-black uppercase text-white px-2 py-0.5 rounded border border-white/20">
                        {product.badge}
                      </span>
                    )}

                    {/* Fit & Theme badges on image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px] font-mono text-gray-300 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                      <span className="truncate">{product.fit || 'Oversized'}</span>
                      <span className="text-blue-400 font-bold ml-1">{product.theme || 'Street'}</span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/70 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 transition-all border border-white/20"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 sm:p-4 space-y-2">
                    <Link
                      href={`/shop/${product.slug || product._id || product.id}`}
                      className="font-bold text-xs sm:text-sm text-white hover:text-gray-300 transition-colors line-clamp-1 block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xs font-bold text-white">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-[10px] font-mono text-gray-500 line-through">
                          ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product, product.colors?.[0]?.name)}
                      className="w-full py-2 bg-white/5 hover:bg-white text-gray-300 hover:text-black rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors border border-white/10 flex items-center justify-center space-x-1.5 active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-gray-200 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-white/5"
          >
            <span>Explore Entire Storefront Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 4: FABRIC & CRAFT MANIFESTO */}
      <section id="fabric-manifesto" className="py-20 bg-[#060608] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-blue-400 uppercase">
              // NO CUT CORNERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight uppercase text-white">
              The Fabric &amp; Craft Manifesto
            </h2>
            <p className="text-xs text-gray-400">
              Why our tees feel different from commercial fast fashion brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                <Layers className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                240–280 GSM French Terry
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We reject 160–180 GSM lightweight fast-fashion fabrics. Our pieces maintain a thick, structured drape that doesn't cling to the body and creates architectural streetwear lines.
              </p>
            </div>

            <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Double Bio-Wash Enzyme Finish
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pre-treated through two cycles of natural enzyme washing to eliminate fabric shrinkage completely, creating a buttery-soft hand feel without compromising heavyweight density.
              </p>
            </div>

            <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                <Star className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                High-Density Puff Inks
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tactile 3D puff and cured plastisol inks that won't peel, crack, or fade even after 50+ machine washes. Each design is cured at high temperatures to bind permanently with cotton fibers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: VIP EARLY ACCESS NEWSLETTER */}
      <section className="py-20 border-t border-white/10 bg-gradient-to-b from-[#08080a] to-[#040405] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
            <Flame className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight uppercase text-white">
            Access Capsule 05 Before It Drops
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Our capsule drops are produced in strictly limited runs of 100 units. Enter your email to receive private 2-hour early access links before public releases.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>You're on the VIP early-access roster!</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (emailInput.trim()) {
                  setIsSubscribed(true);
                }
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-white focus:bg-white/10 transition-all font-medium"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-gray-200 transition-all flex-shrink-0 shadow-lg active:scale-95"
              >
                Join Drop List
              </button>
            </form>
          )}

          <div className="text-[10px] text-gray-500 uppercase tracking-widest pt-2">
            No spam. Only drop links &amp; secret discount codes.
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

