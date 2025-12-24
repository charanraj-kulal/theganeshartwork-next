import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, cartItems, subtotal } = body;

    if (!code || !cartItems || !subtotal) {
      return NextResponse.json(
        { error: 'Coupon code, cart items, and subtotal are required' },
        { status: 400 }
      );
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code', valid: false },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'This coupon is no longer active', valid: false },
        { status: 400 }
      );
    }

    // Check start date
    if (coupon.startDate && new Date() < new Date(coupon.startDate)) {
      return NextResponse.json(
        { error: 'This coupon is not yet valid', valid: false },
        { status: 400 }
      );
    }

    // Check end date
    if (coupon.endDate && new Date() > new Date(coupon.endDate)) {
      return NextResponse.json(
        { error: 'This coupon has expired', valid: false },
        { status: 400 }
      );
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'This coupon has reached its maximum usage limit', valid: false },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { 
          error: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
          valid: false 
        },
        { status: 400 }
      );
    }

    // Check minimum quantity
    const totalQuantity = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    if (coupon.minQuantity && totalQuantity < coupon.minQuantity) {
      return NextResponse.json(
        { 
          error: `Minimum ${coupon.minQuantity} items required`,
          valid: false 
        },
        { status: 400 }
      );
    }

    // Check applicability type and filter applicable items
    let applicableSubtotal = subtotal;
    const applicabilityType = coupon.applicabilityType || 'all';

    if (applicabilityType === 'products' && coupon.applicableProducts) {
      try {
        const applicableProductIds = JSON.parse(coupon.applicableProducts);
        
        // Filter cart items for applicable products
        const applicableItems = cartItems.filter((item: any) => 
          applicableProductIds.includes(item.productId)
        );

        if (applicableItems.length === 0) {
          return NextResponse.json(
            { 
              error: 'This coupon is not applicable to items in your cart',
              valid: false 
            },
            { status: 400 }
          );
        }

        // Calculate subtotal for applicable products only
        applicableSubtotal = applicableItems.reduce(
          (sum: number, item: any) => sum + (item.price * item.quantity),
          0
        );
      } catch (error) {
        console.error('Error parsing applicable products:', error);
      }
    } else if (applicabilityType === 'categories' && coupon.applicableCategories) {
      try {
        const applicableCategoryIds = JSON.parse(coupon.applicableCategories);
        
        // Filter cart items for products in applicable categories
        const applicableItems = cartItems.filter((item: any) => 
          applicableCategoryIds.includes(item.categoryId)
        );

        if (applicableItems.length === 0) {
          return NextResponse.json(
            { 
              error: 'This coupon is not applicable to items in your cart',
              valid: false 
            },
            { status: 400 }
          );
        }

        // Calculate subtotal for applicable products only
        applicableSubtotal = applicableItems.reduce(
          (sum: number, item: any) => sum + (item.price * item.quantity),
          0
        );
      } catch (error) {
        console.error('Error parsing applicable categories:', error);
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (applicableSubtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discount = Math.min(coupon.discountValue, applicableSubtotal);
    }

    // Round discount to 2 decimal places
    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        color: coupon.color,
      },
      discount,
      message: `Coupon applied! You saved ₹${discount}`
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon', valid: false },
      { status: 500 }
    );
  }
}
