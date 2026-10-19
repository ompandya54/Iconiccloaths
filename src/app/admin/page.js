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
  Check
} from 'lucide-react';

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

  // Dashboard State
  const [activeTab, setActiveTab] = useState('products');
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Product List Filters, Limit & Pagination State
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Add & Edit Product Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'oversized',
    subcategory: 'Back Print',
    fit: 'Oversized Fit',
    theme: 'Street',
    material: '100% Cotton (240 GSM)',
    price: '',
    badge: 'NEW DROP',
    image: '/images/prod_minimal.jpg'
  });

  // Check Authentication on Mount via /api/admin/me API
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('iconic_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.authenticated) {
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

  // Fetch Data from APIs
  const fetchData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.products) setProductsList(prodData.products);

      const orderRes = await fetch('/api/orders');
      const orderData = await orderRes.json();
      if (orderData.orders) setOrdersList(orderData.orders);
    } catch (err) {
      console.error('Failed to load API data', err);
    }
  };

  // Handle Admin Login Submission via API (/api/admin/login)
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

      if (data.success) {
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

  // Quick One-click Demo Credentials Auto Fill
  const handleQuickFill = () => {
    setLoginUsername('admin');
    setLoginPassword('admin123');
    setLoginError('');
  };

  // Handle Admin Logout
  const handleLogout = () => {
    localStorage.removeItem('iconic_admin_token');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
  };

  // Handle Add Product via API (/api/products)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('iconic_admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      const data = await res.json();
      if (data.success) {
        setProductsList([data.product, ...productsList]);
        setIsAddProductOpen(false);
        setNewProduct({
          name: '',
          category: 'oversized',
          subcategory: 'Back Print',
          fit: 'Oversized Fit',
          theme: 'Street',
          material: '100% Cotton (240 GSM)',
          price: '',
          badge: 'NEW DROP',
          image: '/images/prod_minimal.jpg'
        });
        showToast('New product drop added successfully!', 'success');
      } else {
        showToast(data.message || 'Error creating product', 'error');
      }
    } catch (err) {
      showToast('Error creating product: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Product Modal
  const startEdit = (product) => {
    setEditingProduct({
      id: product.id || product._id,
      name: product.name || '',
      category: product.category || 'oversized',
      subcategory: product.subcategory || 'Back Print',
      fit: product.fit || 'Oversized Fit',
      theme: product.theme || 'Street',
      material: product.material || '100% Cotton (240 GSM)',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      badge: product.badge || 'NEW DROP',
      stock: product.stock ?? 50,
      image: product.image || product.colors?.[0]?.image || '/images/prod_minimal.jpg',
      colors: product.colors || []
    });
    setIsEditProductOpen(true);
  };

  // Handle Edit Product via API (/api/products/[id])
  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('iconic_admin_token');
      const { id, _id, formattedPrice, createdAt, updatedAt, __v, ...updateData } = editingProduct;

      updateData.price = Number(updateData.price);
      if (updateData.originalPrice) {
        updateData.originalPrice = Number(updateData.originalPrice);
      }
      if (updateData.stock !== undefined) {
        updateData.stock = Number(updateData.stock);
      }
      if (editingProduct.image) {
        if (Array.isArray(editingProduct.colors) && editingProduct.colors.length > 0) {
          updateData.colors = editingProduct.colors.map((c, i) =>
            i === 0 ? { ...c, image: editingProduct.image } : c
          );
        } else {
          updateData.colors = [{ name: 'Default', hex: '#0a0a0a', image: editingProduct.image }];
        }
        updateData.image = editingProduct.image;
      }

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();
      if (data.success) {
        setProductsList(productsList.map((p) => (p.id === editingProduct.id ? data.product : p)));
        setIsEditProductOpen(false);
        setEditingProduct(null);
        showToast('Product updated successfully!', 'success');
      } else {
        showToast(data.message || 'Error updating product', 'error');
      }
    } catch (err) {
      showToast('Error updating product: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Product via API (/api/products/[id])
  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('iconic_admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setProductsList(productsList.filter((p) => p.id !== id));
        showToast('Product deleted from catalog', 'success');
      } else {
        showToast(data.message || 'Error deleting product', 'error');
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  // Search & Filter handlers
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (val) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (val) => {
    setPageSize(Number(val));
    setCurrentPage(1);
  };

  // Filter & Pagination Calculations
  const filteredProducts = productsList.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.category && product.category.toLowerCase().includes(query)) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(query)) ||
      (product.badge && product.badge.toLowerCase().includes(query));

    const matchesCategory =
      categoryFilter === 'all' ||
      product.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center text-white font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  // ==================== UNAUTHENTICATED: LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060608] text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-white selection:text-black relative overflow-hidden">
        
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-white leading-none uppercase">
              ICONIC
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[0.45em] text-gray-400 leading-tight mt-1 uppercase">
              CLOTHS
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Website
          </Link>
        </div>

        {/* Center Glassmorphism Login Dialog */}
        <div className="relative z-10 max-w-md mx-auto w-full py-12">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-white pt-2">
                ADMIN PORTAL LOGIN
              </h2>
              <p className="text-xs text-gray-400">
                Enter your administrative credentials to manage ICONIC CLOTHS.
              </p>
            </div>

            {/* Error Message Box */}
            {loginError && (
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full bg-[#161620] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-[#161620] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 outline-none focus:border-white transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-white text-black hover:bg-gray-200 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg pt-3.5"
              >
                {isLoggingIn ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>LOGIN TO DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <p className="text-[11px] text-gray-500">
                Demo Credentials: <span className="text-gray-300 font-bold">admin</span> / <span className="text-gray-300 font-bold">admin123</span>
              </p>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-amber-400 hover:underline uppercase tracking-wider"
              >
                ⚡ Auto-fill Demo Credentials
              </button>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-gray-600 relative z-10">
          © {new Date().getFullYear()} ICONIC CLOTHS. Admin Security Protection.
        </div>

      </div>
    );
  }

  // ==================== AUTHENTICATED: ADMIN DASHBOARD ====================
  return (
    <div className="h-screen w-full bg-[#060608] text-white flex flex-col md:flex-row font-sans selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* Toast Alert Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold uppercase tracking-wider animate-bounce ${
          toast.type === 'error'
            ? 'bg-red-500/20 border-red-500/40 text-red-300'
            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 backdrop-blur-md'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} w-full bg-[#0a0a0e] border-r border-white/10 p-4 md:p-6 flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-30`}>
        <div className="space-y-6 md:space-y-8">
          {/* Admin Header Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-xl font-bold tracking-[0.25em] text-white uppercase leading-none">
                {isSidebarCollapsed ? 'IC' : 'ICONIC'}
              </span>
              {!isSidebarCollapsed && (
                <span className="font-sans text-[10px] font-medium tracking-[0.45em] text-gray-400 uppercase mt-1">
                  ADMIN CONTROL
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar (Full Width)"}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title="Products"
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Products ({productsList.length})</span>}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title="Orders"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Orders ({ordersList.length})</span>}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title="Analytics"
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Analytics</span>}
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'} text-xs font-bold text-red-400 hover:text-red-300 transition-colors py-2 rounded-lg bg-red-500/10 border border-red-500/20`}
            title="Admin Logout"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Admin Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#060608] relative">

        {/* ==================== PRODUCTS TAB: FULL SCREEN LAYOUT ==================== */}
        {activeTab === 'products' ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Top Products Header Bar */}
            <header className="px-4 sm:px-6 py-3.5 bg-[#0a0a0e] border-b border-white/10 flex-shrink-0 z-30 flex flex-wrap items-center justify-between gap-3">
              
              {/* LEFT SIDE: Products Title & Count + Plus (+) Add Product Button */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <h1 className="font-sans font-black text-lg sm:text-xl uppercase tracking-tight text-white">
                    Products
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-white/10 text-white border border-white/15">
                    {productsList.length}
                  </span>
                </div>

                {/* PLUS BUTTON ON LEFT TO ADD PRODUCT */}
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex items-center space-x-1.5 bg-white text-black hover:bg-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
                  title="Add New Product Drop"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              </div>

              {/* RIGHT SIDE: Search, Filter, Limit & Pagination */}
              <div className="flex items-center flex-wrap gap-2.5 ml-auto">
                
                {/* SEARCH BAR */}
                <div className="relative flex items-center bg-[#121218] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-white/30 transition-all">
                  <Search className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search drops..."
                    className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-28 sm:w-44 focus:w-36 sm:focus:w-52 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="text-gray-400 hover:text-white ml-1 p-0.5"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* CATEGORY FILTER */}
                <div className="relative flex items-center bg-[#121218] border border-white/10 rounded-xl px-2.5 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-400 mr-1.5 flex-shrink-0" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => handleCategoryFilterChange(e.target.value)}
                    className="bg-transparent text-xs text-white outline-none cursor-pointer pr-1"
                  >
                    <option value="all" className="bg-[#121218] text-white">All Categories</option>
                    <option value="oversized" className="bg-[#121218] text-white">Oversized</option>
                    <option value="graphic" className="bg-[#121218] text-white">Graphic</option>
                    <option value="essentials" className="bg-[#121218] text-white">Essentials</option>
                    <option value="new-arrivals" className="bg-[#121218] text-white">New Arrivals</option>
                  </select>
                </div>

                {/* LIMIT (ROWS PER PAGE) */}
                <div className="flex items-center bg-[#121218] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-gray-400 space-x-1.5">
                  <span className="text-[11px] font-semibold text-gray-400 hidden lg:inline uppercase tracking-wider">
                    Limit:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold"
                    title="Items per page"
                  >
                    <option value={5} className="bg-[#121218] text-white">5</option>
                    <option value={10} className="bg-[#121218] text-white">10</option>
                    <option value={20} className="bg-[#121218] text-white">20</option>
                    <option value={50} className="bg-[#121218] text-white">50</option>
                  </select>
                </div>

                {/* PROPER TOP-RIGHT PAGINATION */}
                <div className="flex items-center space-x-1.5 bg-[#121218] border border-white/10 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold text-gray-200 px-1.5 whitespace-nowrap">
                    {safeCurrentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages || totalItems === 0}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </header>

            {/* FULL-SCREEN SCROLLABLE TABLE AREA */}
            <div className="flex-1 w-full overflow-auto min-h-0 relative">
              <table className="w-full text-left text-xs border-collapse">
                
                {/* STICKY COLUMN ATTRIBUTES (HEADER) */}
                <thead className="sticky top-0 z-20 bg-[#0e0e14] backdrop-blur-md shadow-md border-b border-white/10">
                  <tr className="text-gray-400 uppercase tracking-wider font-bold text-[11px]">
                    <th className="py-3.5 px-4 w-16 text-center">Image</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Badge</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Theme & Fit</th>
                    <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>

                {/* TABLE ROWS */}
                <tbody className="divide-y divide-white/5">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => {
                      const mainImg = product.colors?.[0]?.image || product.image || '/images/prod_minimal.jpg';
                      return (
                        <tr
                          key={product.id || product._id}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          {/* Image */}
                          <td className="py-2.5 px-4 text-center">
                            <div className="w-12 h-14 mx-auto rounded-lg overflow-hidden bg-black border border-white/10 flex items-center justify-center flex-shrink-0">
                              <img
                                src={mainImg}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = '/images/prod_minimal.jpg';
                                }}
                              />
                            </div>
                          </td>

                          {/* Product Name (Without ID) */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                              {product.name}
                            </div>
                            {product.subcategory && (
                              <div className="text-[11px] text-gray-400 mt-0.5">
                                {product.subcategory}
                              </div>
                            )}
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-white text-sm">
                              {product.formattedPrice || `₹${Number(product.price).toLocaleString('en-IN')}`}
                            </div>
                            {product.originalPrice && (
                              <div className="text-[11px] text-gray-500 line-through">
                                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>

                          {/* Badge */}
                          <td className="py-3 px-4">
                            {product.badge ? (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                                product.badge.toLowerCase().includes('best')
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : product.badge.toLowerCase().includes('new')
                                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                                  : product.badge.toLowerCase().includes('hot')
                                  ? 'bg-red-500/10 text-red-300 border-red-500/30'
                                  : 'bg-white/10 text-white border-white/20'
                              }`}>
                                {product.badge}
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>

                          {/* Theme & Fit */}
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div className="text-xs text-gray-300">{product.fit || 'Oversized Fit'}</div>
                            <div className="text-[11px] text-gray-500">{product.theme || 'Street'}</div>
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="py-3 px-4 text-right pr-6 whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1">
                              {/* EDIT BUTTON */}
                              <button
                                onClick={() => startEdit(product)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                title="Edit Product Drop"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => handleDeleteProduct(product.id || product._id)}
                                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                title="Delete Product Drop"
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
                      <td colSpan={7} className="py-16 text-center text-gray-400">
                        <Package className="w-10 h-10 mx-auto mb-3 opacity-30 text-white" />
                        <p className="text-sm font-semibold text-white">No products found</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Try adjusting your search query or category filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* ==================== DASHBOARD / ORDERS / ANALYTICS ==================== */
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
            
            {/* Header for other tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/10 gap-4">
              <div>
                <h1 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                  {activeTab === 'dashboard' && 'SYSTEM OVERVIEW'}
                  {activeTab === 'orders' && 'CUSTOMER ORDERS'}
                  {activeTab === 'analytics' && 'SALES & ANALYTICS'}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Logged in as <strong className="text-white">ICONIC Admin Owner</strong>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW DROP</span>
                </button>
              </div>
            </div>

            {/* DASHBOARD TAB CONTENT */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">₹1,48,500</div>
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+18.4% from last month</span>
                    </div>
                  </div>

                  <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{ordersList.length}</div>
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>12 new orders today</span>
                    </div>
                  </div>

                  <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{productsList.length}</div>
                    <div className="text-gray-400 text-xs">All items live in catalog</div>
                  </div>

                  <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Club Members</span>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">384</div>
                    <div className="text-gray-400 text-xs">Active subscribers</div>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Product</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {ordersList.slice(0, 4).map((order) => (
                          <tr key={order.id} className="hover:bg-white/[0.02]">
                            <td className="py-3.5 font-bold text-white">{order.id}</td>
                            <td className="py-3.5 text-gray-300">{order.customer}</td>
                            <td className="py-3.5 text-gray-300 max-w-xs truncate">{order.item}</td>
                            <td className="py-3.5 font-bold text-white">{order.amount}</td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {order.status}
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
              <div className="space-y-6">
                <div className="bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Item</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {ordersList.map((order) => (
                          <tr key={order.id} className="hover:bg-white/[0.02]">
                            <td className="p-4 font-bold text-white">{order.id}</td>
                            <td className="p-4">
                              <div className="font-semibold text-white">{order.customer}</div>
                              <div className="text-[11px] text-gray-500">{order.email}</div>
                            </td>
                            <td className="p-4 text-gray-300">{order.item}</td>
                            <td className="p-4 font-bold text-white">{order.amount}</td>
                            <td className="p-4 text-gray-400">{order.date}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {order.status}
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

            {/* ANALYTICS TAB CONTENT */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Top Performing Categories</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-gray-300 mb-1">
                          <span>Oversized Tees</span>
                          <span className="font-bold text-white">42%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-[42%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-gray-300 mb-1">
                          <span>Graphic Tees</span>
                          <span className="font-bold text-white">35%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-[35%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==================== ADD PRODUCT MODAL ==================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddProductOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative z-10 w-full max-w-lg bg-[#121218] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">ADD NEW STREETWEAR DROP</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Publish new exclusive inventory to the catalog</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Acid Wash Oversized Tee"
                  className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="oversized">Oversized Tees</option>
                    <option value="graphic">Graphic Tees</option>
                    <option value="essentials">Essentials</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="999"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Subcategory</label>
                  <select
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Back Print">Back Print</option>
                    <option value="Front Graphic">Front Graphic</option>
                    <option value="Typography">Typography</option>
                    <option value="Solid Essentials">Solid Essentials</option>
                    <option value="Vintage Art">Vintage Art</option>
                    <option value="Abstract Print">Abstract Print</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Fit</label>
                  <select
                    value={newProduct.fit}
                    onChange={(e) => setNewProduct({ ...newProduct, fit: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Oversized Fit">Oversized Fit</option>
                    <option value="Boxy Fit">Boxy Fit</option>
                    <option value="Regular Fit">Regular Fit</option>
                    <option value="Relaxed Fit">Relaxed Fit</option>
                    <option value="Slim Fit">Slim Fit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Design / Theme</label>
                  <select
                    value={newProduct.theme}
                    onChange={(e) => setNewProduct({ ...newProduct, theme: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Street">Street</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Typography">Typography</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Anime">Anime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Badge</label>
                  <select
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="NEW DROP">NEW DROP</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="HOT">HOT</option>
                    <option value="">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Material / Fabric</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                    placeholder="e.g. 100% Cotton (240 GSM)"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="/images/prod_minimal.jpg"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 py-3.5 rounded-full font-bold uppercase tracking-wider transition-all pt-3 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'CREATING DROP...' : 'CREATE PRODUCT DROP'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT PRODUCT MODAL ==================== */}
      {isEditProductOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsEditProductOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative z-10 w-full max-w-lg bg-[#121218] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">EDIT PRODUCT DROP</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Update product details, pricing, and tags
                </p>
              </div>
              <button
                onClick={() => setIsEditProductOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Acid Wash Oversized Tee"
                  className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="oversized">Oversized Tees</option>
                    <option value="graphic">Graphic Tees</option>
                    <option value="essentials">Essentials</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="999"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Subcategory</label>
                  <select
                    value={editingProduct.subcategory}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Back Print">Back Print</option>
                    <option value="Front Graphic">Front Graphic</option>
                    <option value="Typography">Typography</option>
                    <option value="Solid Essentials">Solid Essentials</option>
                    <option value="Vintage Art">Vintage Art</option>
                    <option value="Abstract Print">Abstract Print</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Fit</label>
                  <select
                    value={editingProduct.fit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fit: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Oversized Fit">Oversized Fit</option>
                    <option value="Boxy Fit">Boxy Fit</option>
                    <option value="Regular Fit">Regular Fit</option>
                    <option value="Relaxed Fit">Relaxed Fit</option>
                    <option value="Slim Fit">Slim Fit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Design / Theme</label>
                  <select
                    value={editingProduct.theme}
                    onChange={(e) => setEditingProduct({ ...editingProduct, theme: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Street">Street</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Typography">Typography</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Anime">Anime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Badge</label>
                  <select
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="NEW DROP">NEW DROP</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="HOT">HOT</option>
                    <option value="">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    placeholder="50"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    placeholder="1299"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold uppercase mb-1">Material / Fabric</label>
                <input
                  type="text"
                  value={editingProduct.material}
                  onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                  placeholder="e.g. 100% Cotton (240 GSM)"
                  className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Image Preview & URL */}
              <div>
                <label className="block text-gray-400 font-semibold uppercase mb-1">Image URL / Path</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-14 rounded-lg bg-black border border-white/15 overflow-hidden flex-shrink-0">
                    <img
                      src={editingProduct.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/prod_minimal.jpg';
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="/images/prod_minimal.jpg"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProductOpen(false)}
                  className="w-1/3 bg-white/10 hover:bg-white/15 text-white py-3.5 rounded-full font-bold uppercase tracking-wider transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-white text-black hover:bg-gray-200 py-3.5 rounded-full font-bold uppercase tracking-wider transition-all shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
