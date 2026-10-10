import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    } else {
      product = await Product.findOne({ slug: id }).lean();
    }

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        id: product._id.toString(),
        formattedPrice: `₹${product.price.toLocaleString('en-IN')}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ success: false, message: 'Invalid MongoDB ID format' }, { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully in MongoDB',
      product: {
        ...updated,
        id: updated._id.toString(),
        formattedPrice: `₹${updated.price.toLocaleString('en-IN')}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ success: false, message: 'Invalid MongoDB ID format' }, { status: 400 });
    }

    // Find product before deleting to clean up Cloudinary images
    const productToDelete = await Product.findById(id);
    if (!productToDelete) {
      return NextResponse.json({ success: false, message: 'Product not found in database' }, { status: 404 });
    }

    // Collect all image URLs from product (main image, color variant images, etc.)
    const imageUrls = [];
    if (productToDelete.image) imageUrls.push(productToDelete.image);
    if (productToDelete.colors && Array.isArray(productToDelete.colors)) {
      productToDelete.colors.forEach((c) => {
        if (c.image) imageUrls.push(c.image);
      });
    }

    // Delete associated Cloudinary images in background / parallel
    const deletePromises = imageUrls
      .map((url) => extractPublicIdFromUrl(url))
      .filter(Boolean)
      .map((pubId) => deleteFromCloudinary(pubId));

    if (deletePromises.length > 0) {
      await Promise.allSettled(deletePromises);
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product and associated Cloudinary images deleted successfully',
      id,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
