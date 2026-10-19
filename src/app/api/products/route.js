import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { initialProducts } from '@/lib/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const theme = searchParams.get('theme');
    const fit = searchParams.get('fit');
    const material = searchParams.get('material');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
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

    // Build MongoDB Query with comprehensive filter support
    let query = {};
    if (category && category !== 'all') {
      const categories = category.split(',').map((c) => c.trim().toLowerCase());
      query.category = categories.length > 1 ? { $in: categories } : categories[0];
    }
    if (subcategory && subcategory !== 'all') {
      const subcategories = subcategory.split(',').map((s) => s.trim().toLowerCase());
      query.subcategory = subcategories.length > 1 ? { $in: subcategories } : { $regex: new RegExp(`^${subcategories[0]}$`, 'i') };
    }
    if (size) {
      const sizes = size.split(',').map((s) => s.trim().toUpperCase());
      query.sizes = { $in: sizes };
    }
    if (color) {
      const colors = color.split(',').map((c) => c.trim());
      query['colors.name'] = { $in: colors.map((c) => new RegExp(`^${c}$`, 'i')) };
    }
    if (theme) {
      const themes = theme.split(',').map((t) => t.trim());
      query.theme = { $in: themes.map((t) => new RegExp(`^${t}$`, 'i')) };
    }
    if (fit) {
      const fits = fit.split(',').map((f) => f.trim());
      query.fit = { $in: fits.map((f) => new RegExp(f, 'i')) };
    }
    if (material) {
      const materials = material.split(',').map((m) => m.trim());
      query.material = { $in: materials.map((m) => new RegExp(m, 'i')) };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'bestsellers') {
      sortOptions = { isBestseller: -1, rating: -1 };
    }

    let products = await Product.find(query).sort(sortOptions).lean();

    // If MongoDB is connected but collection is empty, auto-seed default products once into MongoDB
    if ((!products || products.length === 0) && (!category || category === 'all') && !search) {
      const docs = initialProducts.map((p) => ({
        name: p.name,
        slug: p.name.toLowerCase().replace(/ /g, '-'),
        category: p.category,
        categoryLabel: p.categoryLabel || 'Oversized Streetwear',
        subcategory: p.subcategory || 'Graphic Tees',
        theme: p.theme || 'Street',
        fit: p.fit || 'Oversized Fit',
        material: p.material || '100% Cotton (240 GSM)',
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
      products = await Product.find(query).sort(sortOptions).lean();
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
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: body.category.toLowerCase(),
      categoryLabel: body.categoryLabel || body.category,
      subcategory: body.subcategory || '',
      theme: body.theme || body.design || '',
      fit: body.fit || 'Oversized Fit',
      material: body.material || '100% Cotton (240 GSM)',
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
