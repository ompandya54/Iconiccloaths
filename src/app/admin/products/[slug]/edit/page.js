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
    <div className="flex flex-col min-h-screen bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="w-40 h-6 bg-slate-200 rounded" />
        </div>
        <div className="w-24 h-10 bg-slate-800 rounded-lg" />
      </div>

      {/* 2-Column Body Skeleton */}
      <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <div className="w-28 h-4 bg-slate-200 rounded" />
              <div className="aspect-square w-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-slate-200 rounded" />
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-slate-100 rounded-xl" />
                <div className="w-20 h-20 bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="md:col-span-2 h-24 bg-slate-100 rounded-lg" />
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
