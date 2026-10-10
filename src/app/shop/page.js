'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import {
  Heart,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Check,
  X,
  Search,
  Sparkles
} from 'lucide-react';

const SHOP_PRODUCTS = [
  {
    id: 'shop-item-1',
    name: 'Minimal Logo Tee',
    fit: 'Oversized Fit',
    category: 'oversized',
    price: 899,
    formattedPrice: '₹ 899',
    badge: 'BESTSELLER',
    image: '/images/prod_minimal.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#f5f5f7' },
      { name: 'Grey', hex: '#71717a' }
    ],
    theme: 'Minimal'
  },
  {
    id: 'shop-item-2',
    name: 'Fallen Angel Tee',
    fit: 'Oversized Fit',
    category: 'graphic',
    price: 999,
    formattedPrice: '₹ 999',
    badge: 'NEW DROP',
    image: '/images/prod_fallenangel.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Cream', hex: '#e5e0d8' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    theme: 'Street'
  },
  {
    id: 'shop-item-3',
    name: 'Chaos Tee',
    fit: 'Oversized Fit',
    category: 'oversized',
    price: 899,
    formattedPrice: '₹ 899',
    badge: 'HOT',
    image: '/images/prod_discipline.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#27272a' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    theme: 'Typography'
  },
  {
    id: 'shop-item-4',
    name: 'Roman Art Tee',
    fit: 'Oversized Fit',
    category: 'graphic',
    price: 999,
    formattedPrice: '₹ 999',
    badge: 'LIMITED',
    image: '/images/prod_romanart.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#f5f5f7' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    theme: 'Vintage'
  },
  {
    id: 'shop-item-5',
    name: 'Mountain Mood Tee',
    fit: 'Oversized Fit',
    category: 'graphic',
    price: 899,
    formattedPrice: '₹ 899',
    badge: 'BESTSELLER',
    image: '/images/prod_lostintime.jpg',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Cream', hex: '#e5e0d8' }
    ],
    theme: 'Abstract'
  },
  {
    id: 'shop-item-6',
    name: 'Dual Logo Tee',
    fit: 'Oversized Fit',
    category: 'plain',
    price: 799,
    formattedPrice: '₹ 799',
    badge: 'ESSENTIAL',
    image: '/images/prod_metamorphosis.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Brown', hex: '#443a35' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    theme: 'Minimal'
  },
  {
    id: 'shop-item-7',
    name: 'Chaos Back Print Tee',
    fit: 'Oversized Fit',
    category: 'graphic',
    price: 999,
    formattedPrice: '₹ 999',
    badge: 'NEW DROP',
    image: '/images/prod_urbandrift.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Grey', hex: '#71717a' }
    ],
    theme: 'Typography'
  },
  {
    id: 'shop-item-8',
    name: 'Somewhere Better Tee',
    fit: 'Oversized Fit',
    category: 'graphic',
    price: 999,
    formattedPrice: '₹ 999',
    badge: 'LIMITED',
    image: '/images/cat_newarrivals.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#f5f5f7' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    theme: 'Street'
  }
];

