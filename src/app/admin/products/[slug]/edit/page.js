'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Sparkles } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, updateProduct } from '@/app/api/productapi';
import { useAdmin } from '../../../layout';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useAdmin() || {};
  const slug = params?.slug;

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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Loading Product Editor...
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
            Cannot find product "{slug}" to edit.
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
            <Link href={`/admin/products/${slug}`} className="hover:text-blue-600 font-mono">
              {product.name}
            </Link>
            <span>/</span>
            <span className="text-blue-600">Edit</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Edit: {product.name}
          </h1>
          <p className="text-xs text-slate-500">
            Update pricing, fit style, theme, color swatches, stock, or promotional badges.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/products/${slug}`}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Specs</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Catalog</span>
          </Link>
        </div>
      </div>

      {/* Main ProductForm in Edit Mode */}
      <ProductForm
        product={product}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

