'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';

export default function StoreShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If on /admin, do not render public storefront navbar, footer, or cart drawer
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public storefront shell: Navbar and CartDrawer mount ONCE at root level!
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </>
  );
}

