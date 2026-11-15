'use client';

import { useState } from 'react';
import { X, Heart, ShoppingBag, Check } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const colorObj = (Array.isArray(product.colors) && product.colors[selectedColorIdx]) || product.colors?.[0] || {
    name: 'Standard',
    image: product.image || '/images/prod_minimal.jpg',
  };

  // Available Sizes
  const availableSizes = (() => {
    const list = [];
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      product.sizes.forEach((s) => { if (s && !list.includes(s)) list.push(s); });
    }
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      product.variants.forEach((v) => { if (v.size && !list.includes(v.size)) list.push(v.size); });
    }
    return list.length > 0 ? list : ['S', 'M', 'L', 'XL'];
  })();

  // Stock check for active color and selected size
  let currentStock = Number(product.stock) || 0;
  if (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0) {
    const cLower = (colorObj?.name || 'default').toLowerCase().trim();
    const sUpper = (selectedSize || '').toUpperCase().trim();
    const vMatch = product.variants.find((v) => {
      const vc = (v.color || 'default').toLowerCase().trim();
      const vs = (v.size || '').toUpperCase().trim();
      return vc === cLower && vs === sUpper;
    }) || product.variants.find((v) => {
      const vc = (v.color || '').toLowerCase().trim();
      const vs = (v.size || '').toUpperCase().trim();
      return (!vc || vc === 'default') && vs === sUpper;
    });
    currentStock = vMatch ? (Number(vMatch.stock) || 0) : 0;
  }
  const isOutOfStock = currentStock <= 0;

  const getIsSizeInStock = (size) => {
    if (!product.hasVariants || !Array.isArray(product.variants) || product.variants.length === 0) {
      return Number(product.stock) > 0;
    }
    const cLower = (colorObj?.name || 'default').toLowerCase().trim();
    const sUpper = (size || '').toUpperCase().trim();
    const match = product.variants.find((v) => {
      const vc = (v.color || 'default').toLowerCase().trim();
      const vs = (v.size || '').toUpperCase().trim();
      return (vc === cLower || vc === 'default') && vs === sUpper;
    });
    return match ? Number(match.stock) > 0 : false;
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart({ ...product, maxStock: currentStock }, colorObj.name, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div data-lenis-prevent className="relative z-10 w-full max-w-3xl bg-[#121216] border border-white/10 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white rounded-full bg-black/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="aspect-[3/4] bg-black/40 relative overflow-hidden">
          <img
            src={colorObj.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details & Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              ICONIC CLOTHS
            </span>
            <h3 className="font-display text-2xl font-extrabold text-white uppercase mt-1">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-white mt-2">
              {product.formattedPrice}
            </p>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Heavyweight 280 GSM luxury 100% comb cotton, oversized boxy streetwear cut, ribbed collar, double stitched seams.
            </p>

            {/* Colors */}
            <div className="mt-6">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Color: <span className="text-white">{colorObj.name}</span>
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIdx(i)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      selectedColorIdx === i
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121216] border-transparent scale-110'
                        : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Size: <span className="text-white">{selectedSize}</span>
              </label>
              <div className="flex items-center space-x-2">
                {availableSizes.map((size) => {
                  const inStock = getIsSizeInStock(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-lg text-xs font-bold transition-all border ${
                        !inStock
                          ? 'bg-neutral-950/40 text-neutral-600 border-white/5 cursor-not-allowed line-through opacity-30 select-none'
                          : selectedSize === size
                          ? 'bg-white text-black border-white cursor-pointer'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30 cursor-pointer'
                      }`}
                      title={!inStock ? `${size} is out of stock` : `Select ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
              isOutOfStock
                ? 'bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed opacity-60'
                : added
                ? 'bg-emerald-600 text-white cursor-pointer'
                : 'bg-white text-black hover:bg-gray-200 cursor-pointer'
            }`}
          >
            {isOutOfStock ? (
              <span>OUT OF STOCK</span>
            ) : added ? (
              <>
                <Check className="w-4 h-4" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG - {product.formattedPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
