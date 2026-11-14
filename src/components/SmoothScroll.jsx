'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Keep native scrolling on admin dashboard for table/form responsiveness
    if (pathname?.startsWith('/admin')) return;

    let lenis = null;
    let rafId = null;

    async function initLenis() {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default || LenisModule;

        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          infinite: false,
        });

        lenisRef.current = lenis;
        window.__lenis = lenis;

        function raf(time) {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.warn('Lenis smooth scroll: running in fallback mode. (Run npm install lenis to activate)', err);
      }
    }

    initLenis();

    // Smooth scroll for internal anchor links (e.g. #shop, #collections)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetEl, { offset: -70 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      if (lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, [pathname]);

  // Reset scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
