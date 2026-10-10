'use client';

import { useState } from 'react';
import { X, Heart, ShoppingBag, Check } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const colorObj = product.colors[selectedColorIdx] || product.colors[0];

  const handleAdd = () => {
    onAddToCart(product, colorObj.name, selectedSize);
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
      <div className="relative z-10 w-full max-w-3xl bg-[#121216] border border-white/10 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
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
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {added ? (
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
