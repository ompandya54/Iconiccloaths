import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import { AdminCredentials } from '@/lib/store';
import { signJWT } from '@/lib/jwt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    let adminUser = null;

    if (conn) {
      adminUser = await Admin.findOne({ username }).lean();

      if (!adminUser && username === 'admin') {
        adminUser = await Admin.create({
          username: 'admin',
          email: 'admin@iconiccloths.com',
          password: 'admin123',
          role: 'superadmin',
        });
      }
    }

    const isValidUser =
      (adminUser && adminUser.password === password) ||
      (username === AdminCredentials.username && password === AdminCredentials.password);

    if (!isValidUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    // Generate JWT Token using single JWT_SECRET
    const tokenPayload = {
      id: adminUser?._id ? adminUser._id.toString() : 'admin-1',
      username: adminUser?.username || 'admin',
      role: adminUser?.role || 'superadmin',
    };

    const token = signJWT(tokenPayload, 7 * 24 * 60 * 60); // 7 days expiration

    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful',
      user: {
        username: tokenPayload.username,
        email: adminUser?.email || 'admin@iconiccloths.com',
        role: tokenPayload.role,
      },
      token,
    });

    // Set secure HTTP-only admin_token cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin Auth API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication server error: ' + error.message },
      { status: 500 }
    );
  }
}
