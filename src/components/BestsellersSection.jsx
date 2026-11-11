'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';
import { getBestsellers } from '@/app/api/productapi';

export default function BestsellersSection({ onAddToCart, onQuickView }) {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState({});
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    async function loadLiveBestsellers() {
      try {
        setLoading(true);
        const res = await getBestsellers(8);
        const list = res?.products || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(list) && list.length > 0) {
          setProductsList(list);
        }
      } catch (err) {
        console.error('Failed to load bestsellers from API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveBestsellers();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleColorChange = (prodId, colorIndex) => {
    setSelectedColors((prev) => ({ ...prev, [prodId]: colorIndex }));
  };

  return (
    <section id="shop" className="pt-6 sm:pt-10 pb-16 sm:pb-24 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar: BESTSELLERS - OUR ICONS */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase block mb-1">
              BESTSELLERS
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              OUR ICONS
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center space-x-2">
              <button
                aria-label="Previous products"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                aria-label="Next products"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {loading && productsList.length === 0 ? (
            // Skeleton Loading Placeholders
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col animate-pulse">
                <div className="aspect-[3/4] bg-neutral-900 border border-white/5 mb-3" />
                <div className="h-3 bg-neutral-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-800 rounded w-1/3" />
              </div>
            ))
          ) : (
            productsList.map((product) => {
              const prodKey = product.id || product._id;
              const prodSlug = product.slug || prodKey;
              const activeColorIdx = selectedColors[prodKey] || 0;
              const colorsList = Array.isArray(product.colors) && product.colors.length > 0
                ? product.colors
                : [{ name: 'Default', hex: '#0a0a0a', image: product.image || '/images/prod_minimal.jpg' }];
              const activeColor = colorsList[activeColorIdx] || colorsList[0];
              const isLiked = wishlist[prodKey];

              const rawImg = activeColor?.image || product.image || product.images?.[0] || '/images/prod_minimal.jpg';
              const displayImg = typeof rawImg === 'string' ? rawImg.replace(/^http:\/\//i, 'https://') : '/images/prod_minimal.jpg';
              const displayPrice = product.formattedPrice || (product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : '₹0');

              return (
                <div
                  key={prodKey}
                  className="group flex flex-col justify-between"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-[3/4] bg-[#121216] overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300">
                    <Link href={`/shop/${encodeURIComponent(prodSlug)}`} className="block w-full h-full">
                      <img
                        src={displayImg}
                        alt={product.name || 'Iconic Streetwear'}
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={() => toggleWishlist(prodKey)}
                      aria-label="Add to wishlist"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white transition-colors z-10"
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'stroke-[1.75]'}`}
                      />
                    </button>

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => onQuickView && onQuickView(product)}
                        className="flex-1 py-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                      <button
                        onClick={() => onAddToCart && onAddToCart(product, activeColor?.name || 'Default')}
                        className="p-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="pt-3 flex items-start justify-between">
                    <div className="min-w-0 pr-2">
                      <Link href={`/shop/${encodeURIComponent(prodSlug)}`}>
                        <h3 className="text-xs font-semibold text-white tracking-wide truncate hover:underline">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs font-bold text-gray-300 mt-1">
                        {displayPrice}
                      </p>
                    </div>

                    {/* Swatch Selection Dots */}
                    {colorsList.length > 1 && (
                      <div className="flex items-center space-x-1.5 pt-0.5 flex-shrink-0">
                        {colorsList.map((color, idx) => (
                          <button
                            key={color.name || idx}
                            onClick={() => handleColorChange(prodKey, idx)}
                            aria-label={`Select ${color.name}`}
                            className={`w-3.5 h-3.5 rounded-full border transition-all ${
                              activeColorIdx === idx
                                ? 'ring-1 ring-white ring-offset-1 ring-offset-[#08080a] border-transparent scale-110'
                                : 'border-white/30 opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: color.hex || '#0a0a0a' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
