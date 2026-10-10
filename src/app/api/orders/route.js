import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { initialOrders } from '@/lib/store';

export async function GET(request) {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      let orders = await Order.find({}).sort({ createdAt: -1 }).lean();

      if (!orders || orders.length === 0) {
        // Auto seed initial orders if DB is empty
        const docs = initialOrders.map((o) => ({
          orderId: o.id,
          customer: {
            name: o.customer,
            email: o.email,
          },
          items: [{ productId: 'prod-1', name: o.item, price: parseInt(o.amount.replace(/[^0-9]/g, '')) || 999 }],
          totalAmount: parseInt(o.amount.replace(/[^0-9]/g, '')) || 999,
          formattedAmount: o.amount,
          status: o.status,
          paymentStatus: 'Paid',
        }));
        await Order.insertMany(docs);
        orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      }

      const formatted = orders.map((o) => ({
        id: o.orderId || o._id.toString(),
        mongoId: o._id.toString(),
        customer: o.customer?.name || 'Customer',
        email: o.customer?.email || 'N/A',
        item: o.items?.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ') || 'Custom Order',
        amount: o.formattedAmount || `₹${(o.totalAmount || 0).toLocaleString('en-IN')}`,
        totalAmount: o.totalAmount,
        date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: o.status,
        paymentStatus: o.paymentStatus || 'Paid',
      }));

      return NextResponse.json({
        success: true,
        source: 'mongodb',
        count: formatted.length,
        orders: formatted,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'memory_fallback',
      count: initialOrders.length,
      orders: initialOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: true,
      orders: initialOrders,
      error: error.message,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const conn = await connectToDatabase();
    let newOrder;

    if (conn) {
      const doc = await Order.create({
        orderId: orderNum,
        customer: {
          name: body.customer || body.customerName || 'Guest User',
          email: body.email || 'customer@example.com',
          phone: body.phone || '',
          address: body.address || '',
        },
        items: body.items || [
          {
            productId: body.productId || 'prod-1',
            name: body.item || 'Streetwear Tee',
            price: Number(body.amount) || 999,
            quantity: 1,
          },
        ],
        totalAmount: Number(body.totalAmount || body.amount) || 999,
        formattedAmount: `₹${(Number(body.totalAmount || body.amount) || 999).toLocaleString('en-IN')}`,
        paymentMethod: body.paymentMethod || 'COD',
        paymentStatus: 'Paid',
        status: 'Processing',
      });

      newOrder = {
        id: doc.orderId,
        mongoId: doc._id.toString(),
        customer: doc.customer.name,
        email: doc.customer.email,
        item: body.item || doc.items.map((i) => i.name).join(', '),
        amount: doc.formattedAmount,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: doc.status,
      };
    } else {
      newOrder = {
        id: orderNum,
        customer: body.customer || 'Guest User',
        email: body.email || 'customer@example.com',
        item: body.item || 'Minimal Logo Tee (Black - L)',
        amount: `₹${(Number(body.amount) || 999).toLocaleString('en-IN')}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Processing',
      };
      initialOrders.unshift(newOrder);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully',
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
