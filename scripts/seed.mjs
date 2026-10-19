import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Read .env.local or .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import Admin from '../src/models/Admin.js';
import Category from '../src/models/Category.js';
import { ALL_PRODUCTS } from '../src/data/products.js';
import { initialOrders, AdminCredentials } from '../src/lib/store.js';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env or .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected to MongoDB Atlas successfully!');

  // 1. Seed Admin
  console.log('Seeding Admin credentials...');
  await Admin.deleteMany({});
  const admin = await Admin.create({
    username: AdminCredentials.username,
    email: 'admin@iconiccloths.com',
    password: AdminCredentials.password,
    role: 'superadmin',
    token: AdminCredentials.token,
  });
  console.log(`✅ Admin created: ${admin.username} (Password: ${AdminCredentials.password})`);

  // 2. Seed Products
  console.log('Seeding Streetwear Products with all filter tags...');
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
  console.log(`✅ ${createdProducts.length} Products inserted with full filter metadata!`);

  // 3. Seed Categories
  console.log('Seeding Categories with subcategories...');
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
  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ ${createdCategories.length} Categories inserted!`);

  // 4. Seed Orders
  console.log('Seeding Sample Orders...');
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
  console.log(`✅ ${createdOrders.length} Orders inserted!`);

  console.log('\n==========================================');
  console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`📦 Products:   ${createdProducts.length}`);
  console.log(`📁 Categories: ${createdCategories.length}`);
  console.log(`📋 Orders:     ${createdOrders.length}`);
  console.log(`👤 Admin:      ${admin.username}`);
  console.log('==========================================');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err.message);
  process.exit(1);
});
