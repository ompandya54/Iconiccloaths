import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['oversized', 'graphic', 'essentials', 'collections', 'new-arrivals'],
    },
    categoryLabel: {
      type: String,
      default: 'Clothing',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
    },
    badge: {
      type: String,
      default: 'BESTSELLER',
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      default: 50,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    description: {
      type: String,
      default: 'Built for the bold. Premium heavyweight luxury cotton streetwear.',
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model during Next.js hot module replacement
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
