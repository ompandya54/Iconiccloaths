'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const CATEGORY_OPTIONS = [
  { value: 'oversized', label: 'Oversized Tees' },
  { value: 'graphic', label: 'Graphic Streetwear' },
  { value: 'essentials', label: 'Essentials' },
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'bottoms', label: 'Bottoms & Cargo' },
  { value: 'hoodies', label: 'Hoodies & Sweats' },
];

const FIT_OPTIONS = [
  'Oversized Fit',
  'Boxy Cut',
  'Relaxed Fit',
  'Drop Shoulder',
  'Regular Fit',
];

const THEME_OPTIONS = [
  'Street',
  'Minimal',
  'Vintage',
  'Typography',
  'Anime',
  'Abstract',
  'Cyberpunk',
  'Gothic',
];

const MATERIAL_OPTIONS = [
  '100% French Terry (240 GSM)',
  'Heavyweight Cotton (260 GSM)',
  'Compact Cotton (210 GSM)',
  '100% Organic Cotton (220 GSM)',
  'Fleece Cotton (380 GSM)',
  'High-Density Ripstop Cotton',
];

const BADGE_OPTIONS = [
  'NEW DROP',
  'BESTSELLER',
  'LIMITED',
  'ESSENTIAL',
  'HOT',
  'FLAT 40% OFF',
  'POPULAR',
];

