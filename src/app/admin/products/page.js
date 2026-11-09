'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Pencil,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import { getProducts, deleteProduct, toggleProductStatus } from '@/app/api/productapi';

export default function AdminProductsPage() {
  const { showToast } = useAdmin() || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Status Toggling State (stores id being toggled)
  const [togglingId, setTogglingId] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from backend
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      // Pass status=all so admin sees both active and inactive/draft items
      const res = await getProducts({ status: 'all', limit: 200 });
      if (res && (res.data || res.products)) {
        setProducts(res.data || res.products || []);
      } else if (Array.isArray(res)) {
        setProducts(res);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      if (showToast) showToast('Failed to load products from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  // 1-Click Toggle Active / Inactive Status
  const handleToggleStatus = async (product) => {
    const id = product._id || product.id;
    if (!id) return;

    setTogglingId(id);
    try {
      const res = await toggleProductStatus(id);
      if (res && (res.success || res.product || res.data)) {
        const nextStatus = res.product?.isActive ?? res.data?.isActive ?? !product.isActive;
        setProducts((prev) =>
          prev.map((p) =>
            (p._id === id || p.id === id) ? { ...p, isActive: nextStatus } : p
          )
        );
        if (showToast) {
          showToast(
            `"${product.name}" marked as ${nextStatus ? 'ACTIVE' : 'INACTIVE / DRAFT'}`,
            'success'
          );
        }
      } else {
        // Optimistic toggle fallback
        setProducts((prev) =>
          prev.map((p) =>
            (p._id === id || p.id === id) ? { ...p, isActive: !p.isActive } : p
          )
        );
        if (showToast) showToast('Product visibility updated', 'success');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      if (showToast) showToast('Error updating status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Open Delete Modal
  const requestDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const id = productToDelete._id || productToDelete.id;
    setIsDeleting(true);

    try {
      const res = await deleteProduct(id);
      if (res && res.success !== false) {
        setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
        if (showToast) {
          showToast(`Deleted "${productToDelete.name}" successfully`, 'success');
        }
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        if (showToast) showToast(res.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      if (showToast) showToast('Server error while deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    // Search match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      product.name?.toLowerCase().includes(q) ||
      product.slug?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.fit?.toLowerCase().includes(q) ||
      product.theme?.toLowerCase().includes(q);

    // Category match
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;

    // Status match (Active, Inactive, All)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive !== false) ||
      (statusFilter === 'inactive' && product.isActive === false);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Extract categories for filter dropdown
  const uniqueCategories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Inventory & Catalog Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Product Management
          </h1>
          <p className="text-xs text-slate-500">
            View active drops, draft listings, distinct Fit & Theme attributes, and stock levels.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchProductsList}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <Link
            href="/admin/products/add"
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, slug, fit, or theme..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
        </div>

        {/* Filter Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All ({products.length})</option>
              <option value="active">
                Active Only ({products.filter((p) => p.isActive !== false).length})
              </option>
              <option value="inactive">
                Inactive / Drafts ({products.filter((p) => p.isActive === false).length})
              </option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer capitalize"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Page Size */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-9 h-9 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Loading Products Catalog...
            </p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items match your selected filters. Try searching for something else or reset your filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  {/* Distinct Column 1: FIT */}
                  <th className="py-3.5 px-4 text-center">Fit Style</th>
                  {/* Distinct Column 2: THEME */}
                  <th className="py-3.5 px-4 text-center">Theme</th>
                  <th className="py-3.5 px-4">Price / MRP</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedProducts.map((product) => {
                  const id = product._id || product.id;
                  const slug = product.slug || id;
                  const isActive = product.isActive !== false;
                  const displayImg =
                    product.image ||
                    product.colors?.[0]?.image ||
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80';

                  const isTogglingThis = togglingId === id;

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-slate-50/80 transition-colors ${!isActive ? 'bg-slate-50/40 opacity-75' : ''
                        }`}
                    >
                      {/* Product Name & Visual */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            <img
                              src={displayImg}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            {product.badge && (
                              <span className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-tighter">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 truncate" title={product.name}>
                              {product.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              /{slug}
                            </div>
                            {/* Color swatches preview */}
                            {Array.isArray(product.colors) && product.colors.length > 0 && (
                              <div className="flex items-center space-x-1 mt-1">
                                {product.colors.slice(0, 4).map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                    style={{ backgroundColor: c.hex || '#000' }}
                                    title={c.name}
                                  />
                                ))}
                                {product.colors.length > 4 && (
                                  <span className="text-[9px] text-slate-400 font-medium">
                                    +{product.colors.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category & Subcategory */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-[11px] capitalize">
                          {product.category || 'oversized'}
                        </span>
                        {product.subcategory && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            {product.subcategory}
                          </div>
                        )}
                      </td>

                      {/* DISTINCT COLUMN: FIT STYLE */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                          {product.fit || 'Oversized Fit'}
                        </span>
                      </td>

                      {/* DISTINCT COLUMN: THEME */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
                          {product.theme || 'Street'}
                        </span>
                      </td>

                      {/* Price & MRP */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 text-sm">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[11px] text-slate-400 line-through">
                            ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-mono font-bold text-xs ${(product.stock ?? 50) < 10
                              ? 'text-rose-600'
                              : 'text-slate-800'
                            }`}
                        >
                          {product.stock ?? 50}
                        </span>
                        {(product.stock ?? 50) < 10 && (
                          <div className="text-[9px] font-bold uppercase tracking-wider text-rose-500">
                            Low Stock
                          </div>
                        )}
                      </td>

                      {/* 1-Click Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          disabled={isTogglingThis}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            } ${isTogglingThis ? 'opacity-50 cursor-wait' : 'cursor-pointer active:scale-95'}`}
                          title="Click to toggle visibility in store"
                        >
                          {isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions: View, Edit, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Preview */}
                          <Link
                            href={`/admin/products/${slug}`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Product Specs"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit Product */}
                          <Link
                            href={`/admin/products/${slug}/edit`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          {/* Delete Product (opens ConfirmModal) */}
                          <button
                            type="button"
                            onClick={() => requestDelete(product)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-900">
                {Math.min(startIndex + pageSize, totalItems)}
              </span>{' '}
              of <span className="font-bold text-slate-900">{totalItems}</span> products
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Delete Confirmation Popup */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to permanently remove this product from the catalog? This action will remove it from all live collections."
        itemName={productToDelete?.name || ''}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}

