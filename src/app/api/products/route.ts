import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');

    let where: any = {};
    
    // If searching by slug, return that specific product
    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
        },
      });
      
      if (product) {
        return NextResponse.json({ products: [product] });
      } else {
        return NextResponse.json({ products: [], error: 'Product not found' });
      }
    }
    
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where = { ...where, categoryId: category.id };
      }
    }

    if (featured === 'true') {
      where = { ...where, featured: true };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
