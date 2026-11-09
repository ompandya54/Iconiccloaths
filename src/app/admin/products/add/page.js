'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Package } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { createProduct } from '@/app/api/productapi';
import { useAdmin } from '../../layout';

export default function AddProductPage() {
  const router = useRouter();
  const { showToast } = useAdmin() || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await createProduct(formData);
      if (res && res.success !== false) {
        if (showToast) showToast('Product drop created successfully!', 'success');
        router.push('/admin/products');
      } else {
        if (showToast) showToast(res.message || 'Failed to create product', 'error');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      if (showToast) showToast('Server error while saving product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
            <Link href="/admin" className="hover:text-blue-600">Admin</Link>
            <span>/</span>
            <Link href="/admin/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-blue-600">Add Product</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Add New Product Drop
          </h1>
          <p className="text-xs text-slate-500">
            Publish a new streetwear design with variants, fit details, theme tags, and high-res imagery.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Form Component */}
      <ProductForm
        product={null}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

