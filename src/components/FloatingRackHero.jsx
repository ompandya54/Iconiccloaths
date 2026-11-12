'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  RotateCw,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Check,
  Eye,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getProducts } from '@/app/api/productapi';

// Curated signature archive pieces with Front & Back styling
const CURATED_RACK_ITEMS = [
  {
    _id: 'rack-1',
    name: 'FALLEN ANGEL OVERSIZED TEE',
    subtitle: 'High-Density Gothic Puff Print • Heavyweight 260 GSM',
    price: 999,
    originalPrice: 1499,
    badge: 'BESTSELLER',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    gsm: '260 GSM',
    fit: 'Drop Shoulder Boxy',
    image: '/images/prod_fallenangel.jpg',
    backImage: '/images/hero_bg_1.jpg',
    category: 'Graphic',
    theme: 'Gothic Darkwear',
    colorName: 'Pitch Black',
    colorHex: '#0d0d10',
    fabric: '100% French Terry Cotton',
  },
  {
    _id: 'rack-2',
    name: 'METAMORPHOSIS ACID TEE',
    subtitle: 'Enzyme Washed Raw Skate Cut • 240 GSM',
    price: 899,
    originalPrice: 1299,
    badge: 'LIMITED DROP',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    gsm: '240 GSM',
    fit: 'Relaxed Street',
    image: '/images/prod_metamorphosis.jpg',
    backImage: '/images/cat_oversized.jpg',
    category: 'Oversized',
    theme: 'Acid Wash',
    colorName: 'Vintage Charcoal',
    colorHex: '#1e1f23',
    fabric: 'Enzyme-Washed Combed Cotton',
  },
  {
    _id: 'rack-3',
    name: 'LOST IN TIME GRAPHIC TEE',
    subtitle: 'Cyberpunk Retro Futurism Screenprint • 250 GSM',
    price: 999,
    originalPrice: 1599,
    badge: 'NEW ARRIVAL',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    gsm: '250 GSM',
    fit: 'Oversized Heavy',
    image: '/images/prod_lostintime.jpg',
    backImage: '/images/cat_graphic.jpg',
    category: 'Graphic',
    theme: 'Cyberpunk',
    colorName: 'Onyx Black',
    colorHex: '#121215',
    fabric: 'Pre-Shrunk Bio-Washed',
  },
  {
    _id: 'rack-4',
    name: 'DISCIPLINE RAW ESSENTIAL',
    subtitle: 'Ultra-Compact Bio-Washed Loopknit • 280 GSM',
    price: 799,
    originalPrice: 1199,
    badge: 'CORE PIECE',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    gsm: '280 GSM',
    fit: 'Boxy Heavyweight',
    image: '/images/prod_discipline.jpg',
    backImage: '/images/cat_essentials.jpg',
    category: 'Essentials',
    theme: 'Minimalist Luxe',
    colorName: 'Raw White',
    colorHex: '#e2e2df',
    fabric: 'Heavyweight Loopknit',
  },
  {
    _id: 'rack-5',
    name: 'ROMAN ART ARCHIVE TEE',
    subtitle: 'Classical Sculpture Front Screenprint • 240 GSM',
    price: 999,
    originalPrice: 1499,
    badge: 'VIRAL DROP',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    gsm: '240 GSM',
    fit: 'Drop Shoulder',
    image: '/images/prod_romanart.jpg',
    backImage: '/images/cat_collections.jpg',
    category: 'Graphic',
    theme: 'Vintage Art',
    colorName: 'Washed Black',
    colorHex: '#18181c',
    fabric: 'Super Combed Cotton',
  },
  {
    _id: 'rack-6',
    name: 'MINIMAL STATEMENT TEE',
    subtitle: 'Subtle Center Chest Monogram • 260 GSM',
    price: 849,
    originalPrice: 1249,
    badge: 'ICONIC ARCHIVE',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    gsm: '260 GSM',
    fit: 'Relaxed Fit',
    image: '/images/prod_minimal.jpg',
    backImage: '/images/story_model.jpg',
    category: 'Essentials',
    theme: 'Clean Luxury',
    colorName: 'Slate Grey',
    colorHex: '#25262c',
    fabric: 'Silicon Washed Soft Terry',
  },
  {
    _id: 'rack-7',
    name: 'URBAN DRIFT CARGO TEE',
    subtitle: 'Tokyo Subculture Graphic • 250 GSM',
    price: 949,
    originalPrice: 1399,
    badge: 'LIMITED 50 PCS',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    gsm: '250 GSM',
    fit: 'Oversized Fit',
    image: '/images/prod_urbandrift.jpg',
    backImage: '/images/hero_bg.png',
    category: 'Graphic',
    theme: 'Japanese Streetwear',
    colorName: 'Deep Phantom',
    colorHex: '#0f1013',
    fabric: 'Heavy Duty 100% Cotton',
  },
];

