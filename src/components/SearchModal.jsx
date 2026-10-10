'use client';

import { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

const POPULAR_SEARCHES = ['Oversized Tees', 'Graphic Tees', 'Minimal Logo', 'Discipline Tee', 'Acid Wash', 'Black Hoodie'];

export default function SearchModal({ isOpen, onClose, onSelectSearch }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
      />

      {/* Search Container */}
      <div className="relative z-10 w-full max-w-2xl bg-[#121216] border border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections, graphics..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="pt-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Popular Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  if (onSelectSearch) onSelectSearch(tag);
                }}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white hover:text-black transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