export default function ShopPage() {
  const [products, setProducts] = useState(SHOP_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(SHOP_PRODUCTS);
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [maxPrice, setMaxPrice] = useState(2999);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedFits, setSelectedFits] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals & Drawers
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Accordion Expand/Collapse States
  const [sectionsOpen, setSectionsOpen] = useState({
    category: true,
    size: true,
    color: true,
    price: true,
    theme: true,
    fit: true
  });

  const toggleSection = (section) => {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Fetch Products from API Endpoint
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          const sanitizedApi = data.products.map(p => ({
            ...p,
            image: p.image || p.colors?.[0]?.image || '/images/prod_minimal.jpg'
          }));
          const merged = [...sanitizedApi, ...SHOP_PRODUCTS.filter(sp => !sanitizedApi.some(p => p.id === sp.id || p.name === sp.name))];
          setProducts(merged);
          setFilteredProducts(merged);
        }
      } catch (err) {
        console.log('Using static products payload');
      }
    };
    fetchApiProducts();
  }, []);

  // Filter & Sort Effect
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory || (selectedCategory === 'oversized' && p.fit?.includes('Oversized')));
    }

    // Size Filter
    if (selectedSize) {
      result = result.filter(p => p.sizes?.includes(selectedSize));
    }

    // Color Filter
    if (selectedColor) {
      result = result.filter(p => p.colors?.some(c => c.name.toLowerCase() === selectedColor.toLowerCase()));
    }

    // Price Filter
    result = result.filter(p => (p.price || 999) <= maxPrice);

    // Theme Filter
    if (selectedThemes.length > 0) {
      result = result.filter(p => selectedThemes.includes(p.theme));
    }

    // Fit Filter
    if (selectedFits.length > 0) {
      result = result.filter(p => selectedFits.some(f => p.fit?.toLowerCase().includes(f.toLowerCase())));
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestsellers') {
      result = result.filter(p => p.badge === 'BESTSELLER').concat(result.filter(p => p.badge !== 'BESTSELLER'));
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedSize, selectedColor, maxPrice, selectedThemes, selectedFits, sortBy, products]);

  const toggleWishlist = (id) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleTheme = (theme) => {
    setSelectedThemes(prev => 
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  const toggleFit = (fit) => {
    setSelectedFits(prev => 
      prev.includes(fit) ? prev.filter(f => f !== fit) : [...prev, fit]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize(null);
    setSelectedColor(null);
    setMaxPrice(2999);
    setSelectedThemes([]);
    setSelectedFits([]);
  };

  return (
    <div className="bg-[#08080a] text-white min-h-screen selection:bg-white selection:text-black font-sans">
      <Navbar cartCount={0} onOpenCart={() => setCartOpen(true)} />

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Hero Banner Container */}
        <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[300px] bg-[#08080a] overflow-hidden mb-10 group">
          
          {/* Full Width Image (Positioned to Right) */}
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src="/images/shop_banner.jpg"
              alt="Wear Your Story Banner"
              fill
              priority
              className="object-cover object-right opacity-90"
            />
          </div>

          {/* Left Black Gradient Overlay (Fades image to solid black on the left) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/90 via-55% to-transparent z-0"></div>
          
          {/* Top/Bottom Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/80 via-transparent to-black/30 pointer-events-none z-0"></div>

          {/* Banner Inner Content Layer */}
          <div className="relative z-10 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            {/* Top Left: Breadcrumb */}
            <div className="flex items-center text-2xs sm:text-xs text-neutral-400 tracking-wider uppercase font-syne">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2 text-neutral-600 font-light">&gt;</span>
              <span className="text-white font-semibold">Shop</span>
            </div>

            {/* Bottom Row: Left SHOP Title & Right Accent */}
            <div className="flex items-end justify-between">
              
              {/* Left Title & Tagline */}
              <div>
                <div className="w-10 h-0.5 bg-white/60 mb-3"></div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase font-syne text-white mb-2 leading-none">
                  SHOP
                </h1>
                <p className="text-neutral-300 text-xs sm:text-sm font-light tracking-wide max-w-sm">
                  Streetwear for those who move differently.
                </p>
              </div>

              {/* Right Stacked Accent Text */}
              <div className="text-right hidden sm:flex flex-col items-end mb-1">
                <div className="w-6 h-px bg-white/40 mb-1.5"></div>
                <h2 className="text-2xs font-light tracking-[0.25em] text-neutral-300 uppercase leading-tight font-syne">
                  WEAR<br/>YOUR<br/><span className="font-bold text-white tracking-[0.25em]">STORY.</span>
                </h2>
                <div className="w-6 h-px bg-white/40 mt-1.5"></div>
              </div>

            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-neutral-900 border border-white/10 text-sm tracking-wider uppercase font-medium"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </span>
            <span className="text-xs text-neutral-400">({filteredProducts.length} Products)</span>
          </button>

          {/* Left Sidebar Filters Component */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-[#0a0a0c] border-r border-white/10 p-6 overflow-y-auto transition-transform duration-300
            lg:relative lg:translate-x-0 lg:z-0 lg:w-64 lg:bg-transparent lg:border-none lg:p-0
            ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b border-white/10">
              <span className="font-syne font-bold uppercase tracking-wider">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 text-xs tracking-wider">
              
              {/* Category Filter */}
              <div className="border-b border-white/10 pb-6">
                <div 
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between cursor-pointer font-bold uppercase tracking-widest text-neutral-200 mb-4"
                >
                  <span>CATEGORY</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sectionsOpen.category ? 'rotate-180' : ''}`} />
                </div>
                
                {sectionsOpen.category && (
                  <div className="space-y-2.5 text-neutral-400">
                    {[
                      { id: 'all', label: 'All Products', count: 120 },
                      { id: 'oversized', label: 'Oversized Tees', count: 48 },
                      { id: 'graphic', label: 'Graphic Tees', count: 32 },
                      { id: 'plain', label: 'Plain Tees', count: 18 },
                      { id: 'fullsleeve', label: 'Full Sleeve Tees', count: 12 },
                      { id: 'polo', label: 'Polo T-shirts', count: 10 }
                    ].map(cat => (
                      <label 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex items-center justify-between cursor-pointer hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3.5 h-3.5 rounded-full border border-neutral-600 flex items-center justify-center transition-colors ${selectedCategory === cat.id ? 'border-white bg-white' : 'group-hover:border-neutral-400'}`}>
                            {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                          </div>
                          <span className={selectedCategory === cat.id ? 'text-white font-medium' : ''}>{cat.label}</span>
                        </div>
                        <span className="text-neutral-600">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-white/10 pb-6">
                <div 
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between cursor-pointer font-bold uppercase tracking-widest text-neutral-200 mb-4"
                >
                  <span>SIZE</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sectionsOpen.size ? 'rotate-180' : ''}`} />
                </div>

                {sectionsOpen.size && (
                  <div className="grid grid-cols-6 gap-1.5">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                        className={`h-8 border flex items-center justify-center font-medium transition-all text-2xs ${
                          selectedSize === sz 
                            ? 'bg-white text-black border-white' 
                            : 'border-white/15 text-neutral-300 hover:border-white/50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="border-b border-white/10 pb-6">
                <div 
                  onClick={() => toggleSection('color')}
                  className="flex items-center justify-between cursor-pointer font-bold uppercase tracking-widest text-neutral-200 mb-4"
                >
                  <span>COLOR</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sectionsOpen.color ? 'rotate-180' : ''}`} />
                </div>

                {sectionsOpen.color && (
                  <div className="flex items-center gap-3">
                    {[
                      { name: 'white', hex: '#ffffff' },
                      { name: 'black', hex: '#0a0a0a' },
                      { name: 'grey', hex: '#71717a' },
                      { name: 'cream', hex: '#e5e0d8' },
                      { name: 'sage', hex: '#4a5d4e' },
                      { name: 'red', hex: '#8b0000' }
                    ].map(clr => (
                      <button
                        key={clr.name}
                        onClick={() => setSelectedColor(selectedColor === clr.name ? null : clr.name)}
                        className={`w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center transition-all ${
                          selectedColor === clr.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: clr.hex }}
                        title={clr.name}
                      >
                        {clr.name === 'white' && selectedColor === 'white' && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter Slider */}
              <div className="border-b border-white/10 pb-6">
                <div 
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between cursor-pointer font-bold uppercase tracking-widest text-neutral-200 mb-4"
                >
                  <span>PRICE</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sectionsOpen.price ? 'rotate-180' : ''}`} />
                </div>

                {sectionsOpen.price && (
                  <div className="space-y-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="2999" 
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-white bg-neutral-800 h-1 rounded-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-neutral-400 font-mono text-xs">
                      <span>₹ 0</span>
                      <span className="text-white font-bold">₹ {maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Design / Theme Checkboxes */}
              <div className="border-b border-white/10 pb-6">
                <div 
                  onClick={() => toggleSection('theme')}
                  className="flex items-center justify-between cursor-pointer font-bold uppercase tracking-widest text-neutral-200 mb-4"
                >
                  <span>DESIGN / THEME</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sectionsOpen.theme ? 'rotate-180' : ''}`} />
                </div>

                {sectionsOpen.theme && (
                  <div className="space-y-2.5 text-neutral-400">
                    {['Typography', 'Anime', 'Abstract', 'Minimal', 'Vintage', 'Street'].map(thm => (
                      <label 
                        key={thm} 
                        onClick={() => toggleTheme(thm)}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className={`w-3.5 h-3.5 border border-neutral-600 flex items-center justify-center transition-colors ${selectedThemes.includes(thm) ? 'bg-white border-white' : ''}`}>
                          {selectedThemes.includes(thm) && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                        </div>
                        <span className={selectedThemes.includes(thm) ? 'text-white font-medium' : ''}>{thm}</span>
                      </label>
                    ))}
                    <button className="text-neutral-500 hover:text-white pt-1 font-medium transition-colors">
                      View More +
                    </button>
                  </div>
                )}
              </div>

              {/* Fit Checkboxes */}
              <div className="pb-6">
                <div 
                  onClick={() => toggleSection('fit')}
                  className="flex items-center justify-between cursor-pointer font-bold uppercase tracking-widest text-neutral-200 mb-4"
                >
                  <span>FIT</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sectionsOpen.fit ? 'rotate-180' : ''}`} />
                </div>

                {sectionsOpen.fit && (
                  <div className="space-y-2.5 text-neutral-400">
                    {['Oversized', 'Regular', 'Slim'].map(fit => (
                      <label 
                        key={fit} 
                        onClick={() => toggleFit(fit)}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className={`w-3.5 h-3.5 border border-neutral-600 flex items-center justify-center transition-colors ${selectedFits.includes(fit) ? 'bg-white border-white' : ''}`}>
                          {selectedFits.includes(fit) && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                        </div>
                        <span className={selectedFits.includes(fit) ? 'text-white font-medium' : ''}>{fit}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Filters button if any active */}
              {(selectedCategory !== 'all' || selectedSize || selectedColor || maxPrice < 2999 || selectedThemes.length > 0 || selectedFits.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 bg-neutral-900 border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-all text-xs tracking-widest uppercase"
                >
                  Clear Filters
                </button>
              )}

            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1">
            
            {/* Top Controls Bar above Grid */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest font-bold text-neutral-300 font-syne">
                {filteredProducts.length} PRODUCTS
              </span>

              <div className="flex items-center gap-4">


                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0a0a0c] border border-white/15 text-xs text-neutral-200 px-3 py-1.5 pr-8 uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:border-white"
                  >
                    <option value="latest">Sort by: Latest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="bestsellers">Bestsellers</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Cards Display Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-white/10 p-8">
                <Search className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold font-syne uppercase tracking-wider mb-2">No Products Found</h3>
                <p className="text-neutral-500 text-xs mb-6">Try relaxing your filter criteria or clear active filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                {filteredProducts.map((prod, idx) => {
                  const targetId = prod.id || prod._id || prod.slug || `shop-item-${idx}`;
                  return (
                    <div
                      key={targetId}
                      className="group flex flex-col"
                    >
                      {/* Image Box */}
                      <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-3 border border-white/10 group-hover:border-white/30 transition-colors">
                        <Link href={`/shop/${targetId}`}>
                          <Image
                            src={prod.image || prod.colors?.[0]?.image || '/images/prod_minimal.jpg'}
                            alt={prod.name || 'Product Image'}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                        </Link>

                        {/* Top Right Wishlist Heart Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod.id || prod._id);
                          }}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-110 transition-transform"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              wishlist.includes(prod.id || prod._id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-neutral-300 hover:text-white'
                            }`}
                          />
                        </button>

                      </div>

                      {/* Info Area below Product Card */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          {/* Title & Price Inline */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <Link 
                              href={`/shop/${targetId}`}
                              className="text-sm font-semibold tracking-wide text-neutral-100 group-hover:text-white transition-colors truncate"
                            >
                              {prod.name}
                            </Link>
                            <span className="text-sm font-bold text-neutral-100 font-mono whitespace-nowrap">
                              {prod.formattedPrice || `₹ ${prod.price}`}
                            </span>
                          </div>

                        {/* Fit Label */}
                        <p className="text-2xs text-neutral-400 font-light mb-2.5">
                          {prod.fit || 'Oversized Fit'}
                        </p>
                      </div>

                      {/* Color Variant Dots */}
                      <div className="flex items-center gap-1.5">
                        {prod.colors?.map((clr, idx) => (
                          <span
                            key={idx}
                            className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                            style={{ backgroundColor: clr.hex }}
                            title={clr.name}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={() => {
          setCartOpen(true);
          setQuickViewProduct(null);
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <Footer />
    </div>
  );
}
