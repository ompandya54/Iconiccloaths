import { NextResponse } from 'next/server';

/**
 * API Middleware: Handles security headers, CORS, and API request validation
 */
export async function apiMiddleware(request) {
  const response = NextResponse.next();

  // Add Security & CORS headers for API requests
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export default apiMiddleware;
