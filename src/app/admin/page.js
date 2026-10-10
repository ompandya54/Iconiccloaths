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
  DollarSign
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'oversized',
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
        setNewProduct({ name: '', category: 'oversized', price: '', badge: 'NEW DROP', image: '/images/prod_minimal.jpg' });
      }
    } catch (err) {
      alert('Error creating product');
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
        setProductsList(productsList.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

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
    <div className="min-h-screen bg-[#060608] text-white flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0e] border-r border-white/10 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          {/* Admin Header Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-serif text-xl font-bold tracking-[0.25em] text-white uppercase leading-none">
              ICONIC
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[0.45em] text-gray-400 uppercase mt-1">
              ADMIN CONTROL
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({productsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({ordersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <h1 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
              {activeTab === 'dashboard' && 'SYSTEM OVERVIEW'}
              {activeTab === 'products' && 'PRODUCT CATALOG MANAGEMENT'}
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

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 pt-8">
            
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

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 pt-8">
            <div className="flex items-center space-x-3 bg-[#0e0e12] border border-white/10 px-4 py-2.5 rounded-full max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
              />
            </div>

            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                      <th className="p-4">Image</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {productsList
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-white/[0.02]">
                          <td className="p-4">
                            <img
                              src={product.colors?.[0]?.image || '/images/prod_minimal.jpg'}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded-lg bg-black border border-white/10"
                            />
                          </td>
                          <td className="p-4 font-bold text-white">{product.name}</td>
                          <td className="p-4 text-gray-400 uppercase text-[11px]">{product.category}</td>
                          <td className="p-4 font-bold text-white">{product.formattedPrice}</td>
                          <td className="p-4">
                            {product.badge && (
                              <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-white rounded text-[10px] font-bold">
                                {product.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 pt-8">
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

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 pt-8">
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

      </main>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddProductOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative z-10 w-full max-w-md bg-[#121218] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-white">ADD NEW STREETWEAR DROP</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-white"
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
                  className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none"
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
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-full font-bold uppercase tracking-wider transition-all pt-3"
              >
                CREATE PRODUCT DROP
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
