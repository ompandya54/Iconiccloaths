import { NextResponse } from 'next/server';

/**
 * User Middleware: Handles customer sessions, cart tokens, and user routes
 */
export async function userMiddleware(request) {
  const response = NextResponse.next();
  
  // Ensure customer guest session ID exists in cookies for cart tracking
  let userSession = request.cookies.get('iconic_session')?.value;

  if (!userSession) {
    userSession = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    response.cookies.set('iconic_session', userSession, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  }

  return response;
}

export default userMiddleware;
