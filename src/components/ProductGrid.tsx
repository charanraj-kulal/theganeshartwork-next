"use client";

import ProductCard from './ProductCard';
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?limit=10');
        const data = await response.json();
        
        // Convert to frontend format
        const formattedProducts = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice ?? undefined,
          slug: p.slug,
          image: p.image,
          category: p.category?.name || '',
          onSale: p.onSale,
          inStock: true,
          featured: p.featured,
          description: p.description || '',
        }));
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Recommended Products
          </h2>
          <p className="text-gray-600">
            Explore our collection of personalized photo frames
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/products" className="inline-block bg-gray-900 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
