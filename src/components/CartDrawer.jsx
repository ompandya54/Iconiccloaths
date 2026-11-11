'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer({
  isOpen: propIsOpen,
  onClose: propOnClose,
  cartItems: propCartItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemoveItem: propOnRemoveItem,
}) {
  let cartCtx = null;
  try {
    cartCtx = useCart();
  } catch (e) {
    // Graceful fallback if outside CartProvider
  }

  const router = useRouter();
  let authCtx = null;
  try {
    authCtx = useAuth();
  } catch (e) {
    // Graceful fallback
  }
  const { isAuthenticated } = authCtx || {};

  const isOpen = propIsOpen !== undefined ? propIsOpen : (cartCtx?.isCartOpen ?? false);
  const onClose = propOnClose || cartCtx?.closeCart;
  const cartItems = propCartItems || cartCtx?.cartItems || [];
  const onUpdateQuantity = propOnUpdateQuantity || cartCtx?.updateQuantity;
  const onRemoveItem = propOnRemoveItem || cartCtx?.removeFromCart;

  // Smooth slide-in (right to left) and slide-out (left to right) state
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsAnimating(true), 15);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCheckout = () => {
    if (onClose) onClose();
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  if (!isRendered) return null;

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const shippingFee = 99;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop with Fade In / Out */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out cursor-pointer ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel: Smooth Right-to-Left Slide In & Vice-Versa Slide Out */}
      <div
        className={`relative z-10 w-full max-w-md bg-[#0e0e12] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header & Items Container */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                CART ({totalQuantity})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg bg-white/5 cursor-pointer active:scale-95"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List */}
          <div className="py-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                <p className="text-sm text-gray-400">Your cart is currently empty.</p>
              </div>
            ) : (
              cartItems.map((item, i) => {
                const itemImg = (item.image || '/images/prod_minimal.jpg').replace(/^http:\/\//i, 'https://');
                return (
                  <div
                    key={`${item.id}-${item.selectedColor}-${item.size}-${i}`}
                    className="flex items-center space-x-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <img
                      src={itemImg}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/prod_minimal.jpg';
                      }}
                      className="w-16 h-20 object-cover rounded-lg bg-black border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        Color: {item.selectedColor} | Size: {item.size || 'L'}
                      </p>
                      <p className="text-xs font-bold text-white mt-1">
                        ₹{item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.selectedColor, item.size, item.quantity - 1)}
                          className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20 active:scale-95 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.selectedColor, item.size, item.quantity + 1)}
                          className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20 active:scale-95 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem && onRemoveItem(item.id, item.selectedColor, item.size)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white font-semibold">₹{shippingFee}</span>
              </div>
              <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-white/10">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full bg-white text-black hover:bg-gray-200 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-white/10 active:scale-95 cursor-pointer"
              >
                <span>{isAuthenticated ? 'PROCEED TO CHECKOUT' : 'SIGN IN & CHECKOUT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!isAuthenticated && (
                <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>Secure checkout — Login required to place order</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
