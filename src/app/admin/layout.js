'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  SlidersHorizontal,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const AdminContext = createContext(null);

export function useAdmin() {
  return useContext(AdminContext);
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Global toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('iconic_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data && (data.authenticated || data.success)) {
            setIsAuthenticated(true);
            setAdminUser(data.admin || { name: 'Admin', email: 'admin@iconic.com' });
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

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('iconic_admin_token', data.token);
        setIsAuthenticated(true);
        setAdminUser(data.user || { name: 'Admin', email: loginUsername });
        showToast('Welcome back, Admin!', 'success');
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
    setAdminUser(null);
    setLoginUsername('');
    setLoginPassword('');
    router.push('/admin');
  };

  // Navigation Items
  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      isActive: pathname === '/admin',
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
      isActive: pathname.startsWith('/admin/products'),
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/admin/orders'),
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: Layers,
      isActive: pathname.startsWith('/admin/categories'),
    },
    {
      label: 'Attributes',
      href: '/admin/attributes',
      icon: Tag,
      isActive: pathname.startsWith('/admin/attributes'),
    },
  ];

  // Auth Loading Spinner
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

  // Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-serif font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
              IC
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-slate-900 leading-none uppercase">
                ICONIC
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-blue-600 uppercase mt-0.5">
                CONTROL PANEL
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </Link>
        </div>

        {/* Login Card */}
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
                Sign in to manage catalog, orders, and customer operations.
              </p>
            </div>

            {loginError && (
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

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
                    placeholder="Enter password"
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

            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <p className="text-[11px] text-slate-500">
                Demo: <span className="text-slate-800 font-bold">admin</span> / <span className="text-slate-800 font-bold">admin123</span>
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

        <div className="text-center text-[11px] text-slate-400 relative z-10">
          © {new Date().getFullYear()} ICONIC CLOTHS. Enterprise Cloud Architecture.
        </div>
      </div>
    );
  }

  // Authenticated Admin Shell Layout (White & Blue)
  return (
    <AdminContext.Provider value={{ isAuthenticated, adminUser, showToast, handleLogout }}>
      <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans overflow-hidden relative">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold uppercase tracking-wider animate-fadeIn ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        )}

        {/* Persistent White & Blue Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
          } w-full bg-white border-r border-slate-200 p-4 md:p-6 flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-30 shadow-sm`}
        >
          <div className="space-y-6 md:space-y-8">
            {/* Header Brand */}
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center space-x-2.5 group">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-serif font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                  IC
                </span>
                {!isSidebarCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold tracking-[0.2em] text-slate-900 leading-none uppercase">
                      ICONIC
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.3em] text-blue-600 uppercase mt-0.5">
                      ADMIN PANEL
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

            {/* Modular Navigation Links */}
            <nav className="space-y-1 text-xs font-bold uppercase tracking-wider">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3.5'
                    } py-2.5 rounded-xl transition-all ${
                      item.isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              href="/"
              target="_blank"
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'
              } text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors py-2 rounded-xl`}
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>View Store Live</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'
              } text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors py-2 rounded-xl border border-rose-100`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Dynamic Nested Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50 relative">
          {children}
        </main>
      </div>
    </AdminContext.Provider>
  );
}

