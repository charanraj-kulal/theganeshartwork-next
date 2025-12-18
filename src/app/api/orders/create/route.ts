import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Allow guest checkout
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      state,
      pincode,
      paymentMethod = 'cod',
      items,
      subtotal,
      total,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Razorpay order if payment method is online
    let razorpayOrderId = null;
    if (paymentMethod === 'online') {
      try {
        const razorpay = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // Amount in paise
          currency: 'INR',
          receipt: `ORD-${Date.now()}`,
          notes: {
            customerName,
            customerEmail,
            customerPhone,
          },
        });

        razorpayOrderId = razorpayOrder.id;
      } catch (razorpayError) {
        console.error('Razorpay order creation failed:', razorpayError);
        return NextResponse.json(
          { error: 'Failed to initialize payment gateway. Please try Cash on Delivery.' },
          { status: 500 }
        );
      }
    }

    // Build order data - using unchecked input to handle optional userId
    const baseOrderData = {
      orderNumber: `ORD-${Date.now()}`,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city: city || '',
      state: state || 'Karnataka',
      pincode: pincode || '',
      subtotal: subtotal || total,
      total: total,
      status: 'pending' as const,
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending' as const,
      paymentMethod: paymentMethod,
      razorpayOrderId: razorpayOrderId,
      orderItems: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    // Add userId only if session exists - explicitly set to null for guest checkout
    const userId = session?.user ? (session.user as any).id : null;
    const orderData = { ...baseOrderData, userId };

    const order = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    });
    return NextResponse.json(
      { 
        error: 'Failed to create order. Please try again.',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
