'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ProductForm
        product={null}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
