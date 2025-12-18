import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">About Us</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Decorior
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating memories that last forever with personalized photo frames and home decor
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                Decorior.in offers personalized home decor and frames with 7 years of expertise. 
                We started our journey in 2018 with the parent business @thefreakykart and have been 
                delivering quality products across India ever since.
              </p>
              <p>
                Our passion is to help you preserve your precious memories in beautiful, 
                high-quality frames that you'll cherish for years to come. Each frame is carefully 
                crafted with attention to detail and personalized to your exact specifications.
              </p>
              <p>
                Based in Bidar, Karnataka, we specialize in fast delivery within Bidar and Kalaburagi, 
                offering 24-48 hours delivery service to ensure you receive your order quickly.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-gray-900 text-2xl">🏆</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">7 Years Experience</h3>
                  <p className="text-gray-600">
                    Delivering quality products since 2018
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-gray-900 text-2xl">🚀</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">
                    24-48 hours delivery in Bidar & Kalaburagi
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-gray-900 text-2xl">✓</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Quality Products</h3>
                  <p className="text-gray-600">
                    High-quality materials and printing
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-gray-900 text-2xl">💬</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Superior Support</h3>
                  <p className="text-gray-600">
                    Best customer support via WhatsApp and Call
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you. Get in touch with us today!
            </p>
            <Link
              href="/contact-us"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
