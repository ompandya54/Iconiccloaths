import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Admin from '@/models/Admin';
import Category from '@/models/Category';
import { ALL_PRODUCTS } from '@/data/products';
import { initialOrders, AdminCredentials } from '@/lib/store';

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please check MONGODB_URI.' },
        { status: 503 }
      );
    }

    // 1. Seed Admin
    await Admin.deleteMany({});
    const adminUser = await Admin.create({
      username: AdminCredentials.username,
      email: 'admin@iconiccloths.com',
      password: AdminCredentials.password,
      role: 'superadmin',
      token: AdminCredentials.token,
    });

    // 2. Seed Products with all filters (size, color, subcategory, theme, fit, material)
    await Product.deleteMany({});
    const productDocs = ALL_PRODUCTS.map((p) => ({
      name: p.name,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: p.category.toLowerCase(),
      categoryLabel: p.categoryLabel || 'Oversized Streetwear',
      subcategory: p.subcategory || 'Graphic Tees',
      theme: p.theme || 'Street',
      fit: p.fit || 'Oversized Fit',
      material: p.material || '100% French Terry (240 GSM)',
      price: p.price,
      originalPrice: Math.round(p.price * 1.35),
      badge: p.badge || 'BESTSELLER',
      sizes: p.sizes || ['S', 'M', 'L', 'XL'],
      colors: p.colors || [
        { name: 'Black', hex: '#0a0a0a', image: p.image || '/images/prod_minimal.jpg' },
      ],
      stock: 50,
      rating: 4.9,
      description: 'Luxury heavyweight streetwear crafted from premium organic cotton.',
      isBestseller: p.badge === 'BESTSELLER',
    }));
    const createdProducts = await Product.insertMany(productDocs);

    // 3. Seed Orders
    await Order.deleteMany({});
    const orderDocs = initialOrders.map((o, idx) => {
      const matchedProd = createdProducts[idx % createdProducts.length];
      const amountVal = parseInt(o.amount.replace(/[^0-9]/g, '')) || 999;
      return {
        orderId: o.id,
        customer: {
          name: o.customer,
          email: o.email,
          phone: '+91 9876543210',
          address: 'Gandhinagar, Gujarat',
        },
        items: [
          {
            productId: matchedProd._id.toString(),
            name: o.item || matchedProd.name,
            color: 'Black',
            size: 'L',
            price: matchedProd.price || amountVal,
            quantity: 1,
            image: matchedProd.colors?.[0]?.image || '/images/prod_minimal.jpg',
          },
        ],
        totalAmount: amountVal,
        formattedAmount: o.amount,
        paymentMethod: 'COD',
        paymentStatus: 'Paid',
        status: o.status,
      };
    });
    const createdOrders = await Order.insertMany(orderDocs);

    // 4. Seed Categories with Subcategories
    await Category.deleteMany({});
    const categories = [
      {
        name: 'Oversized Tees',
        slug: 'oversized',
        itemCount: 12,
        image: '/images/cat_oversized.jpg',
        subcategories: [
          { name: 'Back Print', slug: 'back-print' },
          { name: 'Typography', slug: 'typography' },
          { name: 'Acid Wash', slug: 'acid-wash' },
        ],
      },
      {
        name: 'Graphic Tees',
        slug: 'graphic',
        itemCount: 18,
        image: '/images/cat_graphic.jpg',
        subcategories: [
          { name: 'Front Graphic', slug: 'front-graphic' },
          { name: 'Vintage Art', slug: 'vintage-art' },
          { name: 'Abstract Print', slug: 'abstract-print' },
        ],
      },
      {
        name: 'Essentials',
        slug: 'essentials',
        itemCount: 9,
        image: '/images/cat_essentials.jpg',
        subcategories: [
          { name: 'Solid Essentials', slug: 'solid-essentials' },
          { name: 'Minimal Logo', slug: 'minimal-logo' },
        ],
      },
      {
        name: 'Collections',
        slug: 'collections',
        itemCount: 14,
        image: '/images/cat_collections.jpg',
        subcategories: [
          { name: 'Shadows Drop', slug: 'shadows-drop' },
          { name: 'Limited Edition', slug: 'limited-edition' },
        ],
      },
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
        itemCount: 7,
        image: '/images/cat_newarrivals.jpg',
        subcategories: [
          { name: 'Heavyweight Hoodie', slug: 'heavyweight-hoodie' },
          { name: 'Front Graphic', slug: 'front-graphic' },
        ],
      },
    ];
    await Category.insertMany(categories);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with initial products, orders, categories, and admin user.',
      seeded: {
        admin: adminUser.username,
        productsCount: createdProducts.length,
        ordersCount: createdOrders.length,
        categoriesCount: categories.length,
      },
    });
  } catch (error) {
    console.error('Database seeding error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: error.message },
      { status: 500 }
    );
  }
}
