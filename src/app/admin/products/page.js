'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Filter,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import ProductFilterDrawer from '@/components/admin/ProductFilterDrawer';
import { getProducts, deleteProduct, toggleProductStatus } from '@/app/api/productapi';

export default function AdminProductsPage() {
  const router = useRouter();
  const { showToast } = useAdmin() || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter Drawer State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter values
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    fit: 'all',
    theme: 'all',
    stock: 'all',
    sortBy: 'newest',
  });

  // Pagination with limit
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Toggling status state
  const [togglingId, setTogglingId] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from backend (status=all so admin sees both active and inactive)
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ status: 'all', limit: 250 });
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

  // Update specific filter property
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      fit: 'all',
      theme: 'all',
      stock: 'all',
      sortBy: 'newest',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

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
            `"${product.name}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE / DRAFT'}`,
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

  // Delete Handlers
  const requestDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

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
        if (showToast) showToast(res?.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Server error while deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Unique categories list for filters
  const uniqueCategories = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  }, [products]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.fit !== 'all') count++;
    if (filters.theme !== 'all') count++;
    if (filters.stock !== 'all') count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
  }, [filters]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.fit?.toLowerCase().includes(q) ||
          p.theme?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.status === 'active') {
      list = list.filter((p) => p.isActive !== false);
    } else if (filters.status === 'inactive') {
      list = list.filter((p) => p.isActive === false);
    }

    // Category filter
    if (filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }

    // Fit filter
    if (filters.fit !== 'all') {
      list = list.filter((p) => p.fit?.toLowerCase() === filters.fit.toLowerCase());
    }

    // Theme filter
    if (filters.theme !== 'all') {
      list = list.filter((p) => p.theme?.toLowerCase() === filters.theme.toLowerCase());
    }

    // Stock filter
    if (filters.stock === 'in_stock') {
      list = list.filter((p) => (p.stock ?? 50) > 10);
    } else if (filters.stock === 'low_stock') {
      list = list.filter((p) => (p.stock ?? 50) > 0 && (p.stock ?? 50) <= 10);
    } else if (filters.stock === 'out_of_stock') {
      list = list.filter((p) => (p.stock ?? 0) <= 0);
    }

    // Sort order
    if (filters.sortBy === 'oldest') {
      list.reverse();
    } else if (filters.sortBy === 'price_low') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (filters.sortBy === 'price_high') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (filters.sortBy === 'stock_high') {
      list.sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0));
    } else if (filters.sortBy === 'name_asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [products, searchQuery, filters]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      
      {/* 1. FIXED TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-sm flex items-center justify-between gap-3 flex-shrink-0">
        
        {/* Left Side: "Products" Title + Count Badge + [+] Add Button */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              Products
            </h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {products.length}
            </span>
          </div>

          {/* Prominent [+] Add Product Button */}
          <Link
            href="/admin/products/add"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95"
            title="Add New Product Drop"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </div>

        {/* Right Side: Search Bar + Pagination with Limit + Filter Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          
          {/* Search Bar */}
          <div className="relative w-36 sm:w-56 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear Search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Pagination Controls with Limit Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">Limit:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              title="Items Per Page"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <div className="h-3 w-px bg-slate-200 mx-1 hidden sm:block" />

            <span className="text-[11px] font-bold text-slate-600 hidden lg:inline">
              {totalItems > 0
                ? `${startIndex + 1}–${Math.min(startIndex + pageSize, totalItems)} of ${totalItems}`
                : '0 items'}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-mono font-bold text-slate-700 px-1">
              {currentPage}/{totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Slide-over Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              activeFilterCount > 0
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Filter Catalog"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Refresh */}
          <button
            type="button"
            onClick={fetchProductsList}
            disabled={loading}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors hidden sm:flex"
            title="Reload Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE TABLE CONTAINER WITH FIXED COLUMN HEADERS (ATTRIBUTES) */}
      <div className="flex-1 overflow-y-auto overflow-x-auto relative">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-9 h-9 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Loading Products Catalog...
            </p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items match your active filters or search terms. Try clearing filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            {/* FIXED / STICKY COLUMN ATTRIBUTES DIRECTLY UNDER HEADER */}
            <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-md border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider shadow-sm">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Fit Style</th>
                <th className="py-3 px-4 text-center">Theme</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* TABLE ROWS - CLICKING ANYWHERE OPENS PRODUCT VIEW */}
            <tbody className="divide-y divide-slate-100 bg-white">
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
                    onClick={() => router.push(`/admin/products/${encodeURIComponent(slug)}`)}
                    className={`cursor-pointer hover:bg-blue-50/40 transition-colors group ${
                      !isActive ? 'bg-slate-50/50 opacity-80' : ''
                    }`}
                    title="Click row to inspect product specifications"
                  >
                    {/* Product Name & Visual */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-11 h-13 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 group-hover:border-blue-400 transition-colors">
                          <img
                            src={displayImg}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.badge && (
                            <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[7px] font-black uppercase text-center py-0.5 tracking-tighter">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            /{slug}
                          </div>
                          {/* Color Swatches */}
                          {Array.isArray(product.colors) && product.colors.length > 0 && (
                            <div className="flex items-center space-x-1 mt-1">
                              {product.colors.slice(0, 4).map((c, i) => (
                                <span
                                  key={i}
                                  className="w-2 h-2 rounded-full border border-slate-300"
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

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-[11px] capitalize">
                        {product.category || 'oversized'}
                      </span>
                      {product.subcategory && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {product.subcategory}
                        </div>
                      )}
                    </td>

                    {/* FIT STYLE ATTRIBUTE */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                        {product.fit || 'Oversized Fit'}
                      </span>
                    </td>

                    {/* THEME ATTRIBUTE */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
                        {product.theme || 'Street'}
                      </span>
                    </td>

                    {/* Price & MRP */}
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    {/* Stock Inventory */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-mono font-bold text-xs ${
                          (product.stock ?? 50) < 10
                            ? 'text-rose-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {product.stock ?? 50}
                      </span>
                      {(product.stock ?? 50) < 10 && (
                        <div className="text-[8px] font-bold uppercase tracking-wider text-rose-500">
                          Low Stock
                        </div>
                      )}
                    </td>

                    {/* 1-Click Status Toggle (stopPropagation) */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(product);
                        }}
                        disabled={isTogglingThis}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          isActive
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
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete Only (Eye removed, stopPropagation) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/products/${encodeURIComponent(slug)}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Button (ConfirmModal) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDelete(product);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. SLIDE-OVER FILTER DRAWER (Separate Component) */}
      <ProductFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        categories={uniqueCategories}
        totalMatching={filteredProducts.length}
      />

      {/* 4. REUSABLE CONFIRMATION MODAL */}
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
