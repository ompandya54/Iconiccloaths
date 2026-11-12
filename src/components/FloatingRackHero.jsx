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
  Check,
  Eye,
  Layers,
  Flame,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// 6 Hyper-realistic Streetwear T-Shirt Models with custom Graphics, Fabric Shading & Back Prints
const TSHIRT_MODELS = [
  {
    id: 'tee-1',
    name: 'METAMORPHOSIS HEAVY TEE',
    colorName: 'Vintage Acid Charcoal',
    baseColor: '#17181c',
    accentColor: '#e11d48',
    fabric: '260 GSM High-Density Loopknit',
    fit: 'Boxy Drop Shoulder',
    price: 999,
    originalPrice: 1499,
    badge: 'LIMITED DROP',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    frontGraphic: {
      title: 'METAMORPHOSIS',
      sub: 'TOKYO SKATE ARCHIVE // 2026',
      artType: 'gothic-skull',
      kanji: '変態 // 混沌',
    },
    backGraphic: {
      title: 'CHAOS CONTROL',
      sub: 'HEAVYWEIGHT OVERSIZED SPEC',
      artType: 'cyber-wings',
      kanji: '東京 // 新時代',
    },
  },
  {
    id: 'tee-2',
    name: 'CHAOS & ANARCHY CYBER TEE',
    colorName: 'Pitch Black Heavy Terry',
    baseColor: '#0b0b0e',
    accentColor: '#f97316',
    fabric: '280 GSM Ultra-Combed Cotton',
    fit: 'Oversized Streetwear Cut',
    price: 1099,
    originalPrice: 1699,
    badge: 'BESTSELLER',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    frontGraphic: {
      title: 'ANARCHY // 02',
      sub: 'SUBWAY RAW REBELLION',
      artType: 'cyber-kanji',
      kanji: '無秩序 // 破壊',
    },
    backGraphic: {
      title: 'SUBWAY RUNNER',
      sub: 'LIMITED 100 PIECES WORLDWIDE',
      artType: 'distressed-cross',
      kanji: '都市の漂流',
    },
  },
  {
    id: 'tee-3',
    name: 'LOST IN TIME ANIME TEE',
    colorName: 'Vintage Ecru / Raw Sand',
    baseColor: '#dcd7cd',
    accentColor: '#0f172a',
    isLight: true,
    fabric: '240 GSM Bio-Washed Organic Cotton',
    fit: 'Relaxed Silhouette',
    price: 899,
    originalPrice: 1299,
    badge: 'VIRAL HIT',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    frontGraphic: {
      title: 'LOST IN TOKYO',
      sub: 'NEO-SHINJUKU NIGHTMARE',
      artType: 'anime-eyes',
      kanji: '時を失った',
    },
    backGraphic: {
      title: 'CYBER CITY 2026',
      sub: 'ICONIC CLOTHING CORP.',
      artType: 'matrix-grid',
      kanji: '未来の記憶',
    },
  },
  {
    id: 'tee-4',
    name: 'FALLEN ANGEL GOTHIC TEE',
    colorName: 'Obsidian Washed Black',
    baseColor: '#111216',
    accentColor: '#818cf8',
    fabric: '260 GSM French Terry Cotton',
    fit: 'Drop Shoulder Boxy',
    price: 999,
    originalPrice: 1499,
    badge: 'CORE PIECE',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    frontGraphic: {
      title: 'FALLEN ANGEL',
      sub: 'NEO-RENAISSANCE SCULPTURE',
      artType: 'angel-statue',
      kanji: '堕天使 // 祈り',
    },
    backGraphic: {
      title: 'DARK REALM',
      sub: 'HIGH DENSITY PUFF PRINT',
      artType: 'gothic-cross',
      kanji: '暗黒の領域',
    },
  },
  {
    id: 'tee-5',
    name: 'DISCIPLINE ARCHIVE TEE',
    colorName: 'Mineral Washed Olive',
    baseColor: '#1d2320',
    accentColor: '#34d399',
    fabric: '280 GSM Compact Loopknit',
    fit: 'Architectural Boxy Cut',
    price: 849,
    originalPrice: 1249,
    badge: 'NEW DROP',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    frontGraphic: {
      title: 'DISCIPLINE',
      sub: 'LUXURY ESSENTIAL UNIFORM',
      artType: 'minimal-box',
      kanji: '規律 // 集中',
    },
    backGraphic: {
      title: 'ARCHITECTURAL TEE',
      sub: 'ZERO COMPROMISE FORM',
      artType: 'blueprint-lines',
      kanji: '構造と美学',
    },
  },
  {
    id: 'tee-6',
    name: 'RETRO 90S SKATE TEE',
    colorName: 'Acid Enzyme Faded Black',
    baseColor: '#1e1f24',
    accentColor: '#fbbf24',
    fabric: '250 GSM Enzyme-Washed Cotton',
    fit: 'Authentic 90s Skate Cut',
    price: 949,
    originalPrice: 1399,
    badge: 'ARCHIVE EXCLUSIVE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    frontGraphic: {
      title: 'ACID SKATE 90s',
      sub: 'CALIFORNIA UNDERGROUND ROOTS',
      artType: 'skate-star',
      kanji: 'ヴィンテージ // 滑走',
    },
    backGraphic: {
      title: 'RAW DISTRESSED',
      sub: 'HAND-ENZYME WASHED GRAIN',
      artType: 'distressed-text',
      kanji: '永久のスタイル',
    },
  },
];

