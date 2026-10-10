import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    formattedAmount: {
      type: String,
    },
    paymentMethod: {
      type: String,
      default: 'COD',
      enum: ['COD', 'Razorpay', 'UPI', 'Card'],
    },
    paymentStatus: {
      type: String,
      default: 'Paid',
      enum: ['Pending', 'Paid', 'Failed'],
    },
    status: {
      type: String,
      default: 'Processing',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