export default function FloatingRackHero({ title = 'THE SUSPENDED COLLECTION', subtitle = 'PHYSICAL ARCHIVE • FLOATING RACK EXHIBIT' }) {
  const { addToCart } = useCart();
  const [items, setItems] = useState(CURATED_RACK_ITEMS);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [isFlipped, setIsFlipped] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Fetch real database products and dynamically enrich the rack
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await getProducts({ limit: 12 });
        const liveList = res?.data || res?.products || [];
        if (liveList.length > 0) {
          const formatted = liveList.map((p, idx) => {
            const fallbackItem = CURATED_RACK_ITEMS[idx % CURATED_RACK_ITEMS.length];
            const primaryImg = p.images?.[0]?.url || p.images?.[0] || p.image || fallbackItem.image;
            const secondaryImg = p.images?.[1]?.url || p.images?.[1] || fallbackItem.backImage;

            return {
              _id: p._id || p.id || `live-${idx}`,
              name: p.name || fallbackItem.name,
              subtitle: p.description
                ? p.description.slice(0, 50) + '...'
                : `${p.gsm || '260 GSM'} • ${p.fit || 'Oversized Fit'}`,
              price: Number(p.price) || fallbackItem.price,
              originalPrice: Number(p.originalPrice) || Math.round((Number(p.price) || 999) * 1.45),
              badge: p.badge || (p.isBestseller ? 'BESTSELLER' : 'NEW DROP'),
              badgeColor:
                p.badge === 'LIMITED'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30',
              gsm: p.gsm || '260 GSM',
              fit: p.fit || 'Drop Shoulder Boxy',
              image: primaryImg,
              backImage: secondaryImg,
              category: p.category?.name || p.category || 'Streetwear',
              theme: p.theme || 'Graphic',
              colorName: p.color || fallbackItem.colorName,
              colorHex: fallbackItem.colorHex,
              fabric: p.material || fallbackItem.fabric,
            };
          });

          // Ensure at least 6-7 hangers on the rack for a lush boutique experience
          if (formatted.length < 6) {
            const combined = [...formatted];
            CURATED_RACK_ITEMS.forEach((fallback) => {
              if (combined.length < 7 && !combined.some((c) => c.name === fallback.name)) {
                combined.push(fallback);
              }
            });
            setItems(combined);
          } else {
            setItems(formatted.slice(0, 8));
          }
        }
      } catch (err) {
        console.error('Failed to load products for rack hero:', err);
      }
    }
    loadLiveProducts();
  }, []);

  // Keyboard shortcut: Escape returns tee to rack
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedIndex !== null) {
        setSelectedIndex(null);
        setIsFlipped(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  // Subtle interactive parallax from cursor position
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleTshirtClick = (index) => {
    if (selectedIndex === index) {
      // Toggle back to rack
      setSelectedIndex(null);
      setIsFlipped(false);
      setAddedSuccess(false);
    } else {
      setSelectedIndex(index);
      setIsFlipped(false);
      setAddedSuccess(false);
    }
  };

  const handleCloseSelection = () => {
    setSelectedIndex(null);
    setIsFlipped(false);
    setAddedSuccess(false);
  };

  const handleAddToCart = (item) => {
    addToCart(item, item.colorName || 'Standard', selectedSize, 1);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2200);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (selectedIndex === null) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      setIsFlipped(false);
      setAddedSuccess(false);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (selectedIndex === null) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      setIsFlipped(false);
      setAddedSuccess(false);
    }
  };

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#050507] text-white overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-10 select-none border-b border-white/10"
      style={{ perspective: 1800 }}
    >
      {/* ================= ATMOSPHERIC STUDIO BACKGROUND ================= */}
      {/* 1. Dramatic Overhead Spotlight Cones */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] pointer-events-none transition-all duration-700 ease-out"
        style={{
          background:
            selectedIndex !== null
              ? 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(59, 130, 246, 0.32) 0%, rgba(139, 92, 246, 0.14) 40%, transparent 75%)'
              : 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(59, 130, 246, 0.08) 45%, transparent 75%)',
        }}
      />

      {/* 2. Cyberpunk Ambient Glows */}
      <div className="absolute top-1/4 -left-36 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -right-36 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 3. Brutalist Watermark in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span
          className="text-[14vw] font-black tracking-tighter text-white/[0.025] uppercase whitespace-nowrap transition-transform duration-700 ease-out font-sans"
          style={{
            transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -20}px, 0)`,
          }}
        >
          ICONIC ARCHIVE
        </span>
      </div>

      {/* 4. Ground Perspective Grid Floor */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none opacity-25"
        style={{
          background:
            'linear-gradient(to top, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: 'perspective(450px) rotateX(68deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* ================= HEADER SECTION CONTENT ================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full text-center space-y-3">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-[11px] font-bold tracking-[0.25em] text-gray-300 uppercase shadow-2xl">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>{subtitle}</span>
        </div>

        {/* Section Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none font-sans drop-shadow-xl">
          {title}
        </h1>

        {/* Helper instruction */}
        <p className="text-xs sm:text-sm text-gray-400 font-normal max-w-xl mx-auto leading-relaxed">
          {selectedIndex !== null ? (
            <span className="text-blue-400 font-semibold tracking-wide flex items-center justify-center space-x-1.5 animate-pulse">
              <span>Inspecting Piece #{selectedIndex + 1} of {items.length}.</span>
              <span className="text-gray-400 font-normal">• Click again or press ESC to return to rack</span>
            </span>
          ) : (
            <span>
              Streetwear tees suspended in air. <strong className="text-white">Click any tee</strong> to slide others away, rotate front-facing &amp; inspect details.
            </span>
          )}
        </p>
      </div>

      {/* ================= 3D FLOATING RACK STAGE ================= */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-2 sm:px-6 my-auto pt-10 pb-2">
        {/* Click outside to return tee to rack */}
        {selectedIndex !== null && (
          <div
            onClick={handleCloseSelection}
            className="fixed inset-0 z-10 cursor-pointer"
            title="Click anywhere to return tee to rack"
          />
        )}

        {/* ----------------- THE SUSPENDED METALLIC POLE / RAIL ----------------- */}
        <div className="relative w-full max-w-5xl mx-auto mb-[-12px] z-20">
          {/* Ceiling Suspension Wires */}
          <div className="absolute -top-36 left-20 w-[1.5px] h-36 bg-gradient-to-b from-white/10 via-white/40 to-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          <div className="absolute -top-36 right-20 w-[1.5px] h-36 bg-gradient-to-b from-white/10 via-white/40 to-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

          {/* Chrome Rail Bracket Mounts */}
          <div className="absolute -top-2 left-18 w-5 h-5 rounded-full bg-slate-300 border border-white shadow-[0_0_12px_rgba(255,255,255,0.6)] z-30" />
          <div className="absolute -top-2 right-18 w-5 h-5 rounded-full bg-slate-300 border border-white shadow-[0_0_12px_rgba(255,255,255,0.6)] z-30" />

          {/* The Rail Bar itself */}
          <div
            className="w-full h-3 rounded-full relative shadow-[0_14px_28px_rgba(0,0,0,0.95),0_0_20px_rgba(255,255,255,0.2)] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #e4e4e7 0%, #ffffff 32%, #71717a 65%, #18181b 100%)',
            }}
          >
            {/* Metallic Highlight Reflection Stripe */}
            <div className="absolute top-0.5 inset-x-0 h-[1px] bg-white/95" />
            <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-black/70" />
          </div>

          {/* Rail End Caps with neon rings */}
          <div className="absolute -left-3 -top-1 w-5 h-5 rounded-full bg-zinc-900 border-2 border-slate-300 shadow-[0_0_14px_rgba(59,130,246,0.9)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full bg-zinc-900 border-2 border-slate-300 shadow-[0_0_14px_rgba(59,130,246,0.9)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>
        </div>

        {/* ----------------- THE HANGERS & T-SHIRTS ROW (3D RACK) ----------------- */}
        <div
          className="relative w-full max-w-5xl mx-auto flex items-center justify-center min-h-[440px] sm:min-h-[510px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${mousePos.x * 7}deg) rotateX(${mousePos.y * -4}deg)`,
            transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {items.map((item, index) => {
            const isSelected = selectedIndex === index;
            const hasSelection = selectedIndex !== null;

            // 3D positioning calculations:
            let xOffset = 0;
            let zOffset = 0;
            let yOffset = 0;
            let rotateYAngle = -56; // Standard sideways boutique rack angle
            let itemScale = 1;
            let itemOpacity = 1;
            let filterStyle = 'none';

            if (hasSelection) {
              if (isSelected) {
                // Selected item: rotates to 0deg (front view) or 180deg (back view), moves forward in 3D, scales up
                xOffset = 0;
                zOffset = 270;
                yOffset = -18;
                rotateYAngle = isFlipped ? 180 : 0;
                itemScale = 1.35;
                itemOpacity = 1;
                filterStyle = 'none';
              } else if (index < selectedIndex) {
                // Items to the left: slide smoothly to the left and push backward
                const dist = selectedIndex - index;
                xOffset = -(135 + dist * 40);
                zOffset = -150 - dist * 25;
                yOffset = 10;
                rotateYAngle = -68;
                itemScale = 0.75;
                itemOpacity = 0.22;
                filterStyle = 'blur(2px) grayscale(40%)';
              } else {
                // Items to the right: slide smoothly to the right and push backward
                const dist = index - selectedIndex;
                xOffset = 135 + dist * 40;
                zOffset = -150 - dist * 25;
                yOffset = 10;
                rotateYAngle = -42;
                itemScale = 0.75;
                itemOpacity = 0.22;
                filterStyle = 'blur(2px) grayscale(40%)';
              }
            } else {
              // Idle state on the rack: spaced along the horizontal pole
              const centerIndex = (items.length - 1) / 2;
              xOffset = (index - centerIndex) * 98;
              zOffset = -(Math.abs(index - centerIndex) * 12);
              rotateYAngle = -56;
              itemScale = 1;
              itemOpacity = 1;
              filterStyle = 'none';
            }

            // Continuous floating air sway physics
            const breezeDur = 4.2 + (index % 3) * 0.9;
            const breezeDelay = index * 0.32;

            return (
              <motion.div
                key={item._id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTshirtClick(index);
                }}
                className={`absolute top-0 flex flex-col items-center cursor-pointer select-none ${
                  isSelected ? 'z-50 pointer-events-auto' : 'z-20 hover:z-40'
                }`}
                animate={{
                  x: xOffset,
                  y: isSelected ? yOffset : [yOffset, yOffset + 5, yOffset - 4, yOffset + 3, yOffset],
                  z: zOffset,
                  rotateY: rotateYAngle,
                  rotateZ: isSelected ? 0 : [-1.8, 2.2, -1.5, 1.8, -1.8],
                  scale: itemScale,
                  opacity: itemOpacity,
                  filter: filterStyle,
                }}
                transition={{
                  x: { type: 'spring', stiffness: 220, damping: 24 },
                  z: { type: 'spring', stiffness: 220, damping: 24 },
                  rotateY: { type: 'spring', stiffness: 190, damping: 22 },
                  scale: { type: 'spring', stiffness: 220, damping: 24 },
                  opacity: { duration: 0.35 },
                  // Ambient breeze swaying:
                  y: isSelected
                    ? { type: 'spring', stiffness: 260, damping: 24 }
                    : { repeat: Infinity, duration: breezeDur, delay: breezeDelay, ease: 'easeInOut' },
                  rotateZ: isSelected
                    ? { type: 'spring', stiffness: 260, damping: 24 }
                    : { repeat: Infinity, duration: breezeDur + 0.6, delay: breezeDelay, ease: 'easeInOut' },
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'top center',
                }}
              >
                {/* ----------------- REALISTIC METALLIC HANGER ----------------- */}
                <div
                  className="relative flex flex-col items-center pointer-events-none"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Chrome Metal Hook Looping Over the Rail */}
                  <svg
                    width="44"
                    height="50"
                    viewBox="0 0 44 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible -mb-1 drop-shadow-md"
                  >
                    <path
                      d="M22 46 V30 C22 22 26 12 33 12 C38 12 40 16 38 20 C36 23 32 23 31 20"
                      stroke="url(#metalGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="34" cy="16" r="1.5" fill="#ffffff" />
                    <defs>
                      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="40%" stopColor="#cbd5e1" />
                        <stop offset="70%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Sculpted Matte Hanger Body */}
                  <div
                    className="relative w-48 sm:w-56 h-9 rounded-t-sm flex items-center justify-center shadow-xl"
                    style={{
                      background: 'linear-gradient(180deg, #27272a 0%, #18181b 60%, #09090b 100%)',
                      clipPath: 'polygon(50% 0%, 100% 85%, 98% 100%, 50% 35%, 2% 100%, 0% 85%)',
                      borderTop: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    <span className="text-[7px] tracking-[0.3em] font-black text-white/50 uppercase absolute top-1">
                      ICONIC
                    </span>
                  </div>
                </div>

                {/* ----------------- THE T-SHIRT SILHOUETTE ON HANGER ----------------- */}
                <div
                  className={`relative w-44 sm:w-52 h-64 sm:h-72 rounded-b-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(59,130,246,0.4)] ring-1 ring-white/35'
                      : 'shadow-[0_16px_32px_rgba(0,0,0,0.85)] hover:ring-1 hover:ring-white/20'
                  }`}
                  style={{
                    backgroundColor: item.colorHex || '#111215',
                  }}
                >
                  {/* Collar Cutout Neck Arc at top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#050507] rounded-b-full border-b border-white/20 z-10 shadow-inner">
                    <div className="w-6 h-2 mx-auto mt-0.5 bg-white/20 rounded-[1px] flex items-center justify-center">
                      <span className="text-[5px] text-white font-mono">{selectedSize}</span>
                    </div>
                  </div>

                  {/* Front/Back Graphic Image */}
                  <img
                    src={isFlipped && isSelected ? (item.backImage || item.image) : item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = '/images/prod_minimal.jpg';
                    }}
                  />

                  {/* Fabric Depth & Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/35 pointer-events-none" />
                  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

                  {/* Ribbon Badge on the T-shirt */}
                  <div className="absolute top-4 left-3 z-10">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase border backdrop-blur-md ${item.badgeColor || 'bg-white/10 text-white border-white/20'}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Back View Indicator when flipped */}
                  {isSelected && isFlipped && (
                    <div className="absolute top-4 right-3 z-10">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-blue-600/60 text-white border border-blue-400/40 backdrop-blur-md">
                        BACK PRINT
                      </span>
                    </div>
                  )}

                  {/* Bottom Preview Info (idle rack mode) */}
                  {!isSelected && (
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                      <p className="text-[11px] font-black uppercase text-white tracking-wide truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[11px] font-bold text-white">₹{item.price}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest">{item.gsm}</span>
                      </div>
                    </div>
                  )}

                  {/* Click to expand hover hint */}
                  {!isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 z-20">
                      <div className="px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-wider shadow-2xl flex items-center space-x-1.5 transform scale-95 hover:scale-100 transition-transform">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Cut</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ground Shadow underneath the t-shirt */}
                <div
                  className="w-32 h-4 rounded-full bg-black/70 blur-md mt-4 transition-all duration-300"
                  style={{
                    transform: isSelected ? 'scale(1.5)' : 'scale(0.9)',
                    opacity: isSelected ? 0.85 : 0.45,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ----------------- EXPANDED INSPECTION & PURCHASE CARD ----------------- */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
              className="relative z-40 max-w-xl mx-auto mt-6 bg-zinc-950/95 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {selectedItem.gsm || '260 GSM'} • {selectedItem.fit}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                      {selectedItem.theme}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-tight font-sans">
                    {selectedItem.name}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-1">
                    {selectedItem.fabric || selectedItem.subtitle}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  {/* 3D Rotate/Flip Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(!isFlipped);
                    }}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                    title={isFlipped ? 'View Front Print' : 'View Back Print'}
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Close / Return to Rack Button */}
                  <button
                    onClick={handleCloseSelection}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                    title="Return to rack (ESC)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price & Size Selector Row */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {/* Price Display */}
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    ₹{selectedItem.price}
                  </span>
                  {selectedItem.originalPrice && selectedItem.originalPrice > selectedItem.price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{selectedItem.originalPrice}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-emerald-400">
                    SAVE {Math.round(((selectedItem.originalPrice - selectedItem.price) / selectedItem.originalPrice) * 100)}%
                  </span>
                </div>

                {/* Size Selector Pills */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Size:</span>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(sz);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                        selectedSize === sz
                          ? 'bg-white text-black shadow-lg scale-105'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Return */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(selectedItem);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl ${
                    addedSuccess
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white hover:bg-gray-200 text-black'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO CART!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseSelection();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-white/10 transition-colors"
                >
                  <span>RETURN TO RACK</span>
                  <X className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------- RACK NAVIGATION ARROWS & DOTS ----------------- */}
        <div className="flex items-center justify-between max-w-5xl mx-auto px-4 mt-6">
          <button
            onClick={handlePrev}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 text-xs font-bold tracking-wider uppercase backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREVIOUS PIECE</span>
          </button>

          {/* Quick Counter Indicator */}
          <div className="flex items-center space-x-1.5">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTshirtClick(dotIdx);
                }}
                className={`transition-all rounded-full ${
                  selectedIndex === dotIdx
                    ? 'w-6 h-1.5 bg-blue-400'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
                }`}
                title={`Item ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 text-xs font-bold tracking-wider uppercase backdrop-blur-md"
          >
            <span className="hidden sm:inline">NEXT PIECE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= BOTTOM FABRIC & DROP SPECS ================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 px-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md text-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">HEAVYWEIGHT</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">240–280 GSM</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">FABRIC TECH</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">100% FRENCH TERRY</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">PRINT METHOD</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">HIGH-DENSITY PUFF</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">WORLDWIDE</p>
            <p className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">LIMITED RUN ARCHIVE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
