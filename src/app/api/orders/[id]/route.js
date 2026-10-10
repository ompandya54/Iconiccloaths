import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { initialOrders } from '@/lib/store';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const conn = await connectToDatabase();

    if (conn) {
      const updated = await Order.findOneAndUpdate(
        { $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: body },
        { new: true }
      ).lean();

      if (updated) {
        return NextResponse.json({
          success: true,
          message: 'Order updated successfully in database',
          order: updated,
        });
      }
    }

    const index = initialOrders.findIndex((o) => o.id === id);
    if (index !== -1) {
      initialOrders[index] = { ...initialOrders[index], ...body };
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        order: initialOrders[index],
      });
    }

    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      await Order.findOneAndDelete({
        $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });
      return NextResponse.json({
        success: true,
        message: 'Order deleted from database successfully',
        id,
      });
    }

    const index = initialOrders.findIndex((o) => o.id === id);
    if (index !== -1) {
      initialOrders.splice(index, 1);
      return NextResponse.json({
        success: true,
        message: 'Order deleted successfully',
        id,
      });
    }

    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