// Dedicated SVG T-Shirt Silhouette & Graphic Renderer
// NO CARDS! Pure garment shape with collar, sleeves, and drop-shoulder drape.
function RealTshirtGarment({ model, isSelected, isFlipped }) {
  const isLight = Boolean(model.isLight);
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const subColor = isLight ? '#475569' : '#94a3b8';
  const graphic = isFlipped ? model.backGraphic : model.frontGraphic;

  // Realistic Oversized Boxy Streetwear Silhouette Path
  // Coordinates precisely centered around X=150 in 300x340 space.
  const garmentPath = `
    M 115 24
    C 128 42, 172 42, 185 24
    L 255 48
    L 290 140
    L 245 154
    L 228 126
    L 228 310
    C 200 316, 100 316, 72 310
    L 72 126
    L 55 154
    L 10 140
    L 45 48
    Z
  `;

  const uniqueId = `tee-clip-${model.id}`;

  return (
    <div className="relative w-[240px] sm:w-[280px] h-[310px] sm:h-[350px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]">
      <svg
        viewBox="0 0 300 340"
        className="w-full h-full overflow-visible select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* T-Shirt Silhouette Clip Path */}
          <clipPath id={uniqueId}>
            <path d={garmentPath} />
          </clipPath>

          {/* Chrome Metal Hanger Hook Gradient */}
          <linearGradient id={`hookGrad-${model.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#cbd5e1" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Fabric Dynamic Depth Gradient */}
          <linearGradient id={`fabricShade-${model.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isLight ? "0.15" : "0.08"} />
            <stop offset="40%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </linearGradient>

          {/* Torso Center Spotlight */}
          <radialGradient id={`chestLight-${model.id}`} cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isLight ? "0.12" : "0.06"} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* ================= 1. HANGER (HOOK & CONTUOR BAR) ================= */}
        {/* Metal Hook that physically loops over the rail at Y = -18 */}
        <path
          d="M 150 24 V -10 C 150 -26, 168 -26, 168 -12 C 168 -4, 156 -4, 156 -12"
          stroke={`url(#hookGrad-${model.id})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Sculpted Dark Wood / Titanium Hanger Shoulders inside the garment */}
        <path
          d="M 45 48 L 150 18 L 255 48"
          stroke="#09090b"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 50 47 L 150 19 L 250 47"
          stroke="#27272a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Inner Back Collar seen through the neckline */}
        <path
          d="M 115 24 C 130 14, 170 14, 185 24 C 172 38, 128 38, 115 24 Z"
          fill="#050507"
        />

        {/* Inner Brand Tag on Back Collar */}
        <rect x="140" y="24" width="20" height="8" rx="1" fill="#222" stroke="#444" strokeWidth="0.5" />
        <text x="150" y="30" fontSize="4.5" fill="#aaa" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
          L • ICONIC
        </text>

        {/* ================= 2. THE T-SHIRT CLOTH (PURE GARMENT SILHOUETTE) ================= */}
        <g clipPath={`url(#${uniqueId})`}>
          {/* Base Fabric Color */}
          <rect x="0" y="0" width="300" height="340" fill={model.baseColor} />

          {/* Realistic Fabric Lighting & Shading */}
          <rect x="0" y="0" width="300" height="340" fill={`url(#fabricShade-${model.id})`} />
          <rect x="0" y="0" width="300" height="340" fill={`url(#chestLight-${model.id})`} />

          {/* Left Sleeve Crease Shadow */}
          <path d="M 45 48 L 72 126 L 55 154 Z" fill="#000000" opacity="0.25" />
          {/* Right Sleeve Crease Shadow */}
          <path d="M 255 48 L 228 126 L 245 154 Z" fill="#000000" opacity="0.25" />

          {/* Underarm Drape Folds */}
          <path d="M 72 126 Q 90 200 72 300" stroke="#000000" strokeWidth="3" opacity="0.2" fill="none" />
          <path d="M 228 126 Q 210 200 228 300" stroke="#000000" strokeWidth="3" opacity="0.2" fill="none" />

          {/* ================= 3. STREETWEAR GRAPHIC ARTWORK PRINTED ON CHEST ================= */}
          <g transform="translate(150, 165)">
            {/* Japanese Kanji Accent Pill at top */}
            <text
              x="0"
              y="-75"
              fill={model.accentColor}
              fontSize="7.5"
              fontWeight="900"
              letterSpacing="3"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {graphic.kanji}
            </text>

            {/* Central Graphic Artwork Motifs */}
            {graphic.artType === 'gothic-skull' && (
              <g transform="translate(0, -30)">
                <circle cx="0" cy="0" r="28" fill="none" stroke={model.accentColor} strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M -18 -8 L 0 -24 L 18 -8 L 12 18 L -12 18 Z" fill={textColor} opacity="0.85" />
                <circle cx="-6" cy="-2" r="3" fill={model.baseColor} />
                <circle cx="6" cy="-2" r="3" fill={model.baseColor} />
                <path d="M -5 10 L 5 10" stroke={model.baseColor} strokeWidth="2" />
              </g>
            )}

            {graphic.artType === 'cyber-kanji' && (
              <g transform="translate(0, -30)">
                <rect x="-24" y="-24" width="48" height="48" fill="none" stroke={model.accentColor} strokeWidth="2" />
                <path d="M -16 -16 L 16 16 M -16 16 L 16 -16" stroke={model.accentColor} strokeWidth="1" opacity="0.5" />
                <rect x="-14" y="-14" width="28" height="28" fill={textColor} opacity="0.9" />
                <circle cx="0" cy="0" r="5" fill={model.accentColor} />
              </g>
            )}

            {graphic.artType === 'anime-eyes' && (
              <g transform="translate(0, -28)">
                {/* Cyberpunk Manga Eyes Bar */}
                <rect x="-35" y="-12" width="70" height="24" fill="#000000" rx="3" />
                <path d="M -30 -3 Q -18 -10 -6 -2 Q -18 3 -30 -3 Z" fill="#ffffff" />
                <circle cx="-18" cy="-3" r="3.5" fill={model.accentColor} />
                <path d="M 6 -2 Q 18 -10 30 -3 Q 18 3 6 -2 Z" fill="#ffffff" />
                <circle cx="18" cy="-3" r="3.5" fill={model.accentColor} />
                <text x="0" y="8" fontSize="4.5" fill="#ffffff" textAnchor="middle" fontWeight="bold">TOKYO</text>
              </g>
            )}

            {graphic.artType === 'angel-statue' && (
              <g transform="translate(0, -32)">
                {/* Neo-Renaissance Angel Wings Silhouette */}
                <path
                  d="M 0 -22 C -18 -32, -38 -15, -28 10 C -20 25, 0 35, 0 35 C 0 35, 20 25, 28 10 C 38 -15, 18 -32, 0 -22 Z"
                  fill="none"
                  stroke={model.accentColor}
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-6" r="14" fill={textColor} opacity="0.8" />
                <path d="M -12 25 L 12 25" stroke={textColor} strokeWidth="2" />
              </g>
            )}

            {graphic.artType === 'minimal-box' && (
              <g transform="translate(0, -28)">
                <rect x="-34" y="-20" width="68" height="40" fill="none" stroke={textColor} strokeWidth="1.5" />
                <rect x="-30" y="-16" width="60" height="32" fill={textColor} opacity="0.1" />
                <text x="0" y="2" fill={textColor} fontSize="8" fontWeight="900" letterSpacing="2" textAnchor="middle">
                  DISCIPLINE
                </text>
                <text x="0" y="10" fill={model.accentColor} fontSize="4.5" fontWeight="bold" textAnchor="middle">
                  RAW 280 GSM
                </text>
              </g>
            )}

            {graphic.artType === 'skate-star' && (
              <g transform="translate(0, -28)">
                <circle cx="0" cy="0" r="24" fill={model.accentColor} opacity="0.15" />
                <path
                  d="M 0 -22 L 6 -6 L 22 -6 L 10 4 L 15 20 L 0 10 L -15 20 L -10 4 L -22 -6 L -6 -6 Z"
                  fill={textColor}
                  opacity="0.88"
                />
              </g>
            )}

            {/* Main Headline Typography on Chest */}
            <text
              x="0"
              y="16"
              fill={textColor}
              fontSize="12.5"
              fontWeight="900"
              letterSpacing="2.5"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {graphic.title}
            </text>

            {/* Sub-label Specification */}
            <text
              x="0"
              y="29"
              fill={subColor}
              fontSize="5.5"
              fontWeight="700"
              letterSpacing="1.8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {graphic.sub}
            </text>

            {/* Bottom Barcode */}
            <g transform="translate(-25, 42)" opacity="0.6">
              <rect x="0" y="0" width="2" height="10" fill={textColor} />
              <rect x="4" y="0" width="1" height="10" fill={textColor} />
              <rect x="7" y="0" width="3" height="10" fill={textColor} />
              <rect x="12" y="0" width="1" height="10" fill={textColor} />
              <rect x="15" y="0" width="4" height="10" fill={textColor} />
              <rect x="21" y="0" width="1" height="10" fill={textColor} />
              <rect x="24" y="0" width="2" height="10" fill={textColor} />
              <rect x="28" y="0" width="3" height="10" fill={textColor} />
              <rect x="33" y="0" width="1" height="10" fill={textColor} />
              <rect x="36" y="0" width="2" height="10" fill={textColor} />
              <rect x="40" y="0" width="4" height="10" fill={textColor} />
              <rect x="46" y="0" width="2" height="10" fill={textColor} />
            </g>
          </g>

          {/* ================= 4. CREW NECK RIBBED COLLAR BAND ================= */}
          <path
            d="M 115 24 C 128 42, 172 42, 185 24 C 174 46, 126 46, 115 24 Z"
            fill={model.baseColor}
            stroke="#000000"
            strokeWidth="0.8"
          />
          {/* Collar Rib Highlight Stripe */}
          <path
            d="M 117 26 C 129 41, 171 41, 183 26"
            stroke="#ffffff"
            strokeWidth="0.75"
            strokeOpacity={isLight ? "0.3" : "0.15"}
            fill="none"
          />

          {/* Bottom Hem Stitch Line */}
          <path
            d="M 74 304 C 100 309, 200 309, 226 304"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity={isLight ? "0.2" : "0.1"}
            strokeDasharray="2 1.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default function FloatingRackHero({
  title = 'THE SUSPENDED RACK',
  subtitle = 'PHYSICAL ARCHIVE • 3D GARMENT EXHIBIT',
}) {
  const { addToCart } = useCart();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [isFlipped, setIsFlipped] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Keyboard shortcut: ESC returns tee to rack
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

  // Subtle interactive 3D rack parallax from cursor
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleTshirtClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setIsFlipped(false);
      setAddedSuccess(false);
    } else {
      setSelectedIndex(index);
      setIsFlipped(false);
      setAddedSuccess(false);
    }
  };

  const handleClose = () => {
    setSelectedIndex(null);
    setIsFlipped(false);
    setAddedSuccess(false);
  };

  const handleAddToCart = (tee) => {
    addToCart(
      {
        id: tee.id,
        name: tee.name,
        price: tee.price,
        image: '/images/prod_fallenangel.jpg',
      },
      tee.colorName,
      selectedSize,
      1
    );
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const selectedTee = selectedIndex !== null ? TSHIRT_MODELS[selectedIndex] : null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[95vh] sm:min-h-screen bg-[#070709] text-white overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-10 select-none border-b border-white/10"
      style={{ perspective: 1800 }}
    >
      {/* ================= 1. LUXURY STUDIO STAGE ATMOSPHERE ================= */}
      {/* Overhead Volumetric Spotlight beaming down directly onto the rail */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[600px] pointer-events-none transition-all duration-700 ease-out"
        style={{
          background:
            selectedIndex !== null
              ? 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 75%)'
              : 'radial-gradient(ellipse 60% 48% at 50% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(59, 130, 246, 0.06) 45%, transparent 75%)',
        }}
      />

      {/* Cyberpunk Ambient Darkroom Glows */}
      <div className="absolute top-1/4 -left-36 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -right-36 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Sleek Faded Runway Watermark in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span
          className="text-[14vw] font-black tracking-tighter text-white/[0.02] uppercase whitespace-nowrap transition-transform duration-700 ease-out font-sans"
          style={{
            transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -20}px, 0)`,
          }}
        >
          ICONIC 2026 ARCHIVE
        </span>
      </div>

      {/* Ground Perspective Grid Floor with Floor Reflection */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 pointer-events-none opacity-20"
        style={{
          background:
            'linear-gradient(to top, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: 'perspective(450px) rotateX(68deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* ================= 2. HEADER INTRO ================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full text-center space-y-3">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-[11px] font-bold tracking-[0.25em] text-gray-300 uppercase shadow-2xl">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>{subtitle}</span>
        </div>

        {/* Section Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none font-sans drop-shadow-2xl">
          {title}
        </h1>

        {/* Dynamic Instructional Subtitle */}
        <p className="text-xs sm:text-sm text-gray-400 font-normal max-w-xl mx-auto leading-relaxed">
          {selectedIndex !== null ? (
            <span className="text-blue-400 font-semibold tracking-wide animate-pulse">
              Inspecting Piece #{selectedIndex + 1}: {selectedTee?.name}. Click again or hit ESC to return to rack.
            </span>
          ) : (
            <span>
              Real heavyweight streetwear silhouettes hanging freely in 3D air.{' '}
              <strong className="text-white">Click any garment</strong> to part the rack &amp; rotate it front-facing.
            </span>
          )}
        </p>
      </div>

      {/* ================= 3. THE 3D SUSPENDED CLOTHING RACK ================= */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-2 sm:px-6 my-auto pt-10 pb-4">
        {/* Backdrop overlay to dismiss active inspection */}
        {selectedIndex !== null && (
          <div
            onClick={handleClose}
            className="fixed inset-0 z-10 cursor-pointer"
            title="Click outside to return garment to rack"
          />
        )}

        {/* ----------------- METALLIC STAINLESS STEEL POLE / RAIL ----------------- */}
        <div className="relative w-full max-w-5xl mx-auto mb-[-14px] z-20">
          {/* Ceiling Aircraft Suspension Cables */}
          <div className="absolute -top-36 left-24 w-[1.5px] h-36 bg-gradient-to-b from-white/10 via-white/40 to-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          <div className="absolute -top-36 right-24 w-[1.5px] h-36 bg-gradient-to-b from-white/10 via-white/40 to-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

          {/* Stainless Mounting Brackets */}
          <div className="absolute -top-2 left-22 w-5 h-5 rounded-full bg-slate-300 border border-white shadow-[0_0_12px_rgba(255,255,255,0.6)] z-30" />
          <div className="absolute -top-2 right-22 w-5 h-5 rounded-full bg-slate-300 border border-white shadow-[0_0_12px_rgba(255,255,255,0.6)] z-30" />

          {/* The Rail Bar (Brushed Titanium Tube) */}
          <div
            className="w-full h-3 rounded-full relative shadow-[0_15px_30px_rgba(0,0,0,0.95),0_0_20px_rgba(255,255,255,0.2)] overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #f4f4f5 0%, #ffffff 35%, #71717a 65%, #18181b 100%)',
            }}
          >
            <div className="absolute top-0.5 inset-x-0 h-[1px] bg-white/95" />
            <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-black/70" />
          </div>

          {/* Precision End Caps */}
          <div className="absolute -left-3 -top-1 w-5 h-5 rounded-full bg-zinc-900 border-2 border-slate-300 shadow-[0_0_14px_rgba(59,130,246,0.9)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full bg-zinc-900 border-2 border-slate-300 shadow-[0_0_14px_rgba(59,130,246,0.9)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>
        </div>

        {/* ----------------- 3D GARMENTS HANGING FREELY ON THE RAIL ----------------- */}
        <div
          className="relative w-full max-w-5xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${mousePos.x * 6}deg) rotateX(${mousePos.y * -3}deg)`,
            transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {TSHIRT_MODELS.map((model, index) => {
            const isSelected = selectedIndex === index;
            const hasSelection = selectedIndex !== null;

            // 3D positioning calculations:
            let xOffset = 0;
            let zOffset = 0;
            let yOffset = 0;
            let rotateYAngle = -62; // True showroom sideways rack perspective angle
            let itemScale = 1;
            let itemOpacity = 1;
            let filterStyle = 'none';

            if (hasSelection) {
              if (isSelected) {
                // The clicked t-shirt rotates to front flat (0deg) or 180deg (back view), moves forward in 3D, scales up
                xOffset = 0;
                zOffset = 290;
                yOffset = -22;
                rotateYAngle = isFlipped ? 180 : 0;
                itemScale = 1.38;
                itemOpacity = 1;
                filterStyle = 'none';
              } else if (index < selectedIndex) {
                // T-shirts to the left: slide smoothly apart to the left and push backward
                const dist = selectedIndex - index;
                xOffset = -(150 + dist * 42);
                zOffset = -150 - dist * 25;
                yOffset = 8;
                rotateYAngle = -72;
                itemScale = 0.76;
                itemOpacity = 0.22;
                filterStyle = 'blur(2px) grayscale(40%)';
              } else {
                // T-shirts to the right: slide smoothly apart to the right and push backward
                const dist = index - selectedIndex;
                xOffset = 150 + dist * 42;
                zOffset = -150 - dist * 25;
                yOffset = 8;
                rotateYAngle = -45;
                itemScale = 0.76;
                itemOpacity = 0.22;
                filterStyle = 'blur(2px) grayscale(40%)';
              }
            } else {
              // Idle state on the rack: spaced along the horizontal pole
              const centerIndex = (TSHIRT_MODELS.length - 1) / 2;
              xOffset = (index - centerIndex) * 105;
              zOffset = -(Math.abs(index - centerIndex) * 14);
              rotateYAngle = -62;
              itemScale = 1;
              itemOpacity = 1;
              filterStyle = 'none';
            }

            // Continuous ambient air sway physics: gentle sine waves with staggered phase offsets
            const breezeDur = 4.4 + (index % 3) * 0.9;
            const breezeDelay = index * 0.35;

            return (
              <motion.div
                key={model.id}
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
                {/* Ribbon Badge Pill Floating above garment */}
                <div
                  className="mb-1 pointer-events-none transition-all duration-300"
                  style={{
                    opacity: isSelected ? 1 : 0.8,
                    transform: isSelected ? 'scale(1.1) translateY(-6px)' : 'scale(0.85)',
                  }}
                >
                  <span
                    className={`px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider uppercase border backdrop-blur-md ${model.badgeColor}`}
                  >
                    {model.badge}
                  </span>
                </div>

                {/* THE ACTUAL T-SHIRT GARMENT (NO CARDS!) */}
                <RealTshirtGarment
                  model={model}
                  isSelected={isSelected}
                  isFlipped={isFlipped && isSelected}
                />

                {/* Garment Quick Label (idle state) */}
                {!isSelected && (
                  <div className="mt-2 text-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-black uppercase text-white tracking-wider max-w-[140px] truncate">
                      {model.name.replace(' TEE', '')}
                    </p>
                    <p className="text-[10px] font-bold text-gray-300 mt-0.5">₹{model.price}</p>
                  </div>
                )}

                {/* Real Floor Shadow matching garment width */}
                <div
                  className="w-36 h-4 rounded-full bg-black/80 blur-md mt-4 transition-all duration-300 pointer-events-none"
                  style={{
                    transform: isSelected ? 'scale(1.6)' : 'scale(0.9)',
                    opacity: isSelected ? 0.9 : 0.45,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ----------------- FLOATING INSPECTION & PURCHASE CARD ----------------- */}
        <AnimatePresence>
          {selectedTee && (
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
                      {selectedTee.fabric}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                      {selectedTee.fit}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-tight font-sans">
                    {selectedTee.name}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                    Colorway: <span className="text-white font-bold">{selectedTee.colorName}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  {/* 3D Flip to Front / Back */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(!isFlipped);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                      isFlipped
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:text-white border-white/15'
                    }`}
                    title={isFlipped ? 'View Front Print' : 'View Back Print'}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isFlipped ? 'Front View' : 'Back View'}</span>
                  </button>

                  {/* Close / Return to Rack */}
                  <button
                    onClick={handleClose}
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
                    ₹{selectedTee.price}
                  </span>
                  {selectedTee.originalPrice && selectedTee.originalPrice > selectedTee.price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{selectedTee.originalPrice}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-emerald-400">
                    SAVE {Math.round(((selectedTee.originalPrice - selectedTee.price) / selectedTee.originalPrice) * 100)}%
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

              {/* Action Buttons: Add to Bag & Return */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(selectedTee);
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
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
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
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev === null ? 0 : prev > 0 ? prev - 1 : TSHIRT_MODELS.length - 1));
              setIsFlipped(false);
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 text-xs font-bold tracking-wider uppercase backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREV GARMENT</span>
          </button>

          {/* Quick Counter Indicator Dots */}
          <div className="flex items-center space-x-2">
            {TSHIRT_MODELS.map((_, dotIdx) => (
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
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev === null ? 0 : prev < TSHIRT_MODELS.length - 1 ? prev + 1 : 0));
              setIsFlipped(false);
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 text-xs font-bold tracking-wider uppercase backdrop-blur-md"
          >
            <span className="hidden sm:inline">NEXT GARMENT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 4. BOTTOM LUXURY FABRIC SPECS ================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 px-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md text-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">HEAVYWEIGHT TERRY</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">240–280 GSM</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">STREETWEAR SILHOUETTE</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">DROP SHOULDER BOXY</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">SCREENPRINT TECH</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">HIGH-DENSITY PUFF INK</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">ARCHIVE RUN</p>
            <p className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">LIMITED EDITION CAPSULE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
