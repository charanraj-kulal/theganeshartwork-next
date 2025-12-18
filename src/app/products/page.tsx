import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProductsPage() {
  // Fetch all products from database
  const dbProducts = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  // Convert to frontend format
  const products = dbProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    slug: p.slug,
    image: p.image,
    category: p.category.name,
    onSale: p.onSale,
    inStock: true,
    featured: p.featured,
    description: p.description || '',
  }));

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Products</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Browse our complete collection of personalized photo frames
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-gray-700">Filter by:</span>
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-900">
              <option>All Categories</option>
              <option>Birthday Frames</option>
              <option>Anniversary Frames</option>
              <option>Family Frames</option>
              <option>Collage Frames</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-900">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Showing count */}
        <div className="mt-8 text-center text-gray-600">
          Showing {products.length} of {products.length} products
        </div>
      </div>
    </main>
  );
}
