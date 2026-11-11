'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { getProductById, deleteProduct } from '@/app/api/productapi';
import { useAdmin } from '../../layout';
import ConfirmModal from '@/components/ConfirmModal';

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useAdmin() || {};
  const rawSlug = params?.slug;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : '';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await getProductById(slug);
        const data = res?.product || res?.data || (res && !res.success ? null : res);
        if (data && (data._id || data.id || data.name)) {
          setProduct(data);
          setActiveImage(
            data.image ||
            data.images?.[0] ||
            data.colors?.[0]?.image ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'
          );
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleDelete = async () => {
    if (!product) return;
    const id = product._id || product.id;
    setIsDeleting(true);

    try {
      const res = await deleteProduct(id);
      if (res && res.success !== false) {
        if (showToast) showToast(`Deleted "${product.name}" successfully`, 'success');
        router.push('/admin/products');
      } else {
        if (showToast) showToast(res.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Server error while deleting', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Loading Product Specifications...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            Could not find an item matching identifier "{slug}".
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
        >
          Return to Products Catalog
        </Link>
      </div>
    );
  }

  const isActive = product.isActive !== false;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
            <Link href="/admin" className="hover:text-blue-600">Admin</Link>
            <span>/</span>
            <Link href="/admin/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-blue-600 font-mono">{slug}</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {product.name}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {isActive ? '● Live on Store' : '○ Draft / Inactive'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catalog</span>
          </Link>

          <Link
            href={`/shop/${product.slug || product._id || product.id}`}
            target="_blank"
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            title="View Live Product Page"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Customer View</span>
          </Link>

          <Link
            href={`/admin/products/${encodeURIComponent(slug)}/edit`}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Product</span>
          </Link>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all"
            title="Delete this Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Spec Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media Gallery & Variants */}
        <div className="space-y-6">
          {/* Main Visual */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="aspect-[3/4] w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                      activeImage === img ? 'border-blue-600 scale-105' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Variants */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Color Variations ({product.colors?.length || 0})
            </h3>
            <div className="space-y-2">
              {Array.isArray(product.colors) && product.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: c.hex || '#000000' }}
                    />
                    <span className="font-bold text-slate-800">{c.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{c.hex}</span>
                  </div>
                  {c.image && (
                    <button
                      onClick={() => setActiveImage(c.image)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Preview Swatch
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sizing Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Sizing Matrix
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.sizes) && product.sizes.map((s) => (
                <span
                  key={s}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Specifications & Metrics (2 Columns Wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price & Commercials */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Selling Price
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Original MRP
                </span>
                <div className="text-2xl font-black text-slate-400 font-mono mt-1 line-through">
                  ₹{Number(product.originalPrice || product.price || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Customer Discount
                </span>
                <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                  {discountPercent ? `${discountPercent}% OFF` : 'Standard'}
                </div>
              </div>
            </div>
          </div>

          {/* Core Streetwear Specs Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Streetwear Design Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Category */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Category
                </span>
                <span className="text-slate-900 font-bold capitalize">
                  {product.category || 'Oversized Streetwear'}
                </span>
                {product.subcategory && (
                  <span className="text-slate-500 ml-1">({product.subcategory})</span>
                )}
              </div>

              {/* Fit Style */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <span className="text-indigo-600 font-bold uppercase text-[10px] block mb-1">
                  Fit Style (Distinct Attribute)
                </span>
                <span className="text-indigo-900 font-black text-sm">
                  {product.fit || 'Oversized Fit'}
                </span>
              </div>

              {/* Theme */}
              <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200">
                <span className="text-sky-600 font-bold uppercase text-[10px] block mb-1">
                  Theme Tag (Distinct Attribute)
                </span>
                <span className="text-sky-900 font-black text-sm">
                  {product.theme || 'Street'}
                </span>
              </div>

              {/* Fabric & Material */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Material & GSM
                </span>
                <span className="text-slate-900 font-bold">
                  {product.material || '100% French Terry Cotton (240 GSM)'}
                </span>
              </div>

              {/* Stock Inventory */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Stock Units Available
                </span>
                <span className="text-slate-900 font-bold font-mono text-sm">
                  {product.stock ?? 50} units
                </span>
              </div>

              {/* Badge */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Ribbon Badge
                </span>
                <span className="text-blue-700 font-black font-sans">
                  {product.badge || 'NEW DROP'}
                </span>
              </div>
            </div>
          </div>

          {/* Marketing Highlights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Merchandising Badges
            </h2>
            <div className="flex flex-wrap gap-3">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  product.isBestseller
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span>🔥 Bestseller Badge:</span>
                <span>{product.isBestseller ? 'ACTIVE' : 'OFF'}</span>
              </span>

              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  product.isFeatured
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span>⭐ Featured Drop:</span>
                <span>{product.isFeatured ? 'ACTIVE' : 'OFF'}</span>
              </span>

              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  product.isNewArrival
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span>⚡ New Arrival:</span>
                <span>{product.isNewArrival ? 'ACTIVE' : 'OFF'}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Product Story & Description
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description || 'No detailed description provided for this product drop.'}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product? All variants, images, and catalog entries will be removed."
        itemName={product.name}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}

