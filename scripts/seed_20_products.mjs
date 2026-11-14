import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://omhpandya54_db_user:qsdew%400M@cluster0.n0p4etb.mongodb.net/date_app_db?retryWrites=true&w=majority';

const PRODUCTS_DATA = [
  // --- 8 PLAIN & HEAVYWEIGHT HOODIES ---
  {
    name: 'Essential Heavyweight Black Hoodie',
    slugBase: 'essential-heavyweight-black-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Relaxed Fit',
    theme: 'Streetwear',
    material: 'Heavy Fleece (380 GSM)',
    price: 2199,
    originalPrice: 3499,
    badge: 'BESTSELLER',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: true,
    stock: 65,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Vintage Charcoal', hex: '#232428' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_black.jpg',
    description: 'Custom heavyweight 380 GSM brushed fleece plain pullover hoodie. Engineered with double-layered hood, dropped shoulders, hidden side pockets, and durable ribbed hems for a luxury oversized drape.'
  },
  {
    name: 'Vintage Washed Charcoal Hoodie',
    slugBase: 'vintage-washed-charcoal-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Oversized Fit',
    theme: 'Vintage Nostalgia',
    material: 'Heavy Fleece (380 GSM)',
    price: 2299,
    originalPrice: 3699,
    badge: 'NEW DROP',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: true,
    stock: 50,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage Charcoal', hex: '#2b2b30' },
      { name: 'Acid Grey', hex: '#4a4b52' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_charcoal.jpg',
    description: 'Enzyme-washed distressed vintage charcoal hoodie crafted from ultra-dense 380 GSM loopknit fleece. Relaxed boxy streetwear silhouette with raw-cut aesthetics.'
  },
  {
    name: 'Minimalist Raw Oatmeal Hoodie',
    slugBase: 'minimalist-raw-oatmeal-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Boxy Cut',
    theme: 'Minimalist Typography',
    material: '100% French Terry Cotton (240 GSM)',
    price: 2199,
    originalPrice: 3299,
    badge: 'ESSENTIAL',
    isBestseller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Beige', hex: '#d9d3c7' },
      { name: 'Pure White', hex: '#f8f8fa' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_oatmeal.jpg',
    description: 'Clean unbranded luxury oatmeal hoodie made from 100% combed French Terry cotton. Heavyweight hand-feel, structured boxy hood without drawstrings for high-fashion streetwear minimalism.'
  },
  {
    name: 'Military Olive Boxy Hoodie',
    slugBase: 'military-olive-boxy-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Boxy Cut',
    theme: 'Streetwear',
    material: 'Heavy Fleece (380 GSM)',
    price: 2399,
    originalPrice: 3799,
    badge: 'LIMITED',
    isBestseller: true,
    isFeatured: false,
    isNewArrival: true,
    stock: 40,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Olive Green', hex: '#3d4432' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_olive.jpg',
    description: 'Military-toned muted olive green plain hoodie with custom matte eyelets and heavy French terry interior. Boxy drop-shoulder profile designed to elevate any streetwear layering.'
  },
  {
    name: 'Mocha Brown Heavyweight Hoodie',
    slugBase: 'mocha-brown-heavyweight-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Oversized Fit',
    theme: 'Streetwear',
    material: 'Heavy Fleece (380 GSM)',
    price: 2499,
    originalPrice: 3999,
    badge: 'POPULAR',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 55,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Warm Mocha', hex: '#4b382a' },
      { name: 'Vintage Charcoal', hex: '#2b2b30' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_mocha.jpg',
    description: 'Deep espresso mocha brown streetwear hoodie in dense 380 GSM cotton fleece. Ultra-soft interior, seamless kangaroo pocket, and oversized sleeves for maximum silhouette impact.'
  },
  {
    name: 'Acid Grey Drop-Shoulder Hoodie',
    slugBase: 'acid-grey-drop-shoulder-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Drop Shoulder',
    theme: 'Acid Wash',
    material: 'Silicon Washed Loopknit (280 GSM)',
    price: 2349,
    originalPrice: 3599,
    badge: 'ARCHIVE',
    isBestseller: false,
    isFeatured: false,
    isNewArrival: true,
    stock: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Acid Grey', hex: '#5c5e69' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_acid_grey.jpg',
    description: 'Hand-treated acid wash effect on charcoal grey loopknit fabric. Each piece boasts subtle unique cloud marbling, heavyweight ribbed cuffs, and custom metal hardware.'
  },
  {
    name: 'Pure Off-White Relaxed Hoodie',
    slugBase: 'pure-off-white-relaxed-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Relaxed Fit',
    theme: 'Minimalist Typography',
    material: '100% French Terry Cotton (240 GSM)',
    price: 2199,
    originalPrice: 3499,
    badge: 'ESSENTIAL',
    isBestseller: false,
    isFeatured: true,
    isNewArrival: false,
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure White', hex: '#f5f5f7' },
      { name: 'Oatmeal Beige', hex: '#d9d3c7' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_offwhite.jpg',
    description: 'Crisp off-white plain hoodie tailored from 100% combed cotton fleece. Minimalist aesthetic, double-lined crossover hood, and clean tonal stitching throughout.'
  },
  {
    name: 'Midnight Navy Streetwear Hoodie',
    slugBase: 'midnight-navy-streetwear-hoodie',
    category: 'Hoodies',
    categoryLabel: 'Plain Hoodies',
    categoryName: 'Hoodies',
    subcategory: 'Heavyweight Hoodie',
    fit: 'Oversized Fit',
    theme: 'Streetwear',
    material: 'Heavy Fleece (380 GSM)',
    price: 2299,
    originalPrice: 3499,
    badge: 'BESTSELLER',
    isBestseller: true,
    isFeatured: false,
    isNewArrival: true,
    stock: 60,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Midnight Navy', hex: '#141d2b' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'hoodie_navy.jpg',
    description: 'Deep nocturnal navy streetwear hoodie in 380 GSM heavyweight French Terry. Oversized street silhouette with extra-wide hem and drop-shoulder profile.'
  },

  // --- 12 STREETWEAR T-SHIRTS ---
  {
    name: 'Pitch Black Heavyweight Boxy Tee',
    slugBase: 'pitch-black-heavyweight-boxy-tee',
    category: 'Oversized Tees',
    categoryLabel: 'Oversized Tees',
    categoryName: 'Oversized Tees',
    subcategory: 'Drop 01 - Heavyweight',
    fit: 'Boxy Cut',
    theme: 'Streetwear',
    material: 'Heavyweight Combed Cotton (260 GSM)',
    price: 999,
    originalPrice: 1599,
    badge: 'BESTSELLER',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 120,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Pure White', hex: '#f5f5f7' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_black_boxy.jpg',
    description: 'The foundation of modern streetwear. Heavyweight 260 GSM luxury cotton tee featuring a tight ribbed crew neck, wide cut-and-sew drop sleeves, and structured boxy drape.'
  },
  {
    name: 'Monochrome Pure White Heavy Tee',
    slugBase: 'monochrome-pure-white-heavy-tee',
    category: 'Oversized Tees',
    categoryLabel: 'Oversized Tees',
    categoryName: 'Oversized Tees',
    subcategory: 'Drop 01 - Heavyweight',
    fit: 'Drop Shoulder',
    theme: 'Minimalist Typography',
    material: 'Heavyweight Combed Cotton (260 GSM)',
    price: 999,
    originalPrice: 1599,
    badge: 'ESSENTIAL',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 100,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure White', hex: '#f8f8fa' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_white_heavy.jpg',
    description: 'Zero see-through guarantee. 260 GSM dense luxury cotton cut in our signature relaxed drop-shoulder streetwear fit. Finished with pre-shrunk anti-pilling treatment.'
  },
  {
    name: 'Acid Wash Vintage Oversized Tee',
    slugBase: 'acid-wash-vintage-oversized-tee',
    category: 'Oversized Tees',
    categoryLabel: 'Oversized Tees',
    categoryName: 'Oversized Tees',
    subcategory: 'Acid Wash Series',
    fit: 'Oversized Fit',
    theme: 'Acid Wash',
    material: 'Pre-Shrunk Bio-Washed Cotton (250 GSM)',
    price: 1199,
    originalPrice: 1899,
    badge: 'NEW DROP',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: true,
    stock: 80,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Acid Grey', hex: '#484b54' },
      { name: 'Vintage Charcoal', hex: '#2b2b30' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_acid_wash.jpg',
    description: '1990s skate-inspired acid wash oversized t-shirt. Hand-distressed mineral fade dye creates a unique vintage look on every individual piece.'
  },
  {
    name: 'Gothic Typography Statement Tee',
    slugBase: 'gothic-typography-statement-tee',
    category: 'Graphic Tees',
    categoryLabel: 'Graphic Tees',
    categoryName: 'Graphic Tees',
    subcategory: 'Limited Capsule',
    fit: 'Oversized Fit',
    theme: 'Gothic & Cyberpunk',
    material: '100% French Terry Cotton (240 GSM)',
    price: 1299,
    originalPrice: 1999,
    badge: 'LIMITED',
    isBestseller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Pure White', hex: '#f5f5f7' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_gothic.jpg',
    description: 'Cryptic gothic typography chest and back screenprint in high-density puff ink. Heavyweight combed cotton silhouette with relaxed wide sleeves.'
  },
  {
    name: 'Cyberpunk Tokyo Back Graphic Tee',
    slugBase: 'cyberpunk-tokyo-back-graphic-tee',
    category: 'Graphic Tees',
    categoryLabel: 'Graphic Tees',
    categoryName: 'Graphic Tees',
    subcategory: 'Limited Capsule',
    fit: 'Drop Shoulder',
    theme: 'Japanese Anime Art',
    material: 'Heavyweight Combed Cotton (260 GSM)',
    price: 1349,
    originalPrice: 2199,
    badge: 'POPULAR',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: true,
    stock: 50,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Acid Grey', hex: '#484b54' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_cyberpunk.jpg',
    description: 'Neo-Tokyo dystopian cyber graphic sprawled across the entire back with Kanji details on the chest. Screenprinted using breathable discharge inks that never crack or peel.'
  },
  {
    name: 'Desert Sand Boxy Minimalist Tee',
    slugBase: 'desert-sand-boxy-minimalist-tee',
    category: 'Essentials',
    categoryLabel: 'Essentials',
    categoryName: 'Essentials',
    subcategory: 'Monochrome Signature',
    fit: 'Boxy Cut',
    theme: 'Minimalist Typography',
    material: 'Compact Cotton (210 GSM)',
    price: 899,
    originalPrice: 1399,
    badge: 'ESSENTIAL',
    isBestseller: false,
    isFeatured: false,
    isNewArrival: false,
    stock: 90,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand Beige', hex: '#c5b8a5' },
      { name: 'Pure White', hex: '#f8f8fa' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_sand.jpg',
    description: 'Earthy desert sand tone crafted from ultra-smooth compact cotton. Clean raw lines, ribbed neck ribbing, and understated luxury streetwear finish.'
  },
  {
    name: 'Vintage Faded Charcoal Street Tee',
    slugBase: 'vintage-faded-charcoal-street-tee',
    category: 'Oversized Tees',
    categoryLabel: 'Oversized Tees',
    categoryName: 'Oversized Tees',
    subcategory: 'Fall Winter 2026',
    fit: 'Oversized Fit',
    theme: 'Vintage Nostalgia',
    material: 'Pre-Shrunk Bio-Washed Cotton (250 GSM)',
    price: 1099,
    originalPrice: 1699,
    badge: 'BESTSELLER',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 75,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage Charcoal', hex: '#2b2b30' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_charcoal_faded.jpg',
    description: 'Sun-faded charcoal vintage wash designed for daily streetwear authority. Relaxed drape, drop-shoulder seams, and premium 250 GSM bio-washed cotton.'
  },
  {
    name: 'Washed Army Olive Street Tee',
    slugBase: 'washed-army-olive-street-tee',
    category: 'Essentials',
    categoryLabel: 'Essentials',
    categoryName: 'Essentials',
    subcategory: 'Drop 01 - Heavyweight',
    fit: 'Relaxed Fit',
    theme: 'Streetwear',
    material: '100% French Terry Cotton (240 GSM)',
    price: 949,
    originalPrice: 1499,
    badge: 'NEW DROP',
    isBestseller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 60,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Olive Green', hex: '#444d3b' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_olive.jpg',
    description: 'Deep washed army olive basic tee. Lightweight yet structured 240 GSM French Terry cotton that maintains its shape after hundreds of washes.'
  },
  {
    name: 'Cobalt Blue Heavy Drop-Shoulder Tee',
    slugBase: 'cobalt-blue-heavy-drop-shoulder-tee',
    category: 'Oversized Tees',
    categoryLabel: 'Oversized Tees',
    categoryName: 'Oversized Tees',
    subcategory: 'Fall Winter 2026',
    fit: 'Drop Shoulder',
    theme: 'Streetwear',
    material: 'Heavyweight Combed Cotton (260 GSM)',
    price: 1049,
    originalPrice: 1649,
    badge: 'HOT',
    isBestseller: true,
    isFeatured: false,
    isNewArrival: true,
    stock: 70,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Slate Blue', hex: '#264b73' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_blue.jpg',
    description: 'Electric cobalt slate blue streetwear oversized tee. High-impact colorway with premium 260 GSM cotton, seamless tubular body construction, and wide sleeves.'
  },
  {
    name: 'Fallen Angel Renaissance Art Tee',
    slugBase: 'fallen-angel-renaissance-art-tee',
    category: 'Graphic Tees',
    categoryLabel: 'Graphic Tees',
    categoryName: 'Graphic Tees',
    subcategory: 'Limited Capsule',
    fit: 'Oversized Fit',
    theme: 'Vintage Nostalgia',
    material: '100% French Terry Cotton (240 GSM)',
    price: 1299,
    originalPrice: 1999,
    badge: 'ARCHIVE',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 40,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Off White', hex: '#eeebe1' },
      { name: 'Pitch Black', hex: '#0a0a0a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_fallen_angel.jpg',
    description: 'Classic Renaissance artwork sublimated with modern distressed streetwear typography. Soft off-white vintage combed cotton with subtle raw edge styling.'
  },
  {
    name: 'Metamorphosis Heavyweight Graphic Tee',
    slugBase: 'metamorphosis-heavyweight-graphic-tee',
    category: 'Graphic Tees',
    categoryLabel: 'Graphic Tees',
    categoryName: 'Graphic Tees',
    subcategory: 'Drop 01 - Heavyweight',
    fit: 'Oversized Fit',
    theme: 'Abstract Geometry',
    material: 'Heavyweight Combed Cotton (260 GSM)',
    price: 1249,
    originalPrice: 1899,
    badge: 'BESTSELLER',
    isBestseller: true,
    isFeatured: true,
    isNewArrival: true,
    stock: 85,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Pure White', hex: '#f5f5f7' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_metamorphosis.jpg',
    description: 'Intricate geometric butterfly metamorphosis graphic screenprinted with subtle metallic sheen. Luxury 260 GSM heavyweight cotton cut in an exaggerated streetwear fit.'
  },
  {
    name: 'Raw Edge Discipline Streetwear Tee',
    slugBase: 'raw-edge-discipline-streetwear-tee',
    category: 'Oversized Tees',
    categoryLabel: 'Oversized Tees',
    categoryName: 'Oversized Tees',
    subcategory: 'Drop 01 - Heavyweight',
    fit: 'Boxy Cut',
    theme: 'Streetwear',
    material: 'Silicon Washed Loopknit (280 GSM)',
    price: 1199,
    originalPrice: 1799,
    badge: 'FLAT 40% OFF',
    isBestseller: true,
    isFeatured: false,
    isNewArrival: false,
    stock: 95,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Vintage Charcoal', hex: '#2b2b30' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    localFileName: 'tee_discipline.jpg',
    description: 'Heavy 280 GSM silicon-washed loopknit cotton t-shirt with signature raw edge hems and subtle discipline chest embroidery. Built for relentless street durability.'
  }
];

async function downloadImages() {
  const dir = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log(`Downloading 20 product images to ${dir}...`);
  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const item = PRODUCTS_DATA[i];
    const targetPath = path.join(dir, item.localFileName);

    try {
      const res = await fetch(item.imageUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(targetPath, Buffer.from(buffer));
        console.log(`  [${i + 1}/20] Saved ${item.localFileName} (${Math.round(buffer.byteLength / 1024)} KB)`);
      } else {
        console.warn(`  [${i + 1}/20] Could not fetch ${item.imageUrl}: ${res.status}`);
      }
    } catch (e) {
      console.warn(`  [${i + 1}/20] Error downloading ${item.localFileName}: ${e.message}`);
    }
  }
}

async function seedDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB successfully!');

  const db = mongoose.connection.db;

  // 1. Ensure Hoodies category exists in categories collection
  const categoriesColl = db.collection('categories');
  const hoodieCat = await categoriesColl.findOne({ slug: 'hoodies' });
  if (!hoodieCat) {
    await categoriesColl.insertOne({
      name: 'Hoodies',
      slug: 'hoodies',
      description: 'Heavyweight plain and streetwear oversized hoodies',
      image: '/images/products/hoodie_black.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Added "Hoodies" category to database.');
  }

  // 2. Prepare 20 products
  const productsColl = db.collection('products');
  const inserted = [];

  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const p = PRODUCTS_DATA[i];
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${p.slugBase}-${randSuffix}`;
    const localImgPath = `/images/products/${p.localFileName}`;

    const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    const formattedPrice = `₹${p.price.toLocaleString('en-IN')}`;

    // Build variants for each size
    const variants = p.sizes.map((size, idx) => ({
      _id: new mongoose.Types.ObjectId(),
      sku: `${p.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase()}-${size}`,
      size,
      color: p.colors[0]?.name || 'Default',
      price: p.price,
      originalPrice: p.originalPrice,
      discount: discountPercent,
      stock: Math.max(5, Math.floor(p.stock / p.sizes.length)),
      image: localImgPath,
      isActive: true
    }));

    // Build colors array with image attached
    const colorsWithImages = p.colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      image: localImgPath
    }));

    const productDoc = {
      name: p.name,
      slug,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      formattedPrice,
      discount: discountPercent,
      category: p.category,
      categoryLabel: p.categoryLabel,
      categoryName: p.categoryName,
      subcategory: p.subcategory,
      fit: p.fit,
      theme: p.theme,
      material: p.material,
      badge: p.badge,
      image: localImgPath,
      images: [localImgPath, p.imageUrl],
      sizes: p.sizes,
      colors: colorsWithImages,
      stock: p.stock,
      hasVariants: true,
      variants,
      isActive: true,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      isNewArrival: p.isNewArrival,
      rating: Number((4.5 + Math.random() * 0.4).toFixed(1)),
      numReviews: Math.floor(12 + Math.random() * 38),
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const res = await productsColl.insertOne(productDoc);
    inserted.push({ id: res.insertedId, name: p.name, price: formattedPrice, category: p.category });
  }

  console.log(`Successfully inserted ${inserted.length} products into MongoDB!`);
  const totalInDb = await productsColl.countDocuments();
  console.log(`Total products now in DB: ${totalInDb}`);

  await mongoose.disconnect();
}

async function run() {
  try {
    await downloadImages();
    await seedDatabase();
    console.log('ALL DONE! 20 products and images created & added to DB.');
    process.exit(0);
  } catch (err) {
    console.error('Execution failed:', err);
    process.exit(1);
  }
}

run();
