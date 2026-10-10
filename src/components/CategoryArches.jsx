'use client';

import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'oversized',
    title: 'OVERSIZED TEES',
    image: '/images/cat_oversized.jpg',
    tag: 'Explore'
  },
  {
    id: 'graphic',
    title: 'GRAPHIC TEES',
    image: '/images/cat_graphic.jpg',
    tag: 'Explore'
  },
  {
    id: 'essentials',
    title: 'ESSENTIALS',
    image: '/images/cat_essentials.jpg',
    tag: 'Explore'
  },
  {
    id: 'collections',
    title: 'COLLECTIONS',
    image: '/images/cat_collections.jpg',
    tag: 'Explore'
  },
  {
    id: 'new-arrivals',
    title: 'NEW ARRIVALS',
    image: '/images/cat_newarrivals.jpg',
    tag: 'Explore'
  }
];

export default function CategoryArches({ onSelectCategory }) {
  return (
    <section id="collections" className="pt-16 sm:pt-20 pb-6 sm:pb-8 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 5 Column Arched Dome Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Arched Dome Container */}
              <div className="w-full aspect-[3/4] rounded-t-[100px] sm:rounded-t-[140px] md:rounded-t-[160px] overflow-hidden relative bg-[#121216] border border-white/10 shadow-lg transition-all duration-500 group-hover:border-white/40 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>

              {/* Title & Explore Link */}
              <div className="mt-3.5 text-center">
                <h3 className="font-sans text-xs sm:text-sm font-bold tracking-[0.15em] text-white uppercase group-hover:text-gray-200 transition-colors">
                  {cat.title}
                </h3>
                <div className="inline-flex items-center space-x-1.5 text-[11px] font-medium text-gray-400 mt-1 group-hover:text-white transition-colors">
                  <span>{cat.tag}</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
