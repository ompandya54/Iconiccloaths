import { NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Security Validation 1: MIME Type Verification (Only Images allowed)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, PNG, WEBP, and GIF images are permitted.' },
        { status: 400 }
      );
    }

    // Security Validation 2: File Size Limit (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum 5MB limit.' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer -> Base64 Data URI for server-side upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary securely
    const folder = formData.get('folder') || 'iconiccloaths/products';
    const result = await uploadToCloudinary(base64Data, { folder });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('Error in /api/upload POST route:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicIdParam = searchParams.get('public_id');
    const urlParam = searchParams.get('url');

    const publicId = publicIdParam || extractPublicIdFromUrl(urlParam);

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Must provide public_id or valid Cloudinary url parameter' },
        { status: 400 }
      );
    }

    const result = await deleteFromCloudinary(publicId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted from Cloudinary successfully',
      public_id: publicId,
      result,
    });
  } catch (error) {
    console.error('Error in /api/upload DELETE route:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image deletion failed' },
      { status: 500 }
    );
  }
}
