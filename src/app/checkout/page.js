'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ChevronLeft,
  Package,
  MapPin,
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/app/api/orderapi';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cartItems, cartSubtotal, clearCart } = useCart();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'Cash on Delivery',
  });

  // Pre-fill user profile info when loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address?.address || prev.address,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        postalCode: user.address?.postalCode || prev.postalCode,
        country: user.address?.country || 'India',
      }));
    }
  }, [user]);

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Pricing
  const freeShippingThreshold = 2000;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 99;
  const finalTotal = cartSubtotal + shippingFee;

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError('');

    if (cartItems.length === 0) {
      setOrderError('Your cart is empty');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      setOrderError('Please complete all required shipping address fields');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.id || item._id,
          name: item.name || item.title,
          image: item.image || item.images?.[0] || '/placeholder.png',
          price: Number(item.price) || 0,
          size: item.size || 'M',
          color: item.selectedColor || item.color || 'Standard',
          quantity: Number(item.quantity) || 1,
        })),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim() || user?.email || '',
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || 'N/A',
          postalCode: formData.postalCode.trim(),
          country: formData.country || 'India',
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: cartSubtotal,
        shippingPrice: shippingFee,
        taxPrice: 0,
        totalPrice: finalTotal,
      };

      const res = await createOrder(orderPayload);

      if (res && (res.success || res.data?._id || res.orderNumber)) {
        const orderData = res.data || res;
        setCompletedOrder(orderData);
        clearCart();
      } else {
        setOrderError(res?.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setOrderError(err.message || 'Server error while creating order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading state during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // ORDER SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full bg-[#0f0f13]/90 border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400 block mb-2 font-mono">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-wider mb-3">
            Thank you for your order
          </h1>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Your streetwear piece is being curated with care. We have registered your order under #{' '}
            <span className="text-white font-mono font-bold">
              {completedOrder.orderNumber || completedOrder._id}
            </span>.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left text-xs mb-8 space-y-2.5">
            <div className="flex justify-between text-gray-400">
              <span>Payment Mode</span>
              <span className="text-white font-semibold">{formData.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Estimated Delivery</span>
              <span className="text-white font-semibold">3 - 5 Business Days</span>
            </div>
            <div className="flex justify-between text-gray-400 pt-2 border-t border-white/10">
              <span>Deliver To</span>
              <span className="text-white font-semibold text-right truncate max-w-[220px]">
                {formData.fullName}, {formData.city}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 bg-white text-black hover:bg-gray-200 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>View My Orders</span>
            </Link>
            <Link
              href="/shop"
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white pt-36 pb-20 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-gray-400 max-w-sm mb-8">
          Explore our latest collection drops and find your next statement piece before checking out.
        </p>
        <Link
          href="/shop"
          className="bg-white text-black hover:bg-gray-200 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb */}
        <div className="mb-8 flex items-center space-x-2 text-xs text-gray-400">
          <Link href="/shop" className="hover:text-white transition-colors flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Shop
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Column: Checkout & Shipping Form */}
          <div className="w-full lg:w-7/12 space-y-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                Checkout
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Ordering as <span className="text-white font-semibold">{user?.email}</span>
              </p>
            </div>

            {orderError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Receiver's full name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Street Address, Flat / House No. *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="E.g. Flat 402, Skyline Residency, MG Road"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="400001"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                    Select Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'Cash on Delivery'
                        ? 'border-white bg-white/10 shadow-lg shadow-white/5'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={handleChange}
                        className="accent-white w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Pay upon parcel delivery at your doorstep
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-gray-400" />
                  </label>

                  {/* Online Payment */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'Online'
                        ? 'border-white bg-white/10 shadow-lg shadow-white/5'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={formData.paymentMethod === 'Online'}
                        onChange={handleChange}
                        className="accent-white w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">
                          Online UPI / Cards / NetBanking
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Instant, encrypted digital checkout
                        </p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="w-full lg:w-5/12 bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Order Summary ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
              </h2>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                SECURE
              </span>
            </div>

            {/* Cart Items List */}
            <div className="max-h-72 overflow-y-auto space-y-4 pr-1 divide-y divide-white/5">
              {cartItems.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center space-x-3">
                  <div className="w-14 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Size: {item.size || 'M'} | Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-semibold text-white mt-1">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Shipping</span>
                <span className="text-white font-semibold">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-white font-bold pt-3 border-t border-white/10">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={placingOrder}
              className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xl shadow-white/10"
            >
              {placingOrder ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>CONFIRM & PLACE ORDER (₹{finalTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Orders are processed with high-standard buyer protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

