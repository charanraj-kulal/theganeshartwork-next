import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProductClient from '@/components/ProductClient';
import ProductImageGallery from '@/components/ProductImageGallery';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch product from database
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!dbProduct) {
    notFound();
  }

  // Convert to frontend format
  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    originalPrice: dbProduct.originalPrice ?? undefined,
    slug: dbProduct.slug,
    image: dbProduct.image,
    images: dbProduct.images ?? undefined,
    category: dbProduct.category.name,
    onSale: dbProduct.onSale,
    inStock: true,
    featured: dbProduct.featured,
    description: dbProduct.description || '',
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/products" className="text-gray-600 hover:text-orange-600 transition-colors">Products</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Product Image Gallery */}
            <ProductImageGallery
              mainImage={product.image}
              showcaseImages={product.images ? JSON.parse(product.images) : []}
              productName={product.name}
              onSale={product.onSale}
            />

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  In Stock
                </p>
              </div>

              {/* Delivery Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      🚚 Fast Delivery in BIDAR & KALABURAGI
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Get it by {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} (2 days)
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                {product.originalPrice && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-600">MRP:</span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
                
                <div className="flex items-baseline gap-3">
                  <span className="text-sm text-gray-700 font-medium">Price:</span>
                  <span className="text-4xl font-bold text-orange-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Inclusive of all taxes</p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Why Choose Us?</h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Fast 24-48 Hour Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Cash on Delivery Available</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">100% Quality Guaranteed</span>
                  </div>
                </div>
              </div>

              <ProductClient product={product} />

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <h4 className="font-bold text-blue-900">Order on WhatsApp (fast response)</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-1 ml-8">
                  <li>• Delivery by 6PM tomorrow in BIDAR City</li>
                  <li>• Delivery within 48 hours in KALABURAGI CITY</li>
                  <li>• 5 Days Fast delivery anywhere in Karnataka</li>
                </ul>
                <a
                  href={`https://api.whatsapp.com/send/?phone=%2B919448075790&text=I want to order: ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Quick Assistance: Call/WhatsApp: 9448075790
                </a>
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-2">Category:</h3>
                <Link
                  href={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-orange-500 hover:underline"
                >
                  {product.category}
                </Link>
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Product Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Customise Text</h3>
                <p className="text-sm text-gray-600">Add personalized text, emojis, and special characters</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Wall Look</h3>
                <p className="text-sm text-gray-600">Perfect for any wall texture with easy hanging hooks</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Front side</h3>
                <p className="text-sm text-gray-600">High-quality lamination for lasting protection</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fits for gifting</h3>
                <p className="text-sm text-gray-600">Perfect gift for any special occasion</p>
              </div>
            </div>
          </div>

          {/* Customize Text Section */}
          <div className="border-t p-8 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Customise Text</h2>
                <p className="text-gray-600 mb-4">
                  You can add your family members name or your loved one's name on the frame.
                  Just choose from your options and get it done in a simple way.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Add personalized text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Choose from multiple fonts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Support for emojis and special characters</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <img src={product.image} alt="Customise" className="rounded-lg shadow-lg max-h-full" />
              </div>
            </div>
          </div>

          {/* Wall Look Section */}
          <div className="border-t p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <img src={product.image} alt="Wall Look" className="rounded-lg shadow-lg max-h-full" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Wall Look</h2>
                <p className="text-gray-600 mb-4">
                  These frames are perfect for any room wall and can be hung both horizontally & vertically, see
                  how beautifully they can be placed on your wall.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Horizontal & vertical hanging options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sturdy frame construction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Suitable for all wall types</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Easy Hanging Section */}
          <div className="border-t p-8 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Easy Hanging</h2>
                <p className="text-gray-600 mb-4">
                  Convenient hanging hook provided at the back makes sure that you don't need to worry
                  about the whole process of hanging. We provide hooks in the back.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pre-installed hanging hooks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No tools required for hanging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure and stable mounting</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-16 h-2 bg-gray-400 rounded"></div>
                  </div>
                  <p className="text-gray-600">Convenient hanging hook</p>
                </div>
              </div>
            </div>
          </div>

          {/* Front Side (Giftwraps) Section */}
          <div className="border-t p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <img src={product.image} alt="Front side" className="rounded-lg shadow-lg max-h-full" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Front side</h2>
                <p className="text-gray-600 mb-4">
                  Front side of a frame consists of a glass, which provide extra shine to your photos and
                  gives protection. Glossy Lamination for lasting protection.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>High-quality glass protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Glossy lamination finish</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>UV resistant for long-lasting colors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Giftwraps Section */}
          <div className="border-t p-8 bg-orange-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Giftwraps</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-md mb-3">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">Safe Packaging</h3>
                <p className="text-sm text-gray-600 mt-1">Bubble wrap + Hard corrugated box</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-md mb-3">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">Gift Wrapping</h3>
                <p className="text-sm text-gray-600 mt-1">Beautiful gift wrapping available</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-md mb-3">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">Quality Check</h3>
                <p className="text-sm text-gray-600 mt-1">Each product carefully inspected</p>
              </div>
            </div>
          </div>

          {/* Fits for Gifting Section */}
          <div className="border-t p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Fits for gifting</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Make a heartfelt impression with our customized gift! It's an extraordinary way to convey your
              affection and strengthen the bonds between you and your loved ones. Your gifts can be giving to your
              dear ones, be it a birthday or anniversary. You can gift to almost anyone you love on each special occasion!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Birthday', 'Anniversary', 'Wedding', 'Housewarming', 'Baby Shower', 'Graduation', 'Valentine\'s Day', 'Mother\'s Day'].map((occasion) => (
                <div key={occasion} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 hover:border-orange-500 transition-colors">
                  <p className="font-semibold text-gray-900">{occasion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="border-t p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">📦 How many days does it take for delivery?</h3>
                <p className="text-gray-600">Just 24 hours across BIDAR CITY and 48 hours in KALABURAGI CITY. Rest Cities of Karnataka will take 5 days for delivery</p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">💰 Is Cash on delivery available?</h3>
                <p className="text-gray-600">Yes, we accept Cash on Delivery for all orders</p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">🔒 Are my pictures safe?</h3>
                <p className="text-gray-600">Absolutely! Your pictures are 100% safe and secure with us</p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">🔄 Can I return or replace the product?</h3>
                <p className="text-gray-600">Yes, we have a hassle-free return and replacement policy within 7 days</p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">📏 What sizes are available?</h3>
                <p className="text-gray-600">We offer multiple sizes to fit your needs. Check our size reference chart below for details.</p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">✏️ How do I add custom text?</h3>
                <p className="text-gray-600">During checkout, you can specify your custom text, font preferences, and any special instructions.</p>
              </div>
            </div>
          </div>

          {/* Size Reference Chart */}
          <div className="border-t p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Size Reference Chart</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Choose the perfect size for your space. All our frames come with lifestyle reference images to help you visualize.
            </p>
            
            {/* Grid of reference images */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {[
                { size: '8x10"', label: 'Desk Size' },
                { size: '12x16"', label: 'Small Wall' },
                { size: '16x20"', label: 'Medium Wall' },
                { size: '20x30"', label: 'Large Wall' },
                { size: '24x36"', label: 'Statement Piece' },
                { size: '11x14"', label: 'Gallery Style' },
                { size: '18x24"', label: 'Living Room' },
                { size: '30x40"', label: 'Feature Wall' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-colors group">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                    <img 
                      src={product.image} 
                      alt={item.label} 
                      className="w-2/3 h-2/3 object-cover rounded shadow-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 bg-white text-center">
                    <p className="font-bold text-gray-900">{item.size}</p>
                    <p className="text-sm text-gray-600">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Size comparison table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Size</th>
                    <th className="px-4 py-3 text-left font-semibold">Best For</th>
                    <th className="px-4 py-3 text-left font-semibold">Photos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">8x10"</td>
                    <td className="px-4 py-3 text-gray-600">Desk, Shelf</td>
                    <td className="px-4 py-3 text-gray-600">1-2 photos</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">12x16"</td>
                    <td className="px-4 py-3 text-gray-600">Small Wall, Gallery</td>
                    <td className="px-4 py-3 text-gray-600">2-4 photos</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">16x20"</td>
                    <td className="px-4 py-3 text-gray-600">Living Room, Bedroom</td>
                    <td className="px-4 py-3 text-gray-600">4-6 photos</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">20x30"</td>
                    <td className="px-4 py-3 text-gray-600">Large Wall, Hallway</td>
                    <td className="px-4 py-3 text-gray-600">6-9 photos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Use Cases */}
          <div className="border-t p-8 bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Use cases</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              See how our customers are using these personalized frames in their spaces
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <img src={product.image} alt="Home Decor" className="w-3/4 h-3/4 object-cover rounded shadow-lg" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Home Decor</h3>
                  <p className="text-sm text-gray-600">Perfect for living rooms and bedrooms</p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <img src={product.image} alt="Family Photos" className="w-3/4 h-3/4 object-cover rounded shadow-lg" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Family Photos</h3>
                  <p className="text-sm text-gray-600">Cherish memories with loved ones</p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <img src={product.image} alt="Gift" className="w-3/4 h-3/4 object-cover rounded shadow-lg" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Perfect Gift</h3>
                  <p className="text-sm text-gray-600">Thoughtful gift for any occasion</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}

          {/* Product Description */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                This beautiful personalized photo frame is perfect for capturing your special moments. 
                Made with high-quality materials, this frame will last for years to come.
              </p>
              <ul className="mt-4 space-y-2">
                <li>✓ High-quality print on premium paper</li>
                <li>✓ Durable frame construction</li>
                <li>✓ Easy to hang or display</li>
                <li>✓ Customizable with your photos and text</li>
                <li>✓ Perfect gift for any occasion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600">We support your queries via WhatsApp, Email, Instagram & Call</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Order Tracking</h3>
              <p className="text-sm text-gray-600">Get updates on every step directly on your WhatsApp and Email</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Packaging</h3>
              <p className="text-sm text-gray-600">Our premium packaging makes the gift experience much better</p>
            </div>
          </div>
        </div>

        {/* Contact for Order */}
        <div className="mt-8 bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Need Help with Your Order?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact us on WhatsApp or call for personalized assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919448075790"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            <a
              href="tel:9448075790"
              className="bg-gray-900 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const dbProducts = await prisma.product.findMany({
    select: { slug: true },
  });
  
  return dbProducts.map((product) => ({
    slug: product.slug,
  }));
}
