import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get a specific coupon
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

// PUT - Update a coupon
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      color,
      minOrderAmount,
      minQuantity,
      applicableProducts,
      isActive,
      startDate,
      endDate,
      maxUses,
    } = body;

    // Validate discount type if provided
    if (discountType && !['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Discount type must be either "percentage" or "fixed"' },
        { status: 400 }
      );
    }

    // Validate percentage discount if provided
    if (discountType === 'percentage' && discountValue && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: params.id }
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Check if code is being changed and if it already exists
    if (code && code !== existingCoupon.code) {
      const codeExists = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 400 }
        );
      }
    }

    // Update the coupon
    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(description !== undefined && { description }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(color && { color }),
        ...(minOrderAmount !== undefined && { 
          minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null 
        }),
        ...(minQuantity !== undefined && { 
          minQuantity: minQuantity ? parseInt(minQuantity) : null 
        }),
        ...(applicableProducts !== undefined && { 
          applicableProducts: applicableProducts ? JSON.stringify(applicableProducts) : null 
        }),
        ...(isActive !== undefined && { isActive }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
      },
    });

    return NextResponse.json({ coupon: updatedCoupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a coupon
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Check if coupon has been used
    if (coupon._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete coupon that has been used in orders' },
        { status: 400 }
      );
    }

    // Delete the coupon
    await prisma.coupon.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
