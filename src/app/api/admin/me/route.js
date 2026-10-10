import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';

/**
 * GET /api/admin/me - Verify active admin JWT session & return user profile
 */
export async function GET(request) {
  try {
    const tokenCookie = request.cookies.get('admin_token')?.value;
    const authHeader = request.headers.get('authorization');
    const token = tokenCookie || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'No session token provided' },
        { status: 401 }
      );
    }

    // Verify JWT Signature & Expiry
    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Token invalid or expired' },
        { status: 401 }
      );
    }

    // Optionally fetch fresh user data from DB if connected
    const conn = await connectToDatabase();
    let adminUser = null;

    if (conn && decoded.id && decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
      adminUser = await Admin.findById(decoded.id).select('-password').lean();
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: decoded.id || 'admin-1',
        username: adminUser?.username || decoded.username || 'admin',
        email: adminUser?.email || 'admin@iconiccloths.com',
        role: adminUser?.role || decoded.role || 'superadmin',
      },
    });
  } catch (error) {
    console.error('Verify user API error:', error);
    return NextResponse.json(
      { success: false, authenticated: false, message: error.message },
      { status: 500 }
    );
  }
}
