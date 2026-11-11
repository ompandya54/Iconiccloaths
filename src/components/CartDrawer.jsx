'use client';

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

  const handleCheckout = () => {
    if (onClose) onClose();
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#0e0e12] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                YOUR BAG ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="py-4 border-b border-white/10">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
              <span>
                {subtotal >= freeShippingThreshold
                  ? '🎉 You unlocked FREE SHIPPING!'
                  : `Add ₹${freeShippingThreshold - subtotal} more for FREE shipping`}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                <p className="text-sm text-gray-400">Your shopping bag is currently empty.</p>
              </div>
            ) : (
              cartItems.map((item, i) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${i}`}
                  className="flex items-center space-x-4 bg-white/5 p-3 rounded-xl border border-white/5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg bg-black"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Color: {item.selectedColor} | Size: {item.size || 'L'}
                    </p>
                    <p className="text-xs font-bold text-white mt-1">
                      ₹{item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.selectedColor, item.size, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.selectedColor, item.size, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem && onRemoveItem(item.id, item.selectedColor, item.size)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
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
                <span className="text-white font-semibold">
                  {subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-white/10">
                <span>Total</span>
                <span>₹{subtotal + (subtotal >= freeShippingThreshold ? 0 : 99)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-white text-black hover:bg-gray-200 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-white/10"
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
