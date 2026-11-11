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
  Eye,
  DollarSign
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
            '/images/prod_minimal.jpg'
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
        if (showToast) showToast(`Product "${product.name}" deleted`, 'success');
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
      <div className="flex flex-col min-h-screen bg-white animate-pulse">
        <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between">
          <div className="w-36 h-6 bg-slate-200 rounded" />
          <div className="w-20 h-9 bg-blue-200 rounded-lg" />
        </div>
        <div className="p-6 sm:p-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <div className="aspect-square bg-slate-100 rounded-2xl" />
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-slate-100 rounded-xl" />
              <div className="w-16 h-16 bg-slate-100 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 gap-4">
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-white min-h-screen">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Product Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            Could not find an item matching identifier "{slug}".
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
        >
          Return to Products Catalog
        </Link>
      </div>
    );
  }

  const allImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. TOP HEADER (Matches Reference Image 2: View Product) */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-1.5 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            View Product
          </h1>
        </div>

        {/* Action Buttons: Blue Edit Button + Delete */}
        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/products/${encodeURIComponent(slug)}/edit`}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm flex items-center space-x-2"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. BODY CONTENT (Exact 2-Column Layout from Reference Image 2) */}
      <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT COLUMN: PRODUCT IMAGE & LIVE MEDIA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Product Image
              </label>

              {/* Big Display Image Box */}
              <div className="relative aspect-square w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <img
                  src={activeImage || product.image || '/images/prod_minimal.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Live Media Thumbnails */}
            {allImages.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Live Media ({allImages.length})
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl border overflow-hidden bg-slate-50 transition-all ${
                        activeImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: 2-COLUMN FIELD DETAILS GRID */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              
              {/* Product Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Product Category
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-medium">
                  {product.category || product.categoryLabel || 'Oversized Tees'}
                </div>
              </div>

              {/* Product Name / Design Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Product Name / Design Name
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-bold text-sm">
                  {product.name}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Price
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-bold text-sm text-blue-700">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Fabric Weight / GSM */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Weight / Fabric GSM
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-medium">
                  {product.material || '240 GSM'}
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Total Stock Inventory
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-bold">
                  {product.stock ?? 50} Units
                </div>
              </div>

              {/* Fit Style */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Fit Style
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-medium">
                  {product.fit || 'Oversized Fit'}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Theme / Style
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-medium">
                  {product.theme || 'Streetwear'}
                </div>
              </div>

              {/* Collection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Collection / Capsule
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-medium">
                  {product.collectionName || product.subcategory || 'Drop 01 - Heavyweight'}
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Badge / Ribbon Tag
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-bold uppercase">
                  {product.badge || 'NEW DROP'}
                </div>
              </div>

              {/* Store Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Status
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 font-bold">
                  <span className={product.isActive !== false ? 'text-emerald-600' : 'text-amber-600'}>
                    ● {product.isActive !== false ? 'Active in Store' : 'Draft / Inactive'}
                  </span>
                </div>
              </div>

              {/* Description (2 Columns) */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Product Description
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-700 leading-relaxed font-normal min-h-[70px]">
                  {product.description || 'No description provided.'}
                </div>
              </div>

            </div>

            {/* Product Variants Matrix Table */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Product Variants & Individual Sizing Stock
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Color</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Stock Units</th>
                        <th className="py-2.5 px-3">SKU</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 bg-white">
                      {product.variants.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{v.size}</td>
                          <td className="py-2.5 px-3 text-slate-600">{v.color || 'Default'}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-700">₹{v.price || product.price}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{v.stock}</td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{v.sku || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Product'}
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
