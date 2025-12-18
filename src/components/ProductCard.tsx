"use client";

import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          {/* On Sale Badge */}
          {product.onSale && (
            <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-gray-900 font-bold text-lg">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Select Options
          </button>
        </div>
      </Link>
    </div>
  );
}
