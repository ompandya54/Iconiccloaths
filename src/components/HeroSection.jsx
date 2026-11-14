'use client';

import { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: '01',
    subtitle: 'STREETWEAR REDEFINED',
    title: 'MORE\nTHAN JUST A\nT-SHIRT',
    description: 'Premium streetwear for those who create their own path.',
    bgImage: '/images/hero_bg.png',
    thumbnail: '/images/hero_bg.png',
    alt: 'Subway Streetwear Back Graphic Tee'
  },
  {
    id: '02',
    subtitle: 'LIMITED EDITION DROP',
    title: 'CHAOS &\nANARCHY\nCOLLECTION',
    description: 'Heavyweight 280 GSM luxury cotton crafted for ultimate street authority.',
    bgImage: '/images/cat_oversized.jpg',
    thumbnail: '/images/cat_oversized.jpg',
    alt: 'Chaos Oversized Graphic Tee'
  },
  {
    id: '03',
    subtitle: 'THE GOTHIC ESSENTIALS',
    title: 'RAW\nUNFILTERED\nSTATEMENT',
    description: 'Stand out from the crowd with custom hand-distressed streetwear cuts.',
    bgImage: '/images/cat_graphic.jpg',
    thumbnail: '/images/cat_graphic.jpg',
    alt: 'Off-white Gothic Realm Tee'
  }
];

export default function HeroSection({ onShopClick }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const current = HERO_SLIDES[activeSlide];

  return (
    <section className="relative w-full min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-black">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.bgImage}
          alt={current.alt}
          className="w-full h-full object-cover object-center filter brightness-[0.70] transition-all duration-700 ease-out"
        />
        {/* Dark subtle gradient overlay to match reference lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between min-h-[75vh]">

        {/* Top/Middle Left: Headline, Subtitle & CTA */}
        <div className="max-w-xl space-y-5 pt-12 sm:pt-16">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-gray-300 uppercase block">
            {current.subtitle}
          </span>

          <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-[1.05] whitespace-pre-line drop-shadow-md">
            {current.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-normal max-w-sm leading-relaxed pt-1">
            {current.description}
          </p>

          {/* Sharp Rectangle SHOP NOW Button (rounded-none) */}
          <div className="pt-3">
            <a
              href="#shop"
              onClick={onShopClick}
              className="inline-flex items-center space-x-3 bg-white text-black hover:bg-gray-200 transition-colors font-semibold text-xs tracking-widest uppercase px-6 py-3.5 rounded-none shadow-md"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Right: Minimal Glowing Dash Indicators (— — —) + Circular Next Arrow */}
        <div className="flex justify-end items-center pt-8 pb-2">
          <div className="flex items-center space-x-4">
            {/* Glowing Dash/Bar Indicators (— — —) */}
            <div className="flex items-center space-x-2.5">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className="group py-2 px-0.5 focus:outline-none cursor-pointer"
                  >
                    <span
                      className={`block h-[3px] rounded-full transition-all duration-500 ease-out ${
                        isActive
                          ? 'w-9 sm:w-12 bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff,0_0_30px_rgba(255,255,255,0.8)]'
                          : 'w-4 sm:w-5 bg-white/30 group-hover:bg-white/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Circular Arrow Button */}
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/50 bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
