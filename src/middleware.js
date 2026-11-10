import { NextResponse } from 'next/server';
import { apiMiddleware } from '@/middlewares/apiMiddleware';
import { userMiddleware } from '@/middlewares/userMiddleware';

/**
 * Main Central Next.js Middleware Dispatcher
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets & internal Next.js files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 2. Admin pages: Let App Router layout.js handle client-side authentication guard
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // 3. Dispatch API requests to apiMiddleware
  if (pathname.startsWith('/api/')) {
    return await apiMiddleware(request);
  }

  // 4. Dispatch Customer / User requests to userMiddleware
  return await userMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
