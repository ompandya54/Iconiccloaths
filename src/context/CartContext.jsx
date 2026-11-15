'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Load initial cart from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('iconic_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to parse iconic_cart from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Sync to localStorage whenever cartItems changes (after initial hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('iconic_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Failed to save iconic_cart to localStorage:', err);
    }
  }, [cartItems, isHydrated]);

  // Add Item to Cart
  const addToCart = (product, selectedColor, size = 'L', quantity = 1) => {
    const id = product.id || product._id;
    const colorObj = product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0] || {
      name: selectedColor || 'Standard',
      image: product.image,
    };

    const colorName = selectedColor || colorObj.name || 'Standard';
    const rawImage = colorObj?.image || product.image || product.images?.[0] || '/images/prod_minimal.jpg';
    const itemImage = typeof rawImage === 'string' ? rawImage.replace(/^http:\/\//i, 'https://') : '/images/prod_minimal.jpg';
    const itemPrice = Number(product.price) || 0;

    // Determine available stock for this variant/product
    let availableStock = Number(product.stock) || 0;
    if (product.maxStock !== undefined && product.maxStock !== null) {
      availableStock = Number(product.maxStock);
    } else if (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0) {
      const cLower = (colorName || 'default').toLowerCase().trim();
      const sUpper = (size || '').toUpperCase().trim();
      const vMatch = product.variants.find((v) => {
        const vc = (v.color || 'default').toLowerCase().trim();
        const vs = (v.size || '').toUpperCase().trim();
        return vc === cLower && vs === sUpper;
      }) || product.variants.find((v) => {
        const vc = (v.color || '').toLowerCase().trim();
        const vs = (v.size || '').toUpperCase().trim();
        return (!vc || vc === 'default') && vs === sUpper;
      });

      availableStock = vMatch ? (Number(vMatch.stock) || 0) : 0;
    }

    // If out of stock, reject adding to cart
    if (availableStock <= 0) {
      console.warn(`Cannot add ${product.name} (${colorName}, ${size}) to cart: Out of stock`);
      return false;
    }

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === id && item.selectedColor === colorName && item.size === size
      );

      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].quantity || 0;
        const maxStock = prev[existingIdx].maxStock !== undefined ? prev[existingIdx].maxStock : availableStock;
        
        // Cannot exceed available stock
        if (currentQty >= maxStock) {
          return prev;
        }

        const updated = [...prev];
        updated[existingIdx].quantity = Math.min(maxStock, currentQty + quantity);
        updated[existingIdx].maxStock = maxStock;
        return updated;
      }

      const clampedQty = Math.min(availableStock, Math.max(1, quantity));
      return [
        ...prev,
        {
          id,
          name: product.name,
          price: itemPrice,
          selectedColor: colorName,
          size: size,
          quantity: clampedQty,
          maxStock: availableStock,
          image: itemImage,
        },
      ];
    });

    // Auto-open drawer for feedback
    setIsCartOpen(true);
    return true;
  };

  // Update Item Quantity
  const updateQuantity = (id, selectedColor, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedColor, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        const isMatch =
          item.id === id &&
          item.selectedColor === selectedColor &&
          (!size || item.size === size);
        if (!isMatch) return item;

        const maxStock = item.maxStock !== undefined ? Number(item.maxStock) : Infinity;
        const clampedQty = Math.min(newQty, maxStock);
        return { ...item, quantity: clampedQty };
      })
    );
  };

  // Remove Item from Cart
  const removeFromCart = (id, selectedColor, size) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        const isMatch =
          item.id === id &&
          item.selectedColor === selectedColor &&
          (!size || item.size === size);
        return !isMatch;
      })
    );
  };

  // Clear Entire Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Drawer Controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Derived Totals
  const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        isSearchOpen,
        setIsSearchOpen,
        openSearch,
        closeSearch,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;

