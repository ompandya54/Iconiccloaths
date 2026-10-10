'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar({ cartCount = 0, onOpenCart, onOpenSearch, activePage = 'home' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inlineSearchActive, setInlineSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchFocus = () => {
    setInlineSearchActive(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setInlineSearchActive(false);
    }
  };

  const handleMouseLeave = () => {
    if (!searchQuery && document.activeElement !== searchInputRef.current) {
      setInlineSearchActive(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/20 to-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          
          {/* Stacked Logo: ICONIC above CLOTHS with smooth scroll slide animation */}
          <Link href="/" className="flex flex-col items-start group flex-shrink-0 z-10">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.25em] text-white leading-none group-hover:text-gray-300 transition-all duration-300 uppercase">
              ICONIC
            </span>
            
            {/* Animated CLOTHS subtext: collapses & slides up smoothly on scroll */}
            <span
              className={`font-sans text-[9px] sm:text-[11px] font-medium tracking-[0.45em] text-gray-300 leading-tight uppercase w-full flex justify-between transition-all duration-300 ease-in-out overflow-hidden ${
                scrolled
                  ? 'max-h-0 opacity-0 -translate-y-1 mt-0 pointer-events-none'
                  : 'max-h-5 opacity-100 translate-y-0 mt-1'
              }`}
            >
              <span>C</span><span>L</span><span>O</span><span>T</span><span>H</span><span>S</span>
            </span>
          </Link>

          {/* Desktop Navigation (ABSOLUTELY CENTERED so it NEVER shifts when search expands!) */}
          <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2 z-10">
            <Link
              href="/"
              className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
                activePage === 'home'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-300 hover:text-white border-b-2 border-transparent hover:border-gray-500'
              }`}
            >
              HOME
            </Link>
            <Link
              href="/shop"
              className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
                activePage === 'shop'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-300 hover:text-white border-b-2 border-transparent hover:border-gray-500'
              }`}
            >
              SHOP
            </Link>
            <Link
              href="/#collections"
              className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-gray-500"
            >
              COLLECTIONS
            </Link>
            <Link
              href="/#story"
              className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-gray-500"
            >
              ABOUT
            </Link>
            <Link
              href="/#footer"
              className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-gray-500"
            >
              CONTACT
            </Link>
          </nav>

          {/* Action Icons & Expandable Search (Right side, z-10) */}
          <div className="flex items-center space-x-4 sm:space-x-5 z-10">
            
            {/* Smooth Extending Search Box */}
            <div
              onMouseEnter={() => setInlineSearchActive(true)}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-center"
            >
              <div
                className={`flex items-center transition-all duration-300 ease-in-out rounded-full ${
                  inlineSearchActive
                    ? 'w-44 sm:w-56 bg-white/10 border border-white/20 px-3 py-1.5'
                    : 'w-8 bg-transparent border border-transparent p-1'
                }`}
              >
                <button
                  onClick={() => {
                    setInlineSearchActive(true);
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Search"
                  className="text-white hover:text-gray-300 transition-colors flex-shrink-0"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </button>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onOpenSearch(searchQuery);
                    }
                  }}
                  placeholder="Search..."
                  className={`bg-transparent text-xs text-white placeholder-gray-400 outline-none ml-2.5 w-full transition-opacity duration-200 ${
                    inlineSearchActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                />
              </div>
            </div>

            <a
              href="#account"
              aria-label="Account"
              className="hidden sm:block text-white hover:text-gray-300 transition-colors p-1"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </a>

            <button
              onClick={onOpenCart}
              aria-label="Cart"
              className="relative text-white hover:text-gray-300 transition-colors p-1"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1 -right-1 bg-white text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center space-y-8 md:hidden text-center transition-all">
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/"
            className="text-2xl font-bold uppercase tracking-widest text-white"
          >
            HOME
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/shop"
            className="text-2xl font-bold uppercase tracking-widest text-gray-400 hover:text-white"
          >
            SHOP
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/#collections"
            className="text-2xl font-bold uppercase tracking-widest text-gray-400 hover:text-white"
          >
            COLLECTIONS
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/#story"
            className="text-2xl font-bold uppercase tracking-widest text-gray-400 hover:text-white"
          >
            ABOUT
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/#footer"
            className="text-2xl font-bold uppercase tracking-widest text-gray-400 hover:text-white"
          >
            CONTACT
          </Link>
        </div>
      )}
    </>
  );
}
