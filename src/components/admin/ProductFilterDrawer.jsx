'use client';

import React from 'react';
import { X, Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive / Drafts' },
];

const FIT_OPTIONS = [
  'all',
  'Oversized Fit',
  'Boxy Cut',
  'Relaxed Fit',
  'Drop Shoulder',
  'Regular Fit',
];

const THEME_OPTIONS = [
  'all',
  'Street',
  'Minimal',
  'Vintage',
  'Typography',
  'Anime',
  'Abstract',
  'Cyberpunk',
  'Gothic',
];

const STOCK_OPTIONS = [
  { value: 'all', label: 'All Inventory' },
  { value: 'in_stock', label: 'In Stock (> 10)' },
  { value: 'low_stock', label: 'Low Stock (≤ 10)' },
  { value: 'out_of_stock', label: 'Out of Stock (0)' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Added' },
  { value: 'oldest', label: 'Oldest Added' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'stock_high', label: 'Stock: Highest First' },
  { value: 'name_asc', label: 'Product Name (A-Z)' },
];

export default function ProductFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  categories = [],
  totalMatching = 0,
}) {
  if (!isOpen) return null;

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.fit !== 'all' ||
    filters.theme !== 'all' ||
    filters.stock !== 'all' ||
    filters.sortBy !== 'newest';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      {/* Slide Drawer (Right side) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out animate-slideInRight">
          
          {/* Drawer Top Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Filter className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  Filter Catalog
                </h3>
                <p className="text-[11px] text-slate-500">
                  Showing {totalMatching} matching items
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close Filter Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable Filters) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Listing Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange('status', opt.value)}
                    className={`py-2 px-2.5 rounded-xl text-center font-bold text-[11px] border transition-all ${
                      filters.status === opt.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 capitalize cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== 'all')
                  .map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {/* Fit Style Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Fit Silhouette
              </label>
              <div className="flex flex-wrap gap-2">
                {FIT_OPTIONS.map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => onFilterChange('fit', fit)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-all ${
                      filters.fit === fit
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-indigo-50/50 text-indigo-800 border-indigo-200/60 hover:bg-indigo-100'
                    }`}
                  >
                    {fit === 'all' ? 'All Fits' : fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Aesthetic Theme Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => onFilterChange('theme', theme)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-all ${
                      filters.theme === theme
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-sky-50/50 text-sky-800 border-sky-200/60 hover:bg-sky-100'
                    }`}
                  >
                    {theme === 'all' ? 'All Themes' : theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Level Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Inventory Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STOCK_OPTIONS.map((stockOpt) => (
                  <button
                    key={stockOpt.value}
                    type="button"
                    onClick={() => onFilterChange('stock', stockOpt.value)}
                    className={`py-2 px-2.5 rounded-xl text-center font-bold text-[11px] border transition-all ${
                      filters.stock === stockOpt.value
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {stockOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Sort Sequence
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange('sortBy', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drawer Bottom Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95 text-center"
            >
              Apply &amp; View ({totalMatching})
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

