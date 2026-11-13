'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Plus, Trash2, Pencil, Sparkles, ArrowRight } from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Oversized Streetwear', slug: 'oversized', count: 12, description: 'Heavyweight drop shoulder silhouettes and boxy tees.' },
  { id: 'cat-2', name: 'Graphic Streetwear', slug: 'graphic', count: 8, description: 'High-density puff and screen printed visuals.' },
  { id: 'cat-3', name: 'Essentials', slug: 'essentials', count: 6, description: 'Clean minimal basics in heavyweight combed cotton.' },
  { id: 'cat-4', name: 'New Arrivals', slug: 'new-arrivals', count: 5, description: 'Latest capsule releases and seasonal drops.' },
  { id: 'cat-5', name: 'Bottoms & Cargo', slug: 'bottoms', count: 4, description: 'Technical tactical cargos and relaxed skate pants.' },
  { id: 'cat-6', name: 'Hoodies & Sweats', slug: 'hoodies', count: 3, description: '380 GSM fleece and winter-ready outerwear.' },
];

export default function AdminCategoriesPage() {
  const { showToast } = useAdmin() || {};
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().trim().replace(/[\s_]+/g, '-');
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      count: 0,
      description: newCatDesc.trim() || 'New streetwear collection category.',
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCatName('');
    setNewCatDesc('');
    if (showToast) showToast(`Category "${newCategory.name}" added successfully!`, 'success');
  };

  const requestDelete = (cat) => {
    setCatToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!catToDelete) return;
    setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
    if (showToast) showToast(`Deleted "${catToDelete.name}" category`, 'success');
    setDeleteModalOpen(false);
    setCatToDelete(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      {/* Top Header matching Attributes & Reference Design */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 pt-3.5 flex flex-col md:flex-row md:items-end justify-between gap-3 flex-shrink-0">
        <div className="pb-3 flex items-center space-x-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Categories & Taxonomy
          </h1>
        </div>

        <nav className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="pb-3 text-xs uppercase tracking-wider text-slate-950 font-bold border-b-2 border-slate-950 -mb-px whitespace-nowrap cursor-default">
            CATEGORIES
          </span>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            FIT STYLES
          </Link>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            THEMES
          </Link>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            BADGES
          </Link>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            FABRICS & GSM
          </Link>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            COLORS
          </Link>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            COLLECTIONS
          </Link>
          <Link
            href="/admin/attributes"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            SIZES
          </Link>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Taxonomy & Collections
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Categories & Collections
          </h1>
          <p className="text-xs text-slate-500">
            Structure your storefront navigation, collection filters, and category landing pages.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto"
        >
          <span>Catalog View</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Add New Category
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category Title
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Acid Wash Drops"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief summary for storefront banners..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Store Categories ({categories.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 pr-4 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm truncate">{cat.name}</span>
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      /{cat.slug}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-1">{cat.description}</p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {cat.count} items
                  </span>

                  <button
                    type="button"
                    onClick={() => requestDelete(cat)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

      {/* Delete Confirmation Popup */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products assigned to it will remain in catalog under uncategorized."
        itemName={catToDelete?.name || ''}
        confirmText="Delete Category"
        isDanger={true}
      />
    </div>
  );
}

