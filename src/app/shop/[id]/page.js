'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import QuickViewModal from '@/components/QuickViewModal';
import { getProductById, getProducts, getRelatedProducts } from '@/app/api/productapi';
import { useCart } from '@/context/CartContext';
import {
  Star,
  Heart,
  ShoppingBag,
  Ruler,
  ChevronRight,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  Info,
  ChevronDown
} from 'lucide-react';

export default function ProductDetailPage() {
  const { addToCart, openCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Related products & pagination (2 rows = 10 items initially on 5-column grid)
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(10);

  // User Selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  // Modals
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Fetch Product Data & Related Products from API
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);

        const prod = (data && data.success && (data.data || data.product))
          ? (data.data || data.product)
          : (data?._id ? data : null);

        if (prod) {
          setProduct(prod);

          // Set initial active color and image
          const normalizedColors = Array.isArray(prod.colors)
            ? prod.colors.map((c) =>
                typeof c === 'string'
                  ? { name: c, hex: '#0a0a0a', image: prod.image || '/images/prod_minimal.jpg' }
                  : c
              )
            : [];

          if (normalizedColors.length > 0) {
            setSelectedColor(normalizedColors[0]);
            setActiveImage(normalizedColors[0].image || prod.image || '/images/prod_minimal.jpg');
          } else {
            setActiveImage(prod.image || '/images/prod_minimal.jpg');
          }

          if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    }

    // Fetch related products based on same category, theme, and fit
    async function fetchRelated() {
      try {
        const relatedRes = await getRelatedProducts(productId, 30);
        let list = [];

        if (relatedRes?.success && Array.isArray(relatedRes.data)) {
          list = relatedRes.data.filter((p) => (p.id || p._id) !== productId);
        }

        // Fallback to general products if related is empty
        if (list.length === 0) {
          const generalRes = await getProducts({ limit: 30 });
          if (generalRes?.success && (generalRes.products || generalRes.data)) {
            list = (generalRes.products || generalRes.data).filter(
              (p) => (p.id || p._id) !== productId
            );
          }
        }

        setRelatedProducts(list);
        setVisibleRelatedCount(10); // 2 rows of 5 cards = 10 items
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    }

    fetchProduct();
    fetchRelated();
  }, [productId]);

  // Cart Add Handler
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedColor?.name, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans">
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-syne animate-pulse">
            Loading Garment Specs...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans">
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center">
          <Info className="w-10 h-10 text-neutral-600 mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-wider font-syne mb-2">Product Not Found</h2>
          <p className="text-neutral-400 text-xs mb-8">The requested streetwear piece could not be located in our current drop.</p>
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Gallery Images array (fallback to single image if array not present)
  const colorsList = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors.map((c) =>
        typeof c === 'string' ? { name: c, hex: '#0a0a0a', image: product.image } : c
      )
    : [];

  const rawImages = colorsList.map((c) => c?.image).filter(Boolean);
  if (product.image && !rawImages.includes(product.image)) {
    rawImages.unshift(product.image);
  }
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img && !rawImages.includes(img)) rawImages.push(img);
    });
  }
  const images = rawImages.length > 0 ? rawImages : [product.image || '/images/prod_minimal.jpg'];

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 15;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 w-full">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center text-[11px] text-neutral-400 tracking-wider mb-6 uppercase font-syne">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 text-neutral-600" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 text-neutral-600" />
          <span className="text-neutral-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* ======================================================== */}
        {/* PRODUCT MAIN DETAIL GRID (SLIMMER PROPORTIONAL GALLERY)  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start justify-center">
          
          {/* Left Column: Image Gallery (Narrower 5-cols & max 410px width) */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-2.5 w-full max-w-[380px] sm:max-w-[410px] mx-auto lg:mx-0">
            
            {/* Thumbnails Column */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[460px] scrollbar-none flex-shrink-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-12 sm:w-13 aspect-[3/4] flex-shrink-0 bg-neutral-900 border overflow-hidden transition-all duration-200 cursor-pointer ${
                      activeImage === imgUrl
                        ? 'border-white ring-1 ring-white'
                        : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => { e.currentTarget.src = '/images/prod_minimal.jpg'; }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image Container (Proportional max-height & restrained width) */}
            <div className="relative flex-1 aspect-[3/4] max-h-[460px] sm:max-h-[480px] bg-neutral-950 border border-white/10 overflow-hidden flex items-center justify-center group">
              <img
                src={activeImage || product.image || '/images/prod_minimal.jpg'}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = '/images/prod_minimal.jpg'; }}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />

              {/* Badge Tag */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                <span className="bg-white text-black font-syne font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 shadow-md">
                  {product.badge || 'BESTSELLER'}
                </span>
                {product.material && (
                  <span className="bg-neutral-950/85 backdrop-blur-xs text-neutral-300 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-white/10">
                    {product.material.includes('GSM') ? product.material.match(/\d+\s*GSM/i)?.[0] || '240 GSM' : '240 GSM'}
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all cursor-pointer"
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-300'}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Product Specs & Purchase Panel (Expanded 7-cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 max-w-xl">
            
            {/* Category & Title */}
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-neutral-400 font-syne mb-1.5">
                <span>{product.categoryLabel || product.category || 'Oversized Streetwear'}</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="font-bold text-white text-xs">{product.rating || 4.9}</span>
                  <span className="text-neutral-500 text-[10px]">(142)</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-syne uppercase tracking-tight text-white leading-tight mb-2">
                {product.name}
              </h1>

              <p className="text-xs text-neutral-400 font-light tracking-wide leading-relaxed line-clamp-3">
                {product.description || 'Crafted from luxury heavyweight organic terry cotton. Ultra-relaxed oversized silhouette designed for modern streetwear enthusiasts.'}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 pb-4 border-b border-white/10">
              <span className="text-2xl font-bold font-mono text-white">
                {product.formattedPrice || `₹ ${product.price}`}
              </span>
              {(product.originalPrice || product.price) && (
                <span className="text-xs font-mono text-neutral-500 line-through">
                  ₹ {product.originalPrice || Math.round(product.price * 1.35)}
                </span>
              )}
              <span className="text-[10px] font-bold font-syne tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 uppercase">
                {discountPercent}% OFF
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest ml-auto">
                Taxes included
              </span>
            </div>

            {/* Color Swatches Selection */}
            {colorsList.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-2">
                  <span className="text-neutral-400 text-[11px]">
                    Color: <strong className="text-white font-semibold">{selectedColor?.name || (typeof selectedColor === 'string' ? selectedColor : 'Default')}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {colorsList.map((colorObj, idx) => {
                    const cName = colorObj.name || (typeof colorObj === 'string' ? colorObj : `Color ${idx + 1}`);
                    const cHex = colorObj.hex || '#0a0a0a';
                    const isSelected = (selectedColor?.name === cName) || (selectedColor === colorObj);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedColor(colorObj);
                          if (colorObj.image) setActiveImage(colorObj.image);
                        }}
                        className={`relative w-7 h-7 rounded-full border-2 transition-all p-0.5 cursor-pointer ${
                          isSelected ? 'border-white scale-110 ring-2 ring-white/30' : 'border-white/20 hover:border-white/60'
                        }`}
                        title={cName}
                      >
                        <span
                          className="block w-full h-full rounded-full border border-black/20"
                          style={{ backgroundColor: cHex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-2">
                <span className="text-neutral-400 text-[11px]">
                  Select Size: <strong className="text-white font-semibold">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white font-syne uppercase tracking-wider underline underline-offset-4 cursor-pointer"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border cursor-pointer ${
                      selectedSize === size
                        ? 'bg-white text-black border-white font-black shadow-sm'
                        : 'bg-neutral-950 text-neutral-300 border-white/15 hover:border-white/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Counter & Add To Cart (Compact Single Row / Stack) */}
            <div className="pt-2 flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center h-11 w-28 bg-neutral-950 border border-white/20 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 h-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="flex-1 text-center font-mono font-bold text-xs text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 h-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Primary Add To Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-11 text-xs font-bold uppercase tracking-[0.15em] font-syne transition-all flex items-center justify-center gap-2 border cursor-pointer active:scale-98 ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white text-black border-white hover:bg-neutral-200'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added To Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add To Bag
                  </>
                )}
              </button>
            </div>

            {/* Product Accordion / Spec Tabs (Compact) */}
            <div className="pt-4 border-t border-white/10 text-xs">
              <div className="flex border-b border-white/10 gap-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 font-syne font-bold uppercase tracking-wider text-[11px] transition-colors relative cursor-pointer ${
                    activeTab === 'specs' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Fabric & Specs
                  {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 font-syne font-bold uppercase tracking-wider text-[11px] transition-colors relative cursor-pointer ${
                    activeTab === 'care' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Wash & Care
                  {activeTab === 'care' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2.5 font-syne font-bold uppercase tracking-wider text-[11px] transition-colors relative cursor-pointer ${
                    activeTab === 'shipping' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Delivery Info
                  {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </button>
              </div>

              <div className="py-3 text-neutral-400 space-y-1.5 leading-relaxed">
                {activeTab === 'specs' && (
                  <ul className="space-y-1 list-disc list-inside text-neutral-300 text-xs font-light">
                    <li>Fabric: {product.material || '100% Super Combed Organic French Terry Cotton (240 GSM)'}</li>
                    <li>Fit: {product.fit || 'Oversized Drop Shoulder Boxy Cut'}</li>
                    {product.subcategory && <li>Category: {product.subcategory}</li>}
                    {product.theme && <li>Design / Aesthetic: {product.theme}</li>}
                    <li>Print: High-Density Screen Print / Puff Print</li>
                    <li>Neckline: Ribbed High-Neck Collar</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul className="space-y-1 list-disc list-inside text-neutral-300 text-xs font-light">
                    <li>Machine wash cold with like colors inside out</li>
                    <li>Do not bleach or tumble dry high heat</li>
                    <li>Warm iron inside out (avoid direct iron on prints)</li>
                    <li>Dry flat in shade for longest fabric longevity</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-1 text-xs font-light text-neutral-300">
                    <p>Dispatched within 24-48 business hours.</p>
                    <p>Estimated Metro Delivery: 3 - 4 Days.</p>
                    <p>Rest of India: 4 - 6 Days.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* COMPACT RELATED PRODUCTS / SUGGESTIONS SECTION (4-5/ROW) */}
        {/* ======================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-white/10">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold font-syne uppercase tracking-widest text-neutral-400 block mb-1">
                  CURATED RECOMMENDATIONS
                </span>
                <h2 className="text-lg sm:text-xl font-black font-syne uppercase tracking-wider text-white">
                  COMPLETE THE LOOK
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-[11px] font-bold font-syne uppercase tracking-wider text-neutral-400 hover:text-white underline underline-offset-4"
              >
                View Full Shop &rarr;
              </Link>
            </div>

            {/* Compact 4 to 5 Products Per Row Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.slice(0, visibleRelatedCount).map((relProd, idx) => (
                <Link
                  key={relProd.id || relProd._id || idx}
                  href={`/shop/${relProd.id || relProd._id}`}
                  className="group flex flex-col bg-neutral-950/80 border border-white/10 hover:border-white/30 transition-all p-2.5 rounded-none"
                >
                  <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-2.5">
                    <img
                      src={relProd.image || relProd.colors?.[0]?.image || '/images/prod_minimal.jpg'}
                      alt={relProd.name}
                      onError={(e) => { e.currentTarget.src = '/images/prod_minimal.jpg'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-white text-black font-syne text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                      {relProd.badge || 'HOT'}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                    {relProd.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-neutral-400 font-mono font-bold">
                      {relProd.formattedPrice || `₹ ${relProd.price}`}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 truncate max-w-[70px]">
                      {relProd.category || relProd.fit || 'Streetwear'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* "Show More" Button for Progressive 2-Row Pagination */}
            {visibleRelatedCount < relatedProducts.length && (
              <div className="mt-8 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleRelatedCount((prev) => prev + 10)}
                  className="px-7 py-2.5 bg-neutral-950 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-black flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Show More Recommendations</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-neutral-500 font-mono">
                  Showing {Math.min(visibleRelatedCount, relatedProducts.length)} of {relatedProducts.length} pieces
                </span>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-white/20 p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs"
            >
              ✕
            </button>
            <h3 className="text-base font-bold font-syne uppercase tracking-wider mb-2 text-white flex items-center gap-2">
              <Ruler className="w-4 h-4" /> Heavyweight Oversized Fit Chart
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              All measurements are in inches. Designed with an intentional boxy drop-shoulder cut.
            </p>

            <table className="w-full text-xs text-left text-neutral-300 border-collapse">
              <thead>
                <tr className="border-b border-white/20 font-syne uppercase text-neutral-400 text-[10px] tracking-widest">
                  <th className="py-2.5 px-2">Size</th>
                  <th className="py-2.5 px-2">Chest (Inches)</th>
                  <th className="py-2.5 px-2">Length (Inches)</th>
                  <th className="py-2.5 px-2">Shoulder (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                <tr><td className="py-2.5 px-2 font-bold text-white">S</td><td className="py-2.5 px-2">42"</td><td className="py-2.5 px-2">28"</td><td className="py-2.5 px-2">21"</td></tr>
                <tr><td className="py-2.5 px-2 font-bold text-white">M</td><td className="py-2.5 px-2">44"</td><td className="py-2.5 px-2">29"</td><td className="py-2.5 px-2">22"</td></tr>
                <tr><td className="py-2.5 px-2 font-bold text-white">L</td><td className="py-2.5 px-2">46"</td><td className="py-2.5 px-2">30"</td><td className="py-2.5 px-2">23"</td></tr>
                <tr><td className="py-2.5 px-2 font-bold text-white">XL</td><td className="py-2.5 px-2">48"</td><td className="py-2.5 px-2">31"</td><td className="py-2.5 px-2">24"</td></tr>
                <tr><td className="py-2.5 px-2 font-bold text-white">XXL</td><td className="py-2.5 px-2">50"</td><td className="py-2.5 px-2">32"</td><td className="py-2.5 px-2">25"</td></tr>
              </tbody>
            </table>

            <button
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              className="mt-6 w-full py-2.5 bg-white text-black font-syne text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
