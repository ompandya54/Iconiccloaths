'use client';

import { Play, ArrowRight } from 'lucide-react';

export default function StorySection({ onOpenVideo }) {
  return (
    <section id="story" className="pt-12 sm:pt-16 pb-8 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch border border-white/10 bg-[#0e0e12] rounded-none overflow-hidden">
          
          {/* Left Panel: WEAR YOUR STORY with Model on Stairs */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-8 sm:p-10 group border-b lg:border-b-0 lg:border-r border-white/10">
            <img
              src="/images/story_stairs_model.jpg"
              alt="Wear Your Story Model"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.80] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            {/* Top Left Headline */}
            <div className="relative z-10 space-y-1">
              <h2 className="font-sans font-black text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none">
                WEAR<br />
                YOUR<br />
                STORY
              </h2>
              <div className="w-10 h-0.5 bg-white mt-3" />
            </div>

            {/* Bottom Left Watch Film CTA */}
            <div className="relative z-10 pt-8">
              <button
                onClick={onOpenVideo}
                className="inline-flex items-center space-x-3 text-white hover:text-gray-300 transition-all text-xs font-bold uppercase tracking-wider group/btn"
              >
                <div className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center bg-black/40 group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Watch Film</span>
              </button>
            </div>
          </div>

          {/* Middle Panel: OUR STORY - BUILT FOR THE DIFFERENT */}
          <div className="lg:col-span-3 bg-[#08080a] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase block">
                OUR STORY
              </span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
                BUILT FOR<br />THE DIFFERENT
              </h3>
              <p className="text-xs text-gray-300 font-normal leading-relaxed pt-2">
                Iconic Cloths is more than a brand — it's a mindset. We create premium streetwear for people who think differently, move differently and live with purpose.
              </p>
            </div>

            <div className="pt-8">
              <a
                href="#footer"
                className="inline-flex items-center space-x-3 bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Panel: Stencil Wall Artwork */}
          <div className="lg:col-span-3 relative min-h-[340px] bg-[#141418] flex flex-col justify-between p-8 sm:p-10">
            {/* Spotlight Beam effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop"
              alt="Wall texture"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-40 mix-blend-overlay"
            />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-1">
                <p className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white uppercase leading-none opacity-90">
                  GOOD
                </p>
                <p className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white uppercase leading-none opacity-90">
                  CLOTHES
                </p>
                <p className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white uppercase leading-none opacity-90">
                  BETTER
                </p>
                <p className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white uppercase leading-none opacity-90">
                  PEOPLE
                </p>
              </div>

              {/* Stacked Logo Print at bottom */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex flex-col items-start">
                  <span className="font-serif text-sm font-bold tracking-[0.25em] text-white uppercase leading-none">
                    ICONIC
                  </span>
                  <span className="font-sans text-[8px] font-medium tracking-[0.45em] text-gray-400 uppercase mt-0.5">
                    CLOTHS
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
