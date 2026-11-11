'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Sparkles } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, updateProduct } from '@/app/api/productapi';
import { useAdmin } from '../../../layout';

// Clean Content-Only Skeleton Loader
function ProductEditSkeleton() {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-8 bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="w-48 h-5 bg-slate-200 rounded" />
            <div className="w-72 h-3 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="w-20 h-9 bg-slate-200 rounded-xl" />
          <div className="w-28 h-9 bg-blue-200 rounded-xl" />
        </div>
      </div>

      {/* 2-Column Body Skeleton */}
      <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="w-32 h-4 bg-slate-200 rounded" />
              <div className="aspect-[3/4] w-full bg-slate-100 rounded-xl" />
              <div className="w-full h-9 bg-slate-100 rounded-xl" />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="w-36 h-4 bg-slate-200 rounded" />
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-[3/4] bg-slate-100 rounded-xl" />
                <div className="aspect-[3/4] bg-slate-100 rounded-xl" />
                <div className="aspect-[3/4] bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="w-40 h-4 bg-slate-200 rounded" />
              <div className="w-full h-10 bg-slate-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
              <div className="w-full h-24 bg-slate-100 rounded-xl" />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="w-36 h-4 bg-slate-200 rounded" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="w-48 h-4 bg-slate-200 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useAdmin() || {};
  const rawSlug = params?.slug;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : '';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await getProductById(slug);
        const data = res?.product || res?.data || (res && !res.success ? null : res);
        if (data && (data._id || data.id || data.name)) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Fetch error for edit:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleSave = async (formData) => {
    if (!product) return;
    const id = product._id || product.id;
    setIsSubmitting(true);

    try {
      const res = await updateProduct(id, formData);
      if (res && res.success !== false) {
        if (showToast) showToast(`Product "${formData.name}" updated successfully!`, 'success');
        router.push('/admin/products');
      } else {
        if (showToast) showToast(res.message || 'Failed to update product', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      if (showToast) showToast('Server error while updating product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  // Skeleton view while loading product data
  if (loading) {
    return <ProductEditSkeleton />;
  }

  // Not Found view
  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50 h-full">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Product Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            Cannot find product "{slug}" to edit.
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ProductForm
        product={product}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
