'use client';

import { useState } from 'react';
import { Heart, ArrowRight, ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Minimal Logo Tee',
    price: 999,
    formattedPrice: '₹999',
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_minimal.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_metamorphosis.jpg' },
    ]
  },
  {
    id: 'prod-2',
    name: 'Metamorphosis Tee',
    price: 1199,
    formattedPrice: '₹1,199',
    colors: [
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_metamorphosis.jpg' },
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_minimal.jpg' },
    ]
  },
  {
    id: 'prod-3',
    name: 'Discipline Tee',
    price: 999,
    formattedPrice: '₹999',
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_discipline.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_urbandrift.jpg' },
    ]
  },
  {
    id: 'prod-4',
    name: 'Urban Drift Tee',
    price: 1199,
    formattedPrice: '₹1,199',
    colors: [
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_urbandrift.jpg' },
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_discipline.jpg' },
    ]
  },
  {
    id: 'prod-5',
    name: 'Lost In Time Tee',
    price: 1199,
    formattedPrice: '₹1,199',
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_lostintime.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_metamorphosis.jpg' },
    ]
  }
];

export default function BestsellersSection({ onAddToCart, onQuickView }) {
  const [selectedColors, setSelectedColors] = useState({
    'prod-1': 0,
    'prod-2': 0,
    'prod-3': 0,
    'prod-4': 0,
    'prod-5': 0,
  });

  const [wishlist, setWishlist] = useState({});

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
            <a
              href="#shop"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </a>

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
          {PRODUCTS.map((product) => {
            const activeColorIdx = selectedColors[product.id] || 0;
            const activeColor = product.colors[activeColorIdx];
            const isLiked = wishlist[product.id];

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between"
              >
                {/* Product Image Container */}
                <div className="relative aspect-[3/4] bg-[#121216] overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300">
                  <img
                    src={activeColor.image}
                    alt={product.name}
                    className="w-full h-full object-cover filter brightness-[0.95] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
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
                      onClick={() => onQuickView(product)}
                      className="flex-1 py-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(product, activeColor.name)}
                      className="p-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="pt-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white tracking-wide truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-300 mt-1">
                      {product.formattedPrice}
                    </p>
                  </div>

                  {/* Swatch Selection Dots */}
                  <div className="flex items-center space-x-1.5 pt-0.5">
                    {product.colors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(product.id, idx)}
                        aria-label={`Select ${color.name}`}
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${
                          activeColorIdx === idx
                            ? 'ring-1 ring-white ring-offset-1 ring-offset-[#08080a] border-transparent scale-110'
                            : 'border-white/30 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
