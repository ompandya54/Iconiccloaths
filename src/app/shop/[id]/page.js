'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  ChevronRight,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  Sparkles,
  Share2,
  Info
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  // User Selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Fetch Product Data from API
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (data.success && data.product) {
          const prod = data.product;
          setProduct(prod);

          // Set initial active color and image
          if (prod.colors && prod.colors.length > 0) {
            setSelectedColor(prod.colors[0]);
            setActiveImage(prod.colors[0].image || prod.image || '/images/prod_minimal.jpg');
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

    // Fetch related products
    async function fetchRelated() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          const filtered = data.products
            .filter((p) => (p.id || p._id) !== productId)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
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

    const cartItem = {
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: activeImage || product.image || '/images/prod_minimal.jpg',
      size: selectedSize,
      color: selectedColor?.name || 'Default',
      quantity: quantity
    };

    // Store in localStorage cart
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = existingCart.findIndex(
        (item) => item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color
      );

      if (existingIndex > -1) {
        existingCart[existingIndex].quantity += cartItem.quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Trigger cart event for navbar/drawer update
      window.dispatchEvent(new Event('cartUpdated'));

      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
      setIsCartOpen(true);
    } catch (err) {
      console.error('Failed to save to cart', err);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect to checkout or open cart drawer directly
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-syne animate-pulse">Loading Heavyweight Specs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center">
          <Info className="w-12 h-12 text-neutral-600 mb-4" />
          <h2 className="text-2xl font-bold uppercase tracking-wider font-syne mb-2">Product Not Found</h2>
          <p className="text-neutral-400 text-xs mb-8">The requested streetwear piece could not be located in our current drop.</p>
          <Link
            href="/shop"
            className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Gallery Images array (fallback to single image if array not present)
  const images = product.colors && product.colors.length > 0
    ? product.colors.map(c => c.image).filter(Boolean)
    : [product.image || '/images/prod_minimal.jpg'];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 15;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        {/* Breadcrumb Bar */}
        <div className="flex items-center text-xs text-neutral-400 tracking-wider mb-8 uppercase font-syne">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-neutral-600" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-neutral-600" />
          <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>

        {/* Product Main Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnails Column */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] scrollbar-none">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-16 md:w-20 aspect-[3/4] flex-shrink-0 bg-neutral-900 border overflow-hidden transition-all duration-300 ${
                      activeImage === imgUrl ? 'border-white ring-1 ring-white' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image Container */}
            <div className="relative flex-1 aspect-[3/4] bg-neutral-950 border border-white/10 overflow-hidden group">
              <Image
                src={activeImage || product.image || '/images/prod_minimal.jpg'}
                alt={product.name}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badge Tag */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-white text-black font-syne font-extrabold text-2xs uppercase tracking-widest px-3 py-1 shadow-lg">
                  {product.badge || 'BESTSELLER'}
                </span>
                <span className="bg-neutral-950/80 backdrop-blur-md text-neutral-300 font-mono text-3xs uppercase tracking-widest px-2.5 py-1 border border-white/10">
                  240 GSM Heavyweight
                </span>
              </div>

              {/* Top Right Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all"
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-300'}`} />
              </button>
            </div>

          </div>

          {/* Right Column: Product Info & Purchase Form (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Title & Category */}
            <div>
              <div className="flex items-center justify-between text-2xs uppercase tracking-[0.2em] text-neutral-400 font-syne mb-2">
                <span>{product.categoryLabel || product.category || 'Oversized Streetwear'}</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-white text-xs">{product.rating || 4.9}</span>
                  <span className="text-neutral-500 text-2xs">(142 reviews)</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-syne uppercase tracking-tight text-white leading-tight mb-2">
                {product.name}
              </h1>

              <p className="text-xs text-neutral-400 font-light tracking-wide leading-relaxed">
                {product.description || 'Crafted from luxury 240 GSM organic terry cotton. Ultra-relaxed oversized silhouette designed for modern streetwear enthusiasts.'}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-white/10">
              <span className="text-3xl font-extrabold font-mono text-white">
                {product.formattedPrice || `₹ ${product.price}`}
              </span>
              {(product.originalPrice || product.price) && (
                <span className="text-sm font-mono text-neutral-500 line-through">
                  ₹ {product.originalPrice || Math.round(product.price * 1.35)}
                </span>
              )}
              <span className="text-2xs font-bold font-syne tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 uppercase">
                {discountPercent}% OFF
              </span>
              <span className="text-3xs text-neutral-500 uppercase tracking-widest block ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Color Swatches Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-3">
                  <span className="text-neutral-400">Color: <strong className="text-white font-semibold">{selectedColor?.name}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((colorObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedColor(colorObj);
                        if (colorObj.image) setActiveImage(colorObj.image);
                      }}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor?.name === colorObj.name ? 'border-white scale-110 ring-2 ring-white/30' : 'border-white/20 hover:border-white/60'
                      }`}
                      title={colorObj.name}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-black/20"
                        style={{ backgroundColor: colorObj.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-3">
                <span className="text-neutral-400">Select Fit Size: <strong className="text-white font-semibold">{selectedSize}</strong></span>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="flex items-center gap-1 text-2xs text-neutral-300 hover:text-white font-syne uppercase tracking-wider underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-mono font-bold tracking-widest uppercase transition-all border ${
                      selectedSize === size
                        ? 'bg-white text-black border-white font-extrabold shadow-lg shadow-white/10'
                        : 'bg-neutral-950 text-neutral-300 border-white/15 hover:border-white/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-3xs text-neutral-500 mt-2 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> True to Size Oversized Silhouette. Recommend ordering your standard size for relaxed streetwear drape.
              </p>
            </div>

            {/* Quantity Counter */}
            <div>
              <span className="block text-2xs text-neutral-400 uppercase tracking-widest mb-2 font-syne">Quantity</span>
              <div className="flex items-center w-36 bg-neutral-950 border border-white/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-neutral-400 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-mono font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-neutral-400 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] font-syne transition-all flex items-center justify-center gap-3 border ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white text-black border-white hover:bg-neutral-200'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added To Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add To Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-neutral-950 border border-white/30 text-white text-xs font-bold uppercase tracking-[0.2em] font-syne hover:border-white transition-all flex items-center justify-center gap-3"
              >
                <Zap className="w-4 h-4 fill-white text-white" /> Buy It Now (Express Checkout)
              </button>
            </div>

            {/* Trust Features Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-center">
              <div className="p-3 bg-neutral-950/60 border border-white/5 flex flex-col items-center">
                <Truck className="w-5 h-5 text-neutral-400 mb-1.5" />
                <span className="text-3xs font-bold uppercase tracking-wider text-neutral-200">Free Express Shipping</span>
                <span className="text-[9px] text-neutral-500">On orders over ₹999</span>
              </div>
              <div className="p-3 bg-neutral-950/60 border border-white/5 flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-neutral-400 mb-1.5" />
                <span className="text-3xs font-bold uppercase tracking-wider text-neutral-200">7 Days Easy Return</span>
                <span className="text-[9px] text-neutral-500">Hassle free replacement</span>
              </div>
              <div className="p-3 bg-neutral-950/60 border border-white/5 flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-neutral-400 mb-1.5" />
                <span className="text-3xs font-bold uppercase tracking-wider text-neutral-200">COD Available</span>
                <span className="text-[9px] text-neutral-500">Pay on delivery</span>
              </div>
            </div>

            {/* Product Accordion / Spec Tabs */}
            <div className="pt-6 border-t border-white/10 text-xs">
              <div className="flex border-b border-white/10 gap-6">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 font-syne font-bold uppercase tracking-widest text-2xs transition-colors relative ${
                    activeTab === 'specs' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Fabric & Specs
                  {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>}
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-3 font-syne font-bold uppercase tracking-widest text-2xs transition-colors relative ${
                    activeTab === 'care' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Wash & Care
                  {activeTab === 'care' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>}
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 font-syne font-bold uppercase tracking-widest text-2xs transition-colors relative ${
                    activeTab === 'shipping' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Delivery Info
                  {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>}
                </button>
              </div>

              <div className="py-4 text-neutral-400 space-y-2 leading-relaxed">
                {activeTab === 'specs' && (
                  <ul className="space-y-1.5 list-disc list-inside text-neutral-300 text-xs font-light">
                    <li>Fabric: {product.material || '100% Super Combed Organic French Terry Cotton (240 GSM)'}</li>
                    <li>Fit: {product.fit || 'Oversized Drop Shoulder Boxy Cut'}</li>
                    {product.subcategory && <li>Style / Category: {product.subcategory}</li>}
                    {product.theme && <li>Design / Aesthetic: {product.theme}</li>}
                    <li>Print: Premium High-Density Screen Print / Puff Print</li>
                    <li>Neckline: Ribbed High-Neck Collar</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul className="space-y-1.5 list-disc list-inside text-neutral-300 text-xs font-light">
                    <li>Machine wash cold with like colors inside out</li>
                    <li>Do not bleach or tumble dry high heat</li>
                    <li>Warm iron inside out if needed (do not iron directly on print)</li>
                    <li>Dry flat in shade for longest fabric longevity</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2 text-xs font-light">
                    <p>Orders dispatched within 24-48 business hours.</p>
                    <p>Estimated Metro Delivery: 3 - 4 Days.</p>
                    <p>Rest of India: 4 - 6 Days.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-syne uppercase tracking-wider text-white">
                  COMPLETE THE LOOK
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-1">Recommended pieces matching this style aesthetics</p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold font-syne uppercase tracking-widest text-neutral-300 hover:text-white underline underline-offset-4"
              >
                View Full Shop &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd, idx) => (
                <Link
                  key={relProd.id || relProd._id || idx}
                  href={`/shop/${relProd.id || relProd._id}`}
                  className="group flex flex-col bg-neutral-950 border border-white/10 hover:border-white/30 transition-all p-3"
                >
                  <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-3">
                    <Image
                      src={relProd.image || relProd.colors?.[0]?.image || '/images/prod_minimal.jpg'}
                      alt={relProd.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-white text-black font-syne text-3xs font-extrabold px-2 py-0.5 uppercase">
                      {relProd.badge || 'HOT'}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                    {relProd.name}
                  </h3>
                  <p className="text-2xs text-neutral-400 font-mono mt-1">
                    {relProd.formattedPrice || `₹ ${relProd.price}`}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-white/20 p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold font-syne uppercase tracking-wider mb-2 text-white flex items-center gap-2">
              <Ruler className="w-5 h-5" /> Heavyweight Oversized Fit Chart
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              All measurements are in inches. Designed with an intentional boxy drop-shoulder cut.
            </p>

            <table className="w-full text-xs text-left text-neutral-300 border-collapse">
              <thead>
                <tr className="border-b border-white/20 font-syne uppercase text-neutral-400 text-3xs tracking-widest">
                  <th className="py-3 px-2">Size</th>
                  <th className="py-3 px-2">Chest (Inches)</th>
                  <th className="py-3 px-2">Length (Inches)</th>
                  <th className="py-3 px-2">Shoulder (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                <tr><td className="py-3 px-2 font-bold text-white">S</td><td className="py-3 px-2">42"</td><td className="py-3 px-2">28"</td><td className="py-3 px-2">21"</td></tr>
                <tr><td className="py-3 px-2 font-bold text-white">M</td><td className="py-3 px-2">44"</td><td className="py-3 px-2">29"</td><td className="py-3 px-2">22"</td></tr>
                <tr><td className="py-3 px-2 font-bold text-white">L</td><td className="py-3 px-2">46"</td><td className="py-3 px-2">30"</td><td className="py-3 px-2">23"</td></tr>
                <tr><td className="py-3 px-2 font-bold text-white">XL</td><td className="py-3 px-2">48"</td><td className="py-3 px-2">31"</td><td className="py-3 px-2">24"</td></tr>
                <tr><td className="py-3 px-2 font-bold text-white">XXL</td><td className="py-3 px-2">50"</td><td className="py-3 px-2">32"</td><td className="py-3 px-2">25"</td></tr>
              </tbody>
            </table>

            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="mt-6 w-full py-3 bg-white text-black font-syne text-xs font-bold uppercase tracking-widest"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <Footer />
    </div>
  );
}