export default function ProductForm({
  product = null, // null for Add, populated object for Edit
  onSave,
  onCancel,
  isSubmitting = false,
}) {
  const isEdit = Boolean(product && (product.id || product._id));

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'oversized',
    categoryLabel: 'Oversized Streetwear',
    subcategory: 'Back Print',
    fit: 'Oversized Fit',
    theme: 'Street',
    material: '100% French Terry (240 GSM)',
    badge: 'NEW DROP',
    stock: 50,
    image: '',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '' },
      { name: 'White', hex: '#f5f5f7', image: '' },
    ],
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
  });

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorImage, setNewColorImage] = useState('');

  // Pre-fill on Edit
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price ?? '',
        originalPrice: product.originalPrice ?? '',
        category: product.category || 'oversized',
        categoryLabel: product.categoryLabel || 'Oversized Streetwear',
        subcategory: product.subcategory || 'Back Print',
        fit: product.fit || 'Oversized Fit',
        theme: product.theme || 'Street',
        material: product.material || '100% French Terry (240 GSM)',
        badge: product.badge || 'NEW DROP',
        stock: product.stock ?? 50,
        image: product.image || product.colors?.[0]?.image || '',
        images: Array.isArray(product.images) ? product.images : [],
        sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'],
        colors: Array.isArray(product.colors) && product.colors.length > 0
          ? product.colors
          : [{ name: 'Black', hex: '#0a0a0a', image: product.image || '' }],
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: Boolean(product.isFeatured),
        isBestseller: Boolean(product.isBestseller),
        isNewArrival: Boolean(product.isNewArrival),
      });
    }
  }, [product]);

  // Handle Input Changes
  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from name if adding
      if (field === 'name' && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      // Sync categoryLabel when category changes
      if (field === 'category') {
        const found = CATEGORY_OPTIONS.find((c) => c.value === value);
        if (found) updated.categoryLabel = found.label;
      }

      return updated;
    });
  };

  // Toggle Size selection
  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const updatedSizes = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  // Add Color Swatch
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newSwatch = {
      name: newColorName.trim(),
      hex: newColorHex,
      image: newColorImage.trim() || formData.image,
    };
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, newSwatch],
    }));
    setNewColorName('');
    setNewColorImage('');
  };

  // Remove Color Swatch
  const handleRemoveColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Please enter product name');
    if (!formData.price) return alert('Please enter product price');

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock) || 0,
      image: formData.image || formData.colors?.[0]?.image || '/images/prod_minimal.jpg',
      images: formData.images.length > 0 ? formData.images : [formData.image || '/images/prod_minimal.jpg'],
    };

    onSave(payload);
  };

  // Calculated discount
  const discountPercent =
    formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Products</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {isEdit ? `Edit: ${formData.name || 'Product'}` : 'Create New Product Drop'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEdit ? 'Update details, pricing, inventory and visuals' : 'Add authentic streetwear apparel to your catalog'}
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{isEdit ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* CARD 1: Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">General Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Minimal Logo Heavyweight Boxy Tee"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="e.g. minimal-logo-heavyweight-boxy-tee"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-xs"
              />
            </div>

            {/* Badge */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge / Ribbon Tag
              </label>
              <select
                value={formData.badge}
                onChange={(e) => handleChange('badge', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-semibold"
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Crafted from luxury 240 GSM organic French Terry cotton with intentional boxy drape..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Streetwear Categorization & Distinct Columns */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Categorization & Attributes (Fit, Theme & Material)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-semibold"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subcategory / Print Type
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                placeholder="Back Print, Front Graphic, Solid, etc."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* FIT (Distinct attribute!) */}
            <div>
              <label className="block font-bold text-purple-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <span>Fit Silhouette</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono">Separate Col</span>
              </label>
              <select
                value={formData.fit}
                onChange={(e) => handleChange('fit', e.target.value)}
                className="w-full bg-purple-50/40 border border-purple-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-semibold"
              >
                {FIT_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* THEME (Distinct attribute!) */}
            <div>
              <label className="block font-bold text-cyan-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <span>Aesthetic Theme</span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-mono">Separate Col</span>
              </label>
              <select
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full bg-cyan-50/40 border border-cyan-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all font-semibold"
              >
                {THEME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fabric & GSM Material
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  {MATERIAL_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Pricing, Inventory & Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pricing, Inventory & Visibility</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Price */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="999"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono font-bold text-sm"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Original MRP (₹)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
                placeholder="1499"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono font-semibold"
              />
              {discountPercent > 0 && (
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                  {discountPercent}% OFF auto-badge
                </span>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Inventory Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono font-semibold"
              />
            </div>

            {/* Active Toggle (Crucial for admin seeing/setting inactive items!) */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Product Status
              </span>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                <span className="ml-2 text-xs font-bold text-slate-800">
                  {formData.isActive ? (
                    <span className="text-emerald-700 font-bold">Active (Live)</span>
                  ) : (
                    <span className="text-slate-500 font-bold">Inactive (Draft)</span>
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Featured Flags */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold">
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => handleChange('isBestseller', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-800">Mark as Bestseller</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-800">Feature on Homepage</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => handleChange('isNewArrival', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-800">Mark as New Arrival</span>
            </label>
          </div>
        </div>

        {/* CARD 4: Visuals & Color Swatches */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product Visuals & Color Swatches</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Primary Image Input & Preview */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://images.unsplash.com/... or /images/prod_minimal.jpg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-xs"
                />
              </div>

              {/* Color Swatches Management */}
              <div className="pt-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Color Swatches ({formData.colors.length})
                </label>

                {/* Existing swatches list */}
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {formData.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-slate-800">{color.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
                        title="Remove color"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Color Form */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Color Name</label>
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g. Vintage Wash"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Color Hex</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Color</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Image Preview Card */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Live Card Preview
              </span>
              <div className="relative aspect-[3/4] w-40 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shadow-sm">
                <img
                  src={formData.image || formData.colors?.[0]?.image || '/images/prod_minimal.jpg'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/prod_minimal.jpg';
                  }}
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  {formData.badge}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 truncate max-w-[160px] text-center">
                {formData.name || 'Product Title'}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">
                ₹{formData.price || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 5: Size Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Available Sizes</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {STANDARD_SIZES.map((size) => {
              const isSelected = formData.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-14 h-12 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center border shadow-sm ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20 scale-105'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
