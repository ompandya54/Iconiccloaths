'use client';

import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SHADOW_SLIDES = [
  {
    id: '01',
    subtitle: 'NEW COLLECTION',
    title: 'SHADOWS',
    hollowTitle: 'DROP™',
    bgImage: '/images/cat_newarrivals.jpg',
    detailCards: [
      {
        image: '/images/cat_collections.jpg',
        alt: 'Model in sunglasses sitting on stairs'
      },
      {
        image: '/images/cat_essentials.jpg',
        alt: 'Iconic stitched fabric tag detail'
      }
    ]
  },
  {
    id: '02',
    subtitle: 'NIGHT DIVISION',
    title: 'DARK',
    hollowTitle: 'ARCHIVE™',
    bgImage: '/images/hero_bg.jpg',
    detailCards: [
      {
        image: '/images/cat_graphic.jpg',
        alt: 'Gothic print detail'
      },
      {
        image: '/images/cat_oversized.jpg',
        alt: 'Chaos back graphic print'
      }
    ]
  },
  {
    id: '03',
    subtitle: 'LIMITED EDITION',
    title: 'GHOST',
    hollowTitle: 'EDITION™',
    bgImage: '/images/story_stairs_model.jpg',
    detailCards: [
      {
        image: '/images/prod_minimal.jpg',
        alt: 'Minimal logo tee flatlay'
      },
      {
        image: '/images/prod_discipline.jpg',
        alt: 'Discipline print detail'
      }
    ]
  }
];

export default function ShadowsDropSection({ onExploreClick }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const prevSlide = () => {
    setActiveIdx((prev) => (prev === 0 ? SHADOW_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % SHADOW_SLIDES.length);
  };

  const current = SHADOW_SLIDES[activeIdx];

  return (
    <section className="pt-12 sm:pt-16 pb-20 sm:pb-28 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Right Slider Arrow Controls */}
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section Grid: Left Main Banner (lg:col-span-8) + Right 2 Detail Cards (lg:col-span-4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Left Banner Box */}
          <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] p-8 sm:p-12 flex flex-col justify-between overflow-hidden bg-[#121216] border border-white/10">
            <img
              src={current.bgImage}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.70] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

            {/* Headline & Subtitle */}
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-gray-300 uppercase block mb-1">
                {current.subtitle}
              </span>

              <h2 className="font-sans font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none drop-shadow-lg">
                {current.title}<br />
                <span className="text-transparent border-text font-outline" style={{ WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.4)' }}>
                  {current.hollowTitle}
                </span>
              </h2>
            </div>

            {/* Button & Slide Numbers Below */}
            <div className="relative z-10 pt-10 space-y-6">
              <div>
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center space-x-3 bg-white text-black hover:bg-gray-200 transition-colors font-semibold text-xs tracking-widest uppercase px-6 py-3.5 rounded-none shadow-md"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Number Pagination: 01 02 03 */}
              <div className="flex items-center space-x-6 pt-2">
                {SHADOW_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`text-xs font-bold transition-all relative pb-1 ${
                      activeIdx === idx
                        ? 'text-white border-b-2 border-white'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {slide.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side 2 Detail Cards Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {current.detailCards.map((card, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] overflow-hidden bg-[#121216] border border-white/10 group"
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-105 transition-all duration-500"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
