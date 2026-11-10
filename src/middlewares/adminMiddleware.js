import { NextResponse } from 'next/server';

/**
 * Admin Middleware: Allows App Router layout.js to manage authentication
 */
export async function adminMiddleware(request) {
  return NextResponse.next();
}

export default adminMiddleware;
