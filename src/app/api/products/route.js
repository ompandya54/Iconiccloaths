import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { initialProducts } from '@/lib/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection failed. Please ensure MongoDB is running and MONGODB_URI is correctly configured.',
        },
        { status: 500 }
      );
    }

    // Build MongoDB Query
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let products = await Product.find(query).sort({ createdAt: -1 }).lean();

    // If MongoDB is connected but collection is empty, auto-seed default products once into MongoDB
    if ((!products || products.length === 0) && (!category || category === 'all') && !search) {
      const docs = initialProducts.map((p) => ({
        name: p.name,
        slug: p.name.toLowerCase().replace(/ /g, '-'),
        category: p.category,
        categoryLabel: p.categoryLabel || 'Oversized Streetwear',
        price: p.price,
        originalPrice: Math.round(p.price * 1.35),
        badge: p.badge || 'BESTSELLER',
        sizes: p.sizes || ['S', 'M', 'L', 'XL'],
        colors: p.colors || [
          { name: 'Black', hex: '#0a0a0a', image: p.image || '/images/prod_minimal.jpg' },
        ],
        stock: 50,
        rating: 4.9,
        description: 'Luxury heavyweight streetwear crafted from 100% organic cotton.',
      }));
      await Product.insertMany(docs);
      products = await Product.find(query).sort({ createdAt: -1 }).lean();
    }

    // Map Mongo _id to id string for frontend compatibility
    const formatted = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      formattedPrice: `₹${p.price.toLocaleString('en-IN')}`,
    }));

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      count: formatted.length,
      products: formatted,
    });
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const doc = await Product.create({
      name: body.name,
      slug: body.name.toLowerCase().replace(/ /g, '-'),
      category: body.category,
      categoryLabel: body.categoryLabel || body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : Math.round(Number(body.price) * 1.35),
      badge: body.badge || 'NEW DROP',
      sizes: body.sizes || ['S', 'M', 'L', 'XL'],
      colors: body.colors || [
        { name: 'Black', hex: '#0a0a0a', image: body.image || '/images/prod_minimal.jpg' },
      ],
      stock: Number(body.stock) || 50,
      description: body.description || 'Built for the bold streetwear enthusiast.',
    });

    const newProduct = {
      ...doc.toObject(),
      id: doc._id.toString(),
      formattedPrice: `₹${doc.price.toLocaleString('en-IN')}`,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully in MongoDB',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product in MongoDB:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
