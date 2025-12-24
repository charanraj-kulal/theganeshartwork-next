import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();

    // Fetch only active coupons that are currently valid
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        color: true,
        minOrderAmount: true,
        minQuantity: true,
        applicabilityType: true,
        maxUses: true,
        usedCount: true,
        startDate: true,
        endDate: true,
      }
    });

    // Filter out coupons that have reached max usage
    const availableCoupons = coupons.filter(coupon => {
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return false;
      }
      return true;
    });

    return NextResponse.json({ coupons: availableCoupons });
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons', coupons: [] },
      { status: 500 }
    );
  }
}
