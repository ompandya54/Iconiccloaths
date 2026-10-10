import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'iconic_secret_jwt_key_2026';

/**
 * Admin Middleware: Protects /admin pages and /api/admin routes
 */
export async function adminMiddleware(request) {
  const { pathname } = request.nextUrl;

  // Allow login endpoint without auth
  if (pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get('admin_token')?.value;
  const authHeader = request.headers.get('authorization');
  const token = tokenCookie || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  // If token is missing
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin authentication token required' },
        { status: 401 }
      );
    }
    // For admin pages, if at /admin, let login UI render; if at subroute, redirect to /admin
    if (pathname !== '/admin') {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Verify token signature with JWT_SECRET
  const decoded = verifyJWT(token);

  if (!decoded) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }
    if (pathname !== '/admin') {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default adminMiddleware;
