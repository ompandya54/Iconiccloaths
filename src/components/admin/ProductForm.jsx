'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Tag,
  DollarSign,
  Package,
  Sliders,
  ExternalLink
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
  'ARCHIVE',
];

export default function ProductForm({
  product = null,
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
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', image: '' });

  // Pre-fill form when product prop is passed
  useEffect(() => {
    if (product) {
      const initialImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        originalPrice: product.originalPrice !== undefined ? String(product.originalPrice) : '',
        category: product.category || 'oversized',
        categoryLabel: product.categoryLabel || 'Oversized Streetwear',
        subcategory: product.subcategory || 'Back Print',
        fit: product.fit || 'Oversized Fit',
        theme: product.theme || 'Street',
        material: product.material || '100% French Terry (240 GSM)',
        badge: product.badge || 'NEW DROP',
        stock: product.stock !== undefined ? product.stock : 50,
        image: product.image || initialImages[0] || '',
        images: initialImages,
        sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'],
        colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [
          { name: 'Black', hex: '#0a0a0a', image: '' }
        ],
        isActive: product.isActive !== false,
        isFeatured: Boolean(product.isFeatured),
        isBestseller: Boolean(product.isBestseller),
      });
    }
  }, [product]);

  // Generic field updater
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate URL slug from Product Name
  const generateSlugFromName = () => {
    if (!formData.name) return;
    const cleanSlug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    handleChange('slug', cleanSlug);
  };

  // Add Image to Gallery
  const handleAddGalleryImage = (e) => {
    e?.preventDefault();
    const url = newGalleryUrl.trim();
    if (!url) return;

    setFormData((prev) => {
      const updated = [...prev.images, url];
      return {
        ...prev,
        images: updated,
        image: prev.image || url, // If no main cover image set yet, make this cover
      };
    });
    setNewGalleryUrl('');
  };

  // Remove Image from Gallery
  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => {
      const removedImage = prev.images[indexToRemove];
      const updatedImages = prev.images.filter((_, idx) => idx !== indexToRemove);

      // If the removed image was the active cover, switch to next available image
      let updatedCover = prev.image;
      if (prev.image === removedImage) {
        updatedCover = updatedImages[0] || '';
      }

      return {
        ...prev,
        images: updatedImages,
        image: updatedCover,
      };
    });
  };

  // Set as Primary Cover Image
  const handleSetAsCover = (url) => {
    handleChange('image', url);
  };

  // Toggle Size
  const handleToggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  // Add Color Swatch
  const handleAddColor = () => {
    if (!newColor.name.trim()) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { ...newColor, name: newColor.name.trim() }],
    }));
    setNewColor({ name: '', hex: '#000000', image: '' });
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

    const cleanSlug = formData.slug
      ? formData.slug.toLowerCase().trim().replace(/[\s_]+/g, '-')
      : formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

    const primaryImage = formData.image || formData.images[0] || '/images/prod_minimal.jpg';
    const allImages = formData.images.length > 0 ? formData.images : [primaryImage];

    const payload = {
      ...formData,
      slug: cleanSlug,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock) || 0,
      image: primaryImage,
      images: allImages,
    };

    onSave(payload);
  };

  // Calculated discount percentage
  const discountPercent =
    formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-slate-50">
      {/* 1. UNIFIED TOP HEADER */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1 text-xs font-semibold"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 font-sans tracking-tight">
                {isEdit ? `Edit: ${formData.name || 'Product'}` : 'Add New Product Drop'}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  formData.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {formData.isActive ? 'Active' : 'Draft / Inactive'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? 'Update pricing, fit style, theme, color swatches, stock, or visuals'
                : 'Publish a new authentic streetwear apparel to your catalog'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
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
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
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

      {/* 2. MAIN 2-COLUMN BODY LAYOUT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: PRODUCT IMAGES (ADD / REMOVE / COVER)       */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Cover Image Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Primary Cover Image
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                  Main Thumbnail
                </span>
              </div>

              {/* Cover Preview Box */}
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto bg-slate-100 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center group shadow-inner">
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Product Cover"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleChange('image', '')}
                        className="p-2 bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-lg hover:bg-rose-700"
                        title="Remove cover image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-medium text-slate-500">No cover image selected</p>
                    <p className="text-[10px] text-slate-400">Paste URL below or select from gallery</p>
                  </div>
                )}
              </div>

              {/* Cover Image URL Input */}
              <div className="text-xs">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cover Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleChange('image', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-[11px]"
                  />
                  {formData.images.length > 0 && formData.image !== formData.images[0] && (
                    <button
                      type="button"
                      onClick={() => handleChange('image', formData.images[0])}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                      title="Use 1st gallery photo as cover"
                    >
                      Use Gallery #1
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Images Card: Add & Remove multiple */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Gallery Images ({formData.images.length})
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">
                  Multiple angles & detail shots
                </span>
              </div>

              {/* Add New Gallery Image Input */}
              <div className="text-xs">
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Paste additional image URL..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-[11px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGalleryImage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1 shadow-sm flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Gallery Thumbnails Grid with 1-Click Remove */}
              {formData.images.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-xs">
                  No additional gallery images added yet.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((imgUrl, idx) => {
                    const isCover = formData.image === imgUrl;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border group bg-slate-100 shadow-sm ${
                          isCover ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Cover Badge if active */}
                        {isCover && (
                          <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow">
                            Cover
                          </span>
                        )}

                        {/* Hover Overlay with Action Buttons */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1.5 space-y-1.5">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(imgUrl)}
                              className="w-full py-1 bg-white text-slate-900 rounded text-[9px] font-bold uppercase tracking-wider hover:bg-slate-100 shadow"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="w-full py-1 bg-rose-600 text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-rose-700 shadow flex items-center justify-center space-x-1"
                            title="Remove image from gallery"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Color Swatches Management */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Color Variants & Swatches
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">
                  {formData.colors.length} Available
                </span>
              </div>

              {/* Existing Swatches */}
              <div className="space-y-2">
                {formData.colors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.hex}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove color"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Color Form */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Add New Color Swatch
                </span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                    className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 cursor-pointer bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Vintage Washed Olive)"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs outline-none focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: PRODUCT DETAILS & ATTRIBUTES              */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. General Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Package className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Product Details
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                {/* Product Name */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Title / Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Somewhere Better Heavyweight Boxy Tee"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-semibold text-sm"
                  />
                </div>

                {/* Slug with Auto-generate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700 uppercase tracking-wider">
                        URL Slug
                      </label>
                      <button
                        type="button"
                        onClick={generateSlugFromName}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      placeholder="somewhere-better-heavyweight-boxy-tee"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  {/* Badge / Ribbon */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Badge / Promotional Tag
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
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Description & Concept
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Crafted from luxury 240 GSM organic French Terry cotton with intentional oversized drape and durable screen print..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Pricing & Inventory */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pricing & Inventory
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Selling Price */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="1899"
                      required
                      min={0}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-slate-900 font-bold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Original MRP */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider">
                      MRP (₹)
                    </label>
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handleChange('originalPrice', e.target.value)}
                      placeholder="2499"
                      min={0}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Stock (Units)
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    placeholder="50"
                    min={0}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Categorization & Streetwear Attributes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Tag className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Categorization & Fashion Attributes
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                    Subcategory / Style
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    placeholder="e.g. Back Print, Acid Wash, Minimalist"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                  />
                </div>

                {/* Fit Style */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fit Style Attribute
                  </label>
                  <select
                    value={formData.fit}
                    onChange={(e) => handleChange('fit', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-semibold"
                  >
                    {FIT_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Theme Attribute */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Streetwear Theme Attribute
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-semibold"
                  >
                    {THEME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Fabric Material */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fabric & Material Specs
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-semibold"
                  >
                    {MATERIAL_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Sizes & Visibility Controls */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Sizes & Display Status
                </h2>
              </div>

              {/* Sizes Selector */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {STANDARD_SIZES.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`w-11 h-10 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Active Switch */}
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Active in Store</span>
                    <span className="text-[10px] text-slate-500">Visible for customer purchase</span>
                  </div>
                </label>

                {/* Bestseller Switch */}
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => handleChange('isBestseller', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Featured Bestseller</span>
                    <span className="text-[10px] text-slate-500">Show on homepage curated list</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

        </div>
      </div>
    </form>
  );
}
