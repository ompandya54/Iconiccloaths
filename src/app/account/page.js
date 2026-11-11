'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  LogOut,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Save,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/app/api/orderapi';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profilePostalCode, setProfilePostalCode] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileAddress(user.address?.address || '');
      setProfileCity(user.address?.city || '');
      setProfileState(user.address?.state || '');
      setProfilePostalCode(user.address?.postalCode || '');
    }
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    async function loadOrders() {
      if (isAuthenticated) {
        setLoadingOrders(true);
        try {
          const res = await getMyOrders();
          if (res && (res.success || Array.isArray(res.data) || Array.isArray(res))) {
            const list = res.data || (Array.isArray(res) ? res : []);
            setOrders(list);
          }
        } catch (e) {
          console.error('Failed to load user orders:', e);
        } finally {
          setLoadingOrders(false);
        }
      }
    }

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: '', type: '' });

    const res = await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      address: {
        address: profileAddress.trim(),
        city: profileCity.trim(),
        state: profileState.trim(),
        postalCode: profilePostalCode.trim(),
        country: 'India',
      },
    });

    setSavingProfile(false);

    if (res.success) {
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setProfileMsg({ text: '', type: '' }), 3500);
    } else {
      setProfileMsg({ text: res.message || 'Failed to update profile', type: 'error' });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header Profile Bar */}
        <div className="bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black text-white uppercase tracking-wider">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                {user?.name || 'Customer Profile'}
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 rounded-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-white/10 mb-8 pb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'orders'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-gray-400 hover:text-white bg-white/5'
              }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'profile'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-gray-400 hover:text-white bg-white/5'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Address</span>
          </button>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Retrieving your order history...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#0f0f13] border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider mb-2">
                  No orders yet
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  You haven't placed any orders yet. Discover our latest collection drops!
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center space-x-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusColors = {
                    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
                  };
                  const currentStatus = order.orderStatus || 'Processing';
                  const badgeClass = statusColors[currentStatus] || statusColors.Processing;

                  return (
                    <div
                      key={order._id}
                      className="bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl hover:border-white/20 transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-1">
                            ORDER REFERENCE
                          </span>
                          <span className="font-mono text-sm sm:text-base font-bold text-white">
                            #{order.orderNumber || order._id}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeClass}`}
                          >
                            {currentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Order Meta */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-400">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                            Date Placed
                          </span>
                          <span className="text-white font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                            Payment Mode
                          </span>
                          <span className="text-white font-medium">
                            {order.paymentMethod || 'Cash on Delivery'}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                            Shipping To
                          </span>
                          <span className="text-white font-medium truncate block max-w-[150px]">
                            {order.shippingAddress?.fullName || user?.name}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                            Total Amount
                          </span>
                          <span className="text-white font-bold text-sm">
                            ₹{order.totalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="pt-2 border-t border-white/5 space-y-3">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                          Ordered Items
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {order.orderItems?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-3 bg-white/5 border border-white/5 rounded-2xl p-3"
                            >
                              <div className="w-12 h-14 rounded-xl bg-black/40 overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <Package className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-xs">
                                <p className="font-bold text-white truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  Size: {item.size || 'M'} | Qty: {item.quantity}
                                </p>
                                <p className="text-xs font-semibold text-gray-200 mt-1">
                                  ₹{item.price * item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider mb-6">
              Saved Contact & Address Details
            </h2>

            {profileMsg.text && (
              <div
                className={`mb-6 p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Street Address, Flat / House
                </label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Street / Apartment / Building"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileState}
                    onChange={(e) => setProfileState(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={profilePostalCode}
                    onChange={(e) => setProfilePostalCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="mt-6 bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-8 py-3.5 rounded-full font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg hover:shadow-white/10"
              >
                {savingProfile ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

