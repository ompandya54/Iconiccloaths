'use client';

import Link from 'next/link';
import { Instagram, Youtube, Mail, MapPin } from 'lucide-react';

// Custom X (formerly Twitter) Icon SVG
function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#050507] border-t border-white/10 pt-16 pb-10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid: Brand Column + 3 Link Columns + Connect Column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-xs">
          
          {/* Brand & Address Column (Left - 4 Cols) */}
          <div className="md:col-span-4 space-y-4 pr-4">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white leading-none group-hover:text-gray-300 transition-colors uppercase">
                ICONIC
              </span>
              <span className="font-sans text-[11px] font-medium tracking-[0.45em] text-gray-400 leading-tight mt-1 uppercase">
                CLOTHS
              </span>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              MORE THAN JUST A T-SHIRT. High-grade luxury streetwear engineered for those who challenge the status quo.
            </p>

            {/* Email & Location Address Section */}
            <div className="pt-2 space-y-2 text-xs text-gray-300">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <a href="mailto:support@iconiccloths.com" className="hover:text-white transition-colors">
                  support@iconiccloths.com
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>Gandhinagar, Gujarat, India</span>
              </div>
            </div>
          </div>

          {/* Shop Column (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">SHOP</h5>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="/shop" className="hover:text-white transition-colors">Oversized Tees</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Graphic Tees</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Essentials</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* About Column (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">ABOUT</h5>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="/#story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/#story" className="hover:text-white transition-colors">Manifesto</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press & Lookbook</Link></li>
            </ul>
          </div>

          {/* Help Column (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">HELP</h5>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Connect Column (2 Cols) - Only Instagram, X, YouTube */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">CONNECT</h5>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-black hover:bg-white hover:border-white hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-black hover:bg-white hover:border-white hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-black hover:bg-white hover:border-white hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Balanced Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} ICONIC CLOTHS. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
