import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();
    const userId = (session.user as any).id;

    // Clear existing cart items for this user
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    // Add new cart items
    if (items && items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync cart', details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ items: [] });
    }

    const userId = (session.user as any).id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    const items = cartItems.map(item => ({
      id: item.product.id,
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart', details: error?.message },
      { status: 500 }
    );
  }
}
