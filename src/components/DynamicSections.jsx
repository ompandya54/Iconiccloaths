'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, ShoppingBag, Clock } from 'lucide-react';
import { getActiveSections } from '@/services/api';

export default function DynamicSections({ onAddToCart, onQuickView }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      try {
        const res = await getActiveSections();
        if (res.success && res.sections && res.sections.length > 0) {
          setSections(res.sections);
        }
      } catch (err) {
        console.error('Error loading dynamic sections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSections();
  }, []);

  if (loading || sections.length === 0) return null;

  return (
    <div className="space-y-16 pb-16 bg-[#08080a]">
      {sections.map((section) => (
        <section key={section.id || section._id} className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-4">
              <div>
                {section.badgeText && (
                  <span className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-black uppercase tracking-wider bg-white text-black rounded-sm">
                    {section.badgeText}
                  </span>
                )}
                <h2 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-xs text-gray-400 mt-1">{section.subtitle}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {section.countdownEndsAt && (
                  <div className="flex items-center space-x-1.5 text-xs text-yellow-400 font-mono font-bold bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Limited Time Drop</span>
                  </div>
                )}
                <Link
                  href="/shop"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
                >
                  <span>Explore All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {section.products?.map((product) => {
                const prodKey = product.id || product._id;
                const colorsList = Array.isArray(product.colors) && product.colors.length > 0
                  ? product.colors
                  : [];
                const mainImage = product.image || colorsList[0]?.image || '/images/prod_minimal.jpg';

                return (
                  <div key={prodKey} className="group flex flex-col justify-between">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] bg-[#121216] overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge if available */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20 rounded-sm">
                          {product.badge}
                        </span>
                      )}

                      {/* Quick View & Add Buttons on Hover */}
                      <div className="absolute inset-x-3 bottom-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {onQuickView && (
                          <button
                            onClick={() => onQuickView(product)}
                            className="flex-1 py-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick View</span>
                          </button>
                        )}
                        {onAddToCart && (
                          <button
                            onClick={() => onAddToCart(product, colorsList[0]?.name || 'Default')}
                            className="p-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="pt-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-white tracking-wide truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs font-bold text-gray-300 mt-1">
                          {product.formattedPrice || `₹${product.price}`}
                        </p>
                      </div>
                      {product.fit && (
                        <span className="text-[10px] text-gray-500 uppercase font-medium">
                          {product.fit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

