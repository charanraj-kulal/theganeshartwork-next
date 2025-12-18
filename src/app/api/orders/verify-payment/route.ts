import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    // Validate required fields
    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('Razorpay key secret not configured');
      return NextResponse.json(
        { error: 'Payment verification failed - configuration error' },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.error('Payment signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed - invalid signature' },
        { status: 400 }
      );
    }

    // Update order payment status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpayPaymentId,
        status: 'processing',
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
