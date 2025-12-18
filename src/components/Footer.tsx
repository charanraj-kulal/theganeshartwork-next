import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">About Us</h3>
            <p className="text-sm mb-4">
              Decorior.in offers personalized home decor and frames with 7 years of expertise (@thefreakykart). 
              We deliver unique, high-quality products within Bidar, Kalaburagi city.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-white">Email:</span>
                <a href="mailto:support@decorior.in" className="hover:text-gray-300 transition-colors">
                  support@decorior.in
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-white">Phone:</span>
                <a href="tel:+919448075790" className="hover:text-gray-300 transition-colors">
                  +91 9448075790
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-white">Address:</span>
                <span className="text-sm">
                  Near Gurudwara Nanak Jhira, Bidar, Karnataka – 585401
                </span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-gray-300 transition-colors">About us</Link></li>
              <li><Link href="/contact-us" className="hover:text-gray-300 transition-colors">Contact us</Link></li>
              <li><Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-returns" className="hover:text-gray-300 transition-colors">Refund & Return Policy</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/my-account" className="hover:text-gray-300 transition-colors">My Account</Link></li>
              <li><Link href="/login" className="hover:text-gray-300 transition-colors">Login</Link></li>
              <li><Link href="/track-order" className="hover:text-gray-300 transition-colors">Track Order</Link></li>
              <li><Link href="/faqs" className="hover:text-gray-300 transition-colors">FAQ's</Link></li>
              <li><Link href="/sitemap" className="hover:text-gray-300 transition-colors">Sitemap</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-gray-300 transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/product/personalised-photo-frame" className="hover:text-gray-300 transition-colors">Personalised Photo Frame</Link></li>
              <li><Link href="/product/set-of-mini-photo-frames" className="hover:text-gray-300 transition-colors">Set of Mini Frames</Link></li>
              <li><Link href="/categories/birthday-frames" className="hover:text-gray-300 transition-colors">Birthday Frames</Link></li>
              <li><Link href="/categories/anniversary-frames" className="hover:text-gray-300 transition-colors">Anniversary Frames</Link></li>
              <li><Link href="/categories/family-frames" className="hover:text-gray-300 transition-colors">Family Frames</Link></li>
              <li><Link href="/categories/collage-frames" className="hover:text-gray-300 transition-colors">Collage Frames</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm">
              <p>Follow us and never miss an update:</p>
              <div className="flex gap-4 mt-2">
                <a 
                  href="https://facebook.com/decorior.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/bidar.decorior.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg">
              <span>🏆</span>
              <div className="text-sm">
                <p className="font-bold">7 Years Experience</p>
                <p className="text-xs">Delivering across India since 2018</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 text-gray-400 text-sm py-4">
        <div className="container mx-auto px-4 text-center">
          <p>2025 All rights reserved. Freakykart Private Limited | Made with ❤️ in Bidar</p>
        </div>
      </div>
    </footer>
  );
}
