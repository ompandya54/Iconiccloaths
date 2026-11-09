'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Search,
  Trash2,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Pencil,
  Filter,
  X,
  SlidersHorizontal,
  Check,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ArrowLeft,
  Layers
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Tab & View State
  const [activeTab, setActiveTab] = useState('products'); // 'dashboard' | 'products' | 'orders' | 'analytics'
  const [adminView, setAdminView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  // Data Lists
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filters, Limit & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Submitting State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check Authentication on Mount via /api/admin/me
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('iconic_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data && (data.authenticated || data.success)) {
            setIsAuthenticated(true);
            fetchData();
          } else {
            localStorage.removeItem('iconic_admin_token');
            setIsAuthenticated(false);
          }
        } catch (err) {
          setIsAuthenticated(false);
        }
      }
      setCheckingAuth(false);
    };

    checkSession();
  }, []);

  // Fetch Data from APIs (Pass status=all to include both active & inactive products!)
  const fetchData = async () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('iconic_admin_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // 1. Fetch ALL products including inactive
      const prodRes = await fetch('/api/products?status=all&limit=200', { headers });
      const prodData = await prodRes.json();
      if (prodData && (prodData.products || prodData.data)) {
        setProductsList(prodData.products || prodData.data);
      }

      // 2. Fetch Orders
      const orderRes = await fetch('/api/orders', { headers });
      const orderData = await orderRes.json();
      if (orderData && (orderData.orders || orderData.data)) {
        setOrdersList(orderData.orders || orderData.data);
      }
    } catch (err) {
      console.error('Failed to load admin API data:', err);
      showToast('Failed to sync live data from server', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle Admin Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('iconic_admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickFill = () => {
    setLoginUsername('admin');
    setLoginPassword('admin123');
    setLoginError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('iconic_admin_token');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
  };

  // Handle Add Product Submit
  const handleSaveNewProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('iconic_admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProductsList((prev) => [data.product, ...prev]);
        setAdminView('list');
        showToast('New product created & published successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to create product', 'error');
      }
    } catch (err) {
      showToast('Error creating product: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Product Submit
  const handleSaveEditedProduct = async (productData) => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    const prodId = editingProduct.id || editingProduct._id;

    try {
      const token = localStorage.getItem('iconic_admin_token');
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      if (data.success && (data.product || data.data)) {
        const updated = data.product || data.data;
        setProductsList((prev) =>
          prev.map((p) => ((p.id || p._id) === prodId ? updated : p))
        );
        setAdminView('list');
        setEditingProduct(null);
        showToast('Product updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to update product', 'error');
      }
    } catch (err) {
      showToast('Error updating product: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit View
  const startEdit = (product) => {
    setEditingProduct(product);
    setAdminView('edit');
  };

  // Trigger Delete Confirmation Modal (Replaces browser alert/confirm!)
  const triggerDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Confirm Delete Action
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const prodId = productToDelete.id || productToDelete._id;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('iconic_admin_token');
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setProductsList((prev) => prev.filter((p) => (p.id || p._id) !== prodId));
        showToast(`"${productToDelete.name}" was deleted permanently`, 'success');
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        showToast(data.message || 'Error deleting product', 'error');
      }
    } catch (err) {
      showToast('Server error deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Instant Status Toggle (Active <-> Inactive)
  const handleToggleStatus = async (product) => {
    const prodId = product.id || product._id;
    try {
      const token = localStorage.getItem('iconic_admin_token');
      const res = await fetch(`/api/products/${prodId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success && data.product) {
        const updated = data.product;
        setProductsList((prev) =>
          prev.map((p) => ((p.id || p._id) === prodId ? updated : p))
        );
        showToast(
          `Status changed to: ${updated.isActive ? 'Active (Live)' : 'Inactive (Draft)'}`,
          'success'
        );
      } else {
        showToast('Failed to toggle status', 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  // Filtering Products
  const filteredProducts = productsList.filter((product) => {
    // Search query
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      product.name?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term) ||
      product.subcategory?.toLowerCase().includes(term) ||
      product.fit?.toLowerCase().includes(term) ||
      product.theme?.toLowerCase().includes(term);

    // Category filter
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;

    // Status filter (Active / Inactive / All)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination Calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Authentication Loading Screen
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // ==================== UNAUTHENTICATED: LOGIN SCREEN (White & Blue Theme) ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
        {/* Subtle Blue Gradient Background Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-serif font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
              IC
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-slate-900 leading-none uppercase">
                ICONIC
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-blue-600 uppercase mt-0.5">
                CLOTHS ADMIN
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>
        </div>

        {/* Center White Card Login Box */}
        <div className="relative z-10 max-w-md mx-auto w-full py-10">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
                <ShieldCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-slate-900 pt-1">
                Admin Portal Login
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to manage catalog, inventory, and customer orders.
              </p>
            </div>

            {/* Error Message Box */}
            {loginError && (
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Username or Email
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin or admin@iconic.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <p className="text-[11px] text-slate-500">
                Demo Credentials: <span className="text-slate-800 font-bold">admin</span> / <span className="text-slate-800 font-bold">admin123</span>
              </p>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-wider"
              >
                ⚡ Auto-Fill Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 relative z-10">
          © {new Date().getFullYear()} ICONIC CLOTHS. Enterprise Cloud Architecture.
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATED: PRODUCT ADD/EDIT PAGE VIEW ====================
  if (adminView === 'add' || adminView === 'edit') {
    return (
      <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">
        <ProductForm
          product={adminView === 'edit' ? editingProduct : null}
          onSave={adminView === 'edit' ? handleSaveEditedProduct : handleSaveNewProduct}
          onCancel={() => {
            setAdminView('list');
            setEditingProduct(null);
          }}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // ==================== AUTHENTICATED: MAIN ADMIN DASHBOARD (White & Blue Theme) ====================
  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans overflow-hidden relative">
      {/* Toast Alert Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold uppercase tracking-wider animate-fadeIn ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal (Reusable for Products, Attributes, Categories!) */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Delete Streetwear Product"
        message="Are you sure you want to remove this product drop from your store? It will be permanently removed from MongoDB Atlas."
        itemName={productToDelete?.name}
        confirmText="Yes, Delete Product"
        cancelText="Keep Product"
        isDanger={true}
        isLoading={isDeleting}
      />

      {/* Sidebar Navigation in White & Blue */}
      <aside
        className={`${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } w-full bg-white border-r border-slate-200 p-4 md:p-6 flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-30 shadow-sm`}
      >
        <div className="space-y-6 md:space-y-8">
          {/* Admin Header Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-serif font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                IC
              </span>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold tracking-[0.2em] text-slate-900 leading-none uppercase">
                    ICONIC
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.3em] text-blue-600 uppercase mt-0.5">
                    CONTROL PANEL
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3.5'
              } py-2.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3.5'
              } py-2.5 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
              title="Products"
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Products</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'products'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {productsList.length}
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3.5'
              } py-2.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
              title="Orders"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Orders</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'orders'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ordersList.length}
                  </span>
                </div>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'
            } text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors py-2 rounded-xl`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>View Live Website</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'
            } text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors py-2 rounded-xl border border-rose-100`}
            title="Admin Logout"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area in White & Blue */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50 relative">
        {/* ==================== PRODUCTS TAB ==================== */}
        {activeTab === 'products' ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Products Header Bar */}
            <header className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 flex-shrink-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              {/* Left Side: Products Count & Add Button */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <h1 className="font-sans font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900">
                    Products
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {filteredProducts.length}
                  </span>
                </div>

                {/* Primary Add Product Button */}
                <button
                  onClick={() => setAdminView('add')}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95"
                  title="Create New Product"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              </div>

              {/* Right Side: Search, Category Filter, Status Filter, Limit & Pagination */}
              <div className="flex items-center flex-wrap gap-2.5 ml-auto">
                {/* Search Bar */}
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search drops, fit, theme..."
                    className="bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none w-28 sm:w-44 focus:w-36 sm:focus:w-52 transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Status Filter (All / Active / Inactive) */}
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-xs text-slate-700 font-bold outline-none cursor-pointer pr-1"
                  >
                    <option value="all">All Status (Active + Drafts)</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive (Drafts) Only</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-xs text-slate-700 font-semibold outline-none cursor-pointer pr-1"
                  >
                    <option value="all">All Categories</option>
                    <option value="oversized">Oversized</option>
                    <option value="graphic">Graphic</option>
                    <option value="essentials">Essentials</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                {/* Rows per page */}
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-500 space-x-1.5">
                  <span className="text-[11px] font-semibold hidden lg:inline uppercase tracking-wider">
                    Rows:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-xs text-slate-900 font-bold outline-none cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 px-1.5">
                    {safeCurrentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages || totalItems === 0}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* FULL-SCREEN SCROLLABLE TABLE IN WHITE & BLUE THEME */}
            <div className="flex-1 w-full overflow-auto min-h-0 bg-white shadow-inner">
              <table className="w-full text-left text-xs border-collapse">
                {/* Sticky Header with DISTINCT FIT AND THEME COLUMNS */}
                <thead className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 shadow-sm">
                  <tr className="text-slate-600 uppercase tracking-wider font-bold text-[11px]">
                    <th className="py-3 px-4 w-16 text-center">Image</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Badge</th>
                    {/* SEPARATE FIT COLUMN */}
                    <th className="py-3 px-4 text-purple-700 font-bold">Fit Silhouette</th>
                    {/* SEPARATE THEME COLUMN */}
                    <th className="py-3 px-4 text-cyan-700 font-bold">Aesthetic Theme</th>
                    {/* STATUS COLUMN */}
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {isLoadingData && productsList.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-500">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Fetching live drops from server...
                        </p>
                      </td>
                    </tr>
                  ) : paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => {
                      const prodId = product.id || product._id;
                      const mainImg =
                        product.colors?.[0]?.image ||
                        product.image ||
                        '/images/prod_minimal.jpg';

                      return (
                        <tr
                          key={prodId}
                          className="hover:bg-blue-50/40 transition-colors group text-slate-800"
                        >
                          {/* Image */}
                          <td className="py-3 px-4 text-center">
                            <div className="w-11 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 mx-auto shadow-sm">
                              <img
                                src={mainImg}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/prod_minimal.jpg';
                                }}
                              />
                            </div>
                          </td>

                          {/* Product Name */}
                          <td className="py-3 px-4 font-semibold">
                            <div className="text-slate-900 font-bold hover:text-blue-600 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {product.slug || product.subcategory || 'streetwear'}
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                              {product.categoryLabel || product.category || 'Oversized'}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-slate-900 text-xs">
                              {product.formattedPrice || `₹${product.price}`}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-[11px] text-slate-400 line-through">
                                ₹{product.originalPrice}
                              </div>
                            )}
                          </td>

                          {/* Badge */}
                          <td className="py-3 px-4">
                            {product.badge ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
                                {product.badge}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>

                          {/* SEPARATE FIT COLUMN */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                              {product.fit || 'Oversized Fit'}
                            </span>
                          </td>

                          {/* SEPARATE THEME COLUMN */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 whitespace-nowrap">
                              {product.theme || 'Street'}
                            </span>
                          </td>

                          {/* STATUS (Active / Inactive Toggle Switch) */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(product)}
                              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-sm ${
                                product.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                              }`}
                              title="Click to toggle Active / Draft"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  product.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                              />
                              <span>{product.isActive ? 'Active' : 'Inactive'}</span>
                            </button>
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            {product.stock !== undefined ? product.stock : 50}
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="py-3 px-4 text-right pr-6 whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* EDIT BUTTON */}
                              <button
                                onClick={() => startEdit(product)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                title="Edit Product"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              {/* DELETE BUTTON (Triggers ConfirmModal popup!) */}
                              <button
                                onClick={() => triggerDelete(product)}
                                className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-500">
                        <Package className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                        <p className="text-sm font-bold text-slate-800">No products match your criteria</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Try relaxing filters or search query, or click Add Product to publish a new drop.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ==================== DASHBOARD / ORDERS / ANALYTICS TABS ==================== */
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <h1 className="font-sans font-black text-2xl uppercase tracking-tight text-slate-900">
                  {activeTab === 'dashboard' && 'Operations Overview'}
                  {activeTab === 'orders' && 'Customer Orders'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Logged in as <strong className="text-blue-600">Administrator</strong>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAdminView('add')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Drop</span>
                </button>
              </div>
            </div>

            {/* DASHBOARD TAB CONTENT */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">₹1,48,500</div>
                    <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+18.4% this month</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">{ordersList.length}</div>
                    <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Live orders in DB</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Catalog</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">{productsList.length}</div>
                    <div className="text-slate-500 text-xs font-medium">Active & Draft drops</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Subscribers</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">384</div>
                    <div className="text-slate-500 text-xs font-medium">Active streetwear club members</div>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Recent Customer Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>View All Orders</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Product</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ordersList.slice(0, 5).map((order) => (
                          <tr key={order.id || order._id} className="hover:bg-slate-50/60">
                            <td className="py-3 font-bold text-slate-900">{order.orderNumber || order.id || order._id}</td>
                            <td className="py-3 text-slate-700">{order.customer || order.guestInfo?.name || 'Customer'}</td>
                            <td className="py-3 text-slate-600 max-w-xs truncate">{order.item || order.orderItems?.[0]?.name || 'Apparel Drop'}</td>
                            <td className="py-3 font-bold text-slate-900">₹{order.totalPrice || order.amount || 999}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                {order.orderStatus || order.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB CONTENT */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ordersList.map((order) => (
                        <tr key={order.id || order._id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900">{order.orderNumber || order.id || order._id}</td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900">{order.customer || order.guestInfo?.name || 'Customer'}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{order.email || order.guestInfo?.email || ''}</div>
                          </td>
                          <td className="p-4 text-slate-700">{order.item || order.orderItems?.map((i) => i.name).join(', ') || '1 item'}</td>
                          <td className="p-4 font-bold text-slate-900">₹{order.totalPrice || order.amount || 999}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                              {order.orderStatus || order.status || 'Processing'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
