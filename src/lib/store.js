// In-memory data store for Next.js API routes

export let initialProducts = [
  {
    id: 'prod-1',
    name: 'Minimal Logo Tee',
    category: 'essentials',
    categoryLabel: 'Essentials',
    price: 999,
    formattedPrice: '₹999',
    badge: 'BESTSELLER',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_minimal.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_metamorphosis.jpg' },
    ]
  },
  {
    id: 'prod-2',
    name: 'Metamorphosis Tee',
    category: 'graphic',
    categoryLabel: 'Graphic Tees',
    price: 1199,
    formattedPrice: '₹1,199',
    badge: 'NEW DROP',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_metamorphosis.jpg' },
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_minimal.jpg' },
    ]
  },
  {
    id: 'prod-3',
    name: 'Discipline Tee',
    category: 'oversized',
    categoryLabel: 'Oversized Tees',
    price: 999,
    formattedPrice: '₹999',
    badge: 'BESTSELLER',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_discipline.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_urbandrift.jpg' },
    ]
  },
  {
    id: 'prod-4',
    name: 'Urban Drift Tee',
    category: 'graphic',
    categoryLabel: 'Graphic Tees',
    price: 1199,
    formattedPrice: '₹1,199',
    badge: 'LIMITED',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_urbandrift.jpg' },
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_discipline.jpg' },
    ]
  },
  {
    id: 'prod-5',
    name: 'Lost In Time Tee',
    category: 'oversized',
    categoryLabel: 'Oversized Tees',
    price: 1199,
    formattedPrice: '₹1,199',
    badge: 'NEW DROP',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/prod_lostintime.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/prod_metamorphosis.jpg' },
    ]
  },
  {
    id: 'prod-6',
    name: 'Chaos Anarchy Tee',
    category: 'oversized',
    categoryLabel: 'Oversized Tees',
    price: 1299,
    formattedPrice: '₹1,299',
    badge: 'HOT',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a', image: '/images/cat_oversized.jpg' },
      { name: 'White', hex: '#f5f5f7', image: '/images/cat_graphic.jpg' },
    ]
  },
  {
    id: 'prod-7',
    name: 'Rebel Wings Tee',
    category: 'new-arrivals',
    categoryLabel: 'New Arrivals',
    price: 1399,
    formattedPrice: '₹1,399',
    badge: 'NEW DROP',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#f5f5f7', image: '/images/cat_newarrivals.jpg' },
      { name: 'Black', hex: '#0a0a0a', image: '/images/cat_essentials.jpg' },
    ]
  }
];

export let initialOrders = [
  {
    id: 'ORD-9821',
    customer: 'Aarav Sharma',
    email: 'aarav@gmail.com',
    item: 'Minimal Logo Tee (Black - L)',
    amount: '₹999',
    date: '03 Oct 2026',
    status: 'Delivered'
  },
  {
    id: 'ORD-9822',
    customer: 'Rohan Verma',
    email: 'rohan.v@yahoo.com',
    item: 'Metamorphosis Tee (White - XL)',
    amount: '₹1,199',
    date: '03 Oct 2026',
    status: 'Processing'
  },
  {
    id: 'ORD-9823',
    customer: 'Priya Patel',
    email: 'priya.p@outlook.com',
    item: 'Discipline Tee (Black - M)',
    amount: '₹999',
    date: '02 Oct 2026',
    status: 'Shipped'
  }
];

// Admin Default Credentials
export class AdminCredentials {
  static username = "admin";
  static password = "admin123";
  static token = "iconic_admin_secret_token_2026";
}
