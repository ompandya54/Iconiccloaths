'use client';

import { ShieldCheck, RefreshCw, Truck, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'PREMIUM FABRIC',
    subtitle: 'All Day Comfort'
  },
  {
    icon: ShieldCheck,
    title: 'SECURE PAYMENTS',
    subtitle: '100% Safe & Secure'
  },
  {
    icon: RefreshCw,
    title: 'EASY RETURNS',
    subtitle: 'Hassle Free'
  },
  {
    icon: Truck,
    title: 'FAST SHIPPING',
    subtitle: 'Across India'
  }
];

export default function TrustBadges() {
  return (
    <section className="py-6 sm:py-8 bg-[#08080a] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-4 py-3 px-4 sm:px-6 first:pl-0 last:pr-0"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white flex-shrink-0 bg-white/5">
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
