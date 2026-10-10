import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Admin from '@/models/Admin';
import Category from '@/models/Category';
import { initialProducts, initialOrders, AdminCredentials } from '@/lib/store';

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

    // 2. Seed Products
    await Product.deleteMany({});
    const productDocs = initialProducts.map((p) => ({
      name: p.name,
      slug: p.name.toLowerCase().replace(/ /g, '-'),
      category: p.category,
      categoryLabel: p.categoryLabel,
      price: p.price,
      badge: p.badge,
      sizes: p.sizes,
      colors: p.colors,
      stock: 50,
      rating: 4.9,
      description: 'Built for the bold. Heavyweight luxury cotton streetwear.',
      isBestseller: p.badge === 'BESTSELLER',
    }));
    const createdProducts = await Product.insertMany(productDocs);

    // 3. Seed Orders
    await Order.deleteMany({});
    const orderDocs = initialOrders.map((o) => ({
      orderId: o.id,
      customer: {
        name: o.customer,
        email: o.email,
        phone: '+91 9876543210',
        address: 'Gandhinagar, Gujarat',
      },
      items: [
        {
          productId: createdProducts[0]._id.toString(),
          name: o.item,
          price: parseInt(o.amount.replace(/[^0-9]/g, '')) || 999,
          quantity: 1,
        },
      ],
      totalAmount: parseInt(o.amount.replace(/[^0-9]/g, '')) || 999,
      formattedAmount: o.amount,
      paymentMethod: 'COD',
      paymentStatus: 'Paid',
      status: o.status,
    }));
    const createdOrders = await Order.insertMany(orderDocs);

    // 4. Seed Categories
    await Category.deleteMany({});
    const categories = [
      { name: 'Oversized Tees', slug: 'oversized', itemCount: 12 },
      { name: 'Graphic Tees', slug: 'graphic', itemCount: 18 },
      { name: 'Essentials', slug: 'essentials', itemCount: 9 },
      { name: 'Collections', slug: 'collections', itemCount: 14 },
      { name: 'New Arrivals', slug: 'new-arrivals', itemCount: 7 },
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
