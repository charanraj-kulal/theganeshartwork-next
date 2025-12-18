import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Fetch category from database
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  
  if (!category) {
    notFound();
  }

  // Convert products to frontend format
  const categoryProducts = category.products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    slug: p.slug,
    image: p.image,
    category: category.name,
    onSale: p.onSale,
    inStock: p.inStock,
    featured: p.featured,
    description: p.description || '',
  }));

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {category.name}
          </h1>
          <p className="text-lg">
            Discover beautiful personalized frames for every occasion
          </p>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Product Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              No products found in this category.
            </p>
            <Link
              href="/products"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
