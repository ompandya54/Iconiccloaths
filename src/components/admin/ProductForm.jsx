'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Sparkles,
  Tag,
  DollarSign,
  Package
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Oversized Tees',
  'Graphic Streetwear',
  'Heavyweight Essentials',
  'Acid Wash Capsule',
  'Hoodies & Sweats',
  'Cargo Pants & Bottoms',
];

const DEFAULT_FITS = [
  'Oversized Fit',
  'Boxy Cut',
  'Relaxed Fit',
  'Drop Shoulder',
  'Regular Fit',
];

const DEFAULT_THEMES = [
  'Streetwear',
  'Vintage Nostalgia',
  'Minimalist Typography',
  'Japanese Anime Art',
  'Gothic & Cyberpunk',
  'Abstract Geometry',
];

const DEFAULT_COLLECTIONS = [
  'Drop 01 - Heavyweight',
  'Fall Winter 2026',
  'Acid Wash Series',
  'Monochrome Signature',
  'Limited Capsule',
];

const DEFAULT_BADGES = [
  'NEW DROP',
  'BESTSELLER',
  'LIMITED',
  'ESSENTIAL',
  'HOT',
  'FLAT 40% OFF',
  'ARCHIVE',
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ProductForm({
  product = null,
  onSave,
  onCancel,
  isSubmitting = false,
}) {
  const isEdit = Boolean(product && (product.id || product._id));

  // Options state with ability to add custom items
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [fits, setFits] = useState(DEFAULT_FITS);
  const [themes, setThemes] = useState(DEFAULT_THEMES);
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [badges, setBadges] = useState(DEFAULT_BADGES);

  // Quick Inline Add Modal / Prompt State
  const [quickAddModal, setQuickAddModal] = useState({ open: false, field: '', title: '', value: '' });

  // Main Form Data (NO SLUG FIELD - Auto-generated silently)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Oversized Tees',
    price: '',
    originalPrice: '',
    stock: 50,
    weight: '240 GSM',
    fit: 'Oversized Fit',
    theme: 'Streetwear',
    collectionName: 'Drop 01 - Heavyweight',
    material: '100% French Terry Cotton',
    description: '',
    image: '',
    images: [],
    hasVariants: false,
    variants: [
      { size: 'S', color: 'Default', price: '', stock: 20 },
      { size: 'M', color: 'Default', price: '', stock: 30 },
      { size: 'L', color: 'Default', price: '', stock: 25 },
      { size: 'XL', color: 'Default', price: '', stock: 15 },
    ],
    isActive: true,
    isBestseller: false,
    isFeatured: false,
    isNewArrival: true,
  });

  // Image input state
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);

  // Load existing product if in Edit mode
  useEffect(() => {
    if (product) {
      const initialImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

      // If categories doesn't contain current category, add it
      if (product.category && !categories.includes(product.category)) {
        setCategories((prev) => [product.category, ...prev]);
      }
      if (product.fit && !fits.includes(product.fit)) {
        setFits((prev) => [product.fit, ...prev]);
      }
      if (product.theme && !themes.includes(product.theme)) {
        setThemes((prev) => [product.theme, ...prev]);
      }

      setFormData({
        name: product.name || '',
        category: product.category || 'Oversized Tees',
        price: product.price !== undefined ? String(product.price) : '',
        originalPrice: product.originalPrice !== undefined ? String(product.originalPrice) : '',
        stock: product.stock !== undefined ? product.stock : 50,
        weight: product.material || '240 GSM',
        fit: product.fit || 'Oversized Fit',
        theme: product.theme || 'Streetwear',
        collectionName: product.collectionName || product.subcategory || 'Drop 01 - Heavyweight',
        material: product.material || '100% French Terry Cotton',
        description: product.description || '',
        image: product.image || initialImages[0] || '',
        images: initialImages,
        hasVariants: Boolean(product.hasVariants || (product.variants && product.variants.length > 0)),
        variants: Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants.map((v) => ({
              size: v.size || 'M',
              color: v.color || 'Default',
              price: v.price !== undefined ? String(v.price) : String(product.price || ''),
              stock: v.stock !== undefined ? v.stock : 20,
              sku: v.sku || '',
            }))
          : [
              { size: 'S', color: 'Default', price: String(product.price || ''), stock: 20 },
              { size: 'M', color: 'Default', price: String(product.price || ''), stock: 30 },
              { size: 'L', color: 'Default', price: String(product.price || ''), stock: 25 },
              { size: 'XL', color: 'Default', price: String(product.price || ''), stock: 15 },
            ],
        isActive: product.isActive !== false,
        isBestseller: Boolean(product.isBestseller),
        isFeatured: Boolean(product.isFeatured),
        isNewArrival: product.isNewArrival !== false,
      });

      if (product.image) setImageUrlInput(product.image);
    }
  }, [product]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Set Primary Image
  const handleApplyPrimaryImage = (url) => {
    if (!url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      image: url.trim(),
      images: prev.images.includes(url.trim()) ? prev.images : [url.trim(), ...prev.images],
    }));
  };

  // Add Media Image
  const handleAddMedia = () => {
    if (!mediaUrlInput.trim()) return;
    const url = mediaUrlInput.trim();
    setFormData((prev) => ({
      ...prev,
      images: prev.images.includes(url) ? prev.images : [...prev.images, url],
      image: prev.image || url,
    }));
    setMediaUrlInput('');
    setShowMediaInput(false);
  };

  // Remove Media Image
  const handleRemoveMedia = (indexToRemove) => {
    setFormData((prev) => {
      const removed = prev.images[indexToRemove];
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      let newMain = prev.image;
      if (prev.image === removed) {
        newMain = updated[0] || '';
      }
      return {
        ...prev,
        images: updated,
        image: newMain,
      };
    });
  };

  // Variant Management
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleAddVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: 'L', color: 'Default', price: formData.price || '', stock: 20 },
      ],
    }));
  };

  const handleRemoveVariantRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleAutoGenerateSizes = () => {
    const defaultPrices = formData.price || '1899';
    setFormData((prev) => ({
      ...prev,
      hasVariants: true,
      variants: [
        { size: 'XS', color: 'Default', price: defaultPrices, stock: 15 },
        { size: 'S', color: 'Default', price: defaultPrices, stock: 25 },
        { size: 'M', color: 'Default', price: defaultPrices, stock: 40 },
        { size: 'L', color: 'Default', price: defaultPrices, stock: 35 },
        { size: 'XL', color: 'Default', price: defaultPrices, stock: 20 },
        { size: 'XXL', color: 'Default', price: defaultPrices, stock: 10 },
      ],
    }));
  };

  // Handle Quick Add Modal Save
  const handleSaveQuickAdd = () => {
    const val = quickAddModal.value.trim();
    if (!val) return;

    if (quickAddModal.field === 'category') {
      if (!categories.includes(val)) setCategories((prev) => [...prev, val]);
      handleChange('category', val);
    } else if (quickAddModal.field === 'fit') {
      if (!fits.includes(val)) setFits((prev) => [...prev, val]);
      handleChange('fit', val);
    } else if (quickAddModal.field === 'theme') {
      if (!themes.includes(val)) setThemes((prev) => [...prev, val]);
      handleChange('theme', val);
    } else if (quickAddModal.field === 'collection') {
      if (!collections.includes(val)) setCollections((prev) => [...prev, val]);
      handleChange('collectionName', val);
    } else if (quickAddModal.field === 'badge') {
      if (!badges.includes(val)) setBadges((prev) => [...prev, val]);
      handleChange('badge', val);
    }

    setQuickAddModal({ open: false, field: '', title: '', value: '' });
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Please enter Product Name / Design Name');
    if (!formData.price) return alert('Please enter Product Price');

    // Silent Background Slug Generation (Clean lowercase with hyphens)
    const autoSlug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const primaryImg = formData.image || formData.images[0] || '/images/prod_minimal.jpg';
    const allImages = formData.images.length > 0 ? formData.images : [primaryImg];

    // Calculate total stock from variants if enabled
    const totalStock = formData.hasVariants && formData.variants.length > 0
      ? formData.variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)
      : (Number(formData.stock) || 50);

    // Filter valid variant sizes
    const availableSizes = formData.hasVariants && formData.variants.length > 0
      ? [...new Set(formData.variants.map((v) => v.size).filter(Boolean))]
      : STANDARD_SIZES.slice(1, 5);

    const discountPercent = formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
      : 0;

    // Smart Auto-Generated Badge based on status and discount
    let autoBadge = '';
    if (discountPercent > 0) {
      autoBadge = `${discountPercent}% OFF`;
    } else if (formData.isBestseller) {
      autoBadge = 'BESTSELLER';
    } else if (formData.isNewArrival) {
      autoBadge = 'NEW DROP';
    } else if (formData.isFeatured) {
      autoBadge = 'FEATURED';
    }

    const payload = {
      name: formData.name.trim(),
      slug: autoSlug, // Auto-generated silently
      category: formData.category,
      categoryLabel: formData.category,
      subcategory: formData.collectionName || 'Streetwear',
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: totalStock,
      material: formData.weight || formData.material,
      fit: formData.fit,
      theme: formData.theme,
      collectionName: formData.collectionName,
      badge: autoBadge, // Auto-computed marketing badge
      description: formData.description.trim(),
      image: primaryImg,
      images: allImages,
      sizes: availableSizes,
      hasVariants: formData.hasVariants,
      variants: formData.hasVariants
        ? formData.variants.map((v) => ({
            size: v.size,
            color: v.color || 'Default',
            price: Number(v.price) || Number(formData.price),
            stock: Number(v.stock) || 0,
            sku: v.sku || `${autoSlug}-${v.size}`.toUpperCase(),
          }))
        : [],
      isActive: formData.isActive,
      isBestseller: formData.isBestseller,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-screen bg-white">
      {/* 1. TOP HEADER (Matches Reference Images 1 & 3) */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>
        </div>

        {/* Top Right Save / Update Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] active:scale-95 text-white font-bold rounded-lg text-sm tracking-wide transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>{isEdit ? 'Update' : 'Save'}</span>
          )}
        </button>
      </div>

      {/* 2. BODY CONTENT (Exact 2-Column Structure from Reference Images) */}
      <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ======================================================== */}
          {/* LEFT COLUMN: PRODUCT IMAGE & LIVE MEDIA                   */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Product Image Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Product Image
              </label>

              {/* Big Select Product Image Area */}
              <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-all group">
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Selected Product"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleChange('image', '')}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow hover:bg-rose-700 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                      <Upload className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      Select Product Image
                    </span>
                  </div>
                )}
              </div>

              {/* Image URL Input or Quick Paste */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onBlur={() => handleApplyPrimaryImage(imageUrlInput)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleApplyPrimaryImage(imageUrlInput)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg"
                >
                  Apply
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                Allowed: .jpg, .jpeg, .png
              </p>
            </div>

            {/* Live Media (Images/Videos) Section */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Live Media (Images/Videos)
              </label>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Thumbnails */}
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group shadow-sm flex-shrink-0"
                  >
                    <img
                      src={imgUrl}
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add Media Box (Dotted square) */}
                <button
                  type="button"
                  onClick={() => setShowMediaInput(!showMediaInput)}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0"
                >
                  <Upload className="w-4 h-4 mb-1 stroke-[1.75]" />
                  <span className="text-[9px] font-bold">Add Media</span>
                </button>
              </div>

              {/* Expandable URL Input for Extra Media */}
              {showMediaInput && (
                <div className="flex items-center space-x-2 pt-2 animate-in fade-in duration-200">
                  <input
                    type="url"
                    placeholder="Enter additional image/video URL..."
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMedia();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: 2-COLUMN INPUT GRID (MATCHES REFERENCE)     */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-xs">
              
              {/* Product Category * with + button */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Product Category *
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickAddModal({ open: true, field: 'category', title: 'Add New Category', value: '' })}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    title="Add new category"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Name / Design Name * */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Product Name / Design Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Fabric Weight / GSM */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Weight / Fabric GSM
                </label>
                <input
                  type="text"
                  placeholder="e.g. 240 GSM French Terry"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Price (Base Price) * */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                  min={0}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Original / MRP Price */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Original / MRP Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2499 (for discount calculation)"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  min={0}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Total Stock / Inventory */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Total Stock Inventory
                </label>
                <input
                  type="number"
                  placeholder="Enter total units"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  min={0}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Fit Style with + Button */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Fit Style
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.fit}
                    onChange={(e) => handleChange('fit', e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 font-medium"
                  >
                    {fits.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickAddModal({ open: true, field: 'fit', title: 'Add New Fit Style', value: '' })}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    title="Add new fit style"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Streetwear Theme with + Button */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Theme / Design Style
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 font-medium"
                  >
                    {themes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickAddModal({ open: true, field: 'theme', title: 'Add New Theme', value: '' })}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    title="Add new theme"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Collection / Drop with + Button */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Collection / Capsule Drop
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.collectionName}
                    onChange={(e) => handleChange('collectionName', e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 font-medium"
                  >
                    {collections.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickAddModal({ open: true, field: 'collection', title: 'Add New Collection', value: '' })}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    title="Add new collection"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Fabric Material / Composition */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Fabric Composition / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% French Terry Cotton, Pre-shrunk"
                  value={formData.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Product Description (Span 2 Columns) */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">
                  Product Description / Fabric Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter garment details, wash care, and fit story..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 font-normal leading-relaxed"
                />
              </div>

            </div>

            {/* ======================================================== */}
            {/* PRODUCT VARIANTS MATRIX (DIFFERENT SIZE & PRICE PER SIZE)*/}
            {/* ======================================================== */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasVariants"
                    checked={formData.hasVariants}
                    onChange={(e) => handleChange('hasVariants', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="hasVariants" className="text-xs font-bold text-slate-900 cursor-pointer">
                    Enable Variants (Different Size, Individual Price & Stock per Size)
                  </label>
                </div>

                {formData.hasVariants && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleAutoGenerateSizes}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all"
                    >
                      Generate Standard Sizes (XS-XXL)
                    </button>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>
                )}
              </div>

              {formData.hasVariants && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Color / Style</th>
                        <th className="py-2.5 px-3">Price (₹)</th>
                        <th className="py-2.5 px-3">Stock Units</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 bg-white">
                      {formData.variants.map((v, i) => (
                        <tr key={i} className="hover:bg-blue-50/20">
                          {/* Size */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={v.size}
                              onChange={(e) => handleVariantChange(i, 'size', e.target.value.toUpperCase())}
                              className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                            />
                          </td>

                          {/* Color */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={v.color}
                              placeholder="Default"
                              onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                              className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                            />
                          </td>

                          {/* Price for this Size */}
                          <td className="py-2 px-3">
                            <div className="relative flex items-center w-28">
                              <span className="absolute left-2 text-slate-400 font-bold">₹</span>
                              <input
                                type="number"
                                value={v.price}
                                placeholder={formData.price || '1899'}
                                onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-2 py-1.5 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                              />
                            </div>
                          </td>

                          {/* Stock for this Size */}
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={v.stock}
                              min={0}
                              onChange={(e) => handleVariantChange(i, 'stock', Number(e.target.value))}
                              className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                            />
                          </td>

                          {/* Remove */}
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(i)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Status & Placement Curation Flags (All 4 Flags) */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Storefront Flags & Curation
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Active in Store */}
                <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.isActive
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold block">Active in Store</span>
                    <span className="text-[10px] text-slate-500">Live in catalog</span>
                  </div>
                </label>

                {/* 2. Bestseller */}
                <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.isBestseller
                    ? 'border-amber-300 bg-amber-50/70 text-amber-950 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => handleChange('isBestseller', e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold block">Bestseller</span>
                    <span className="text-[10px] text-slate-500">Homepage Bestsellers</span>
                  </div>
                </label>

                {/* 3. Featured Hero */}
                <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.isFeatured
                    ? 'border-purple-300 bg-purple-50/70 text-purple-950 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange('isFeatured', e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold block">Spotlight Drop</span>
                    <span className="text-[10px] text-slate-500">Homepage Hero / Grid</span>
                  </div>
                </label>

                {/* 4. New Arrival */}
                <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.isNewArrival
                    ? 'border-blue-300 bg-blue-50/70 text-blue-950 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => handleChange('isNewArrival', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold block">New Arrival</span>
                    <span className="text-[10px] text-slate-500">Latest Drops list</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* QUICK ADD MODAL FOR BLUE + BUTTONS */}
      {quickAddModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{quickAddModal.title}</h3>
              <button
                type="button"
                onClick={() => setQuickAddModal({ open: false, field: '', title: '', value: '' })}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              placeholder="Enter name..."
              value={quickAddModal.value}
              onChange={(e) => setQuickAddModal((prev) => ({ ...prev, value: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveQuickAdd();
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-medium"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setQuickAddModal({ open: false, field: '', title: '', value: '' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
