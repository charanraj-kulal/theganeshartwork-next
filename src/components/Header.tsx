"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Truck, Package, Banknote, Zap, Award, User, ShoppingCart, Phone, Menu, X, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { items } = useCartStore();
  const { data: session } = useSession();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success('Logged out successfully');
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const categories = [
    { name: 'Restoration', slug: 'restoration' },
    { name: 'Merging', slug: 'merging' },
    { name: 'Imaginary Art', slug: 'imaginary-art' },
    { name: 'Oil Painting', slug: 'oil-painting' },
    { name: 'Wooden Clog', slug: 'wooden-clog' },
    { name: 'Collage', slug: 'collage' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-center py-2.5 text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Truck className="w-4 h-4" />
          <span>Fast Delivery Across Karnataka</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top row - Logo and Icons */}
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-tight flex-shrink-0">
              <span className="text-gray-900">DECORIOR</span>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              {/* Phone */}
              <a href="tel:+919448075790" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Phone className="w-5 h-5" />
                <span className="hidden xl:inline text-sm font-medium">+91 9448075790</span>
              </a>

              {/* Login/Profile */}
              {session ? (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-gray-700 text-sm font-medium">Hi, {session.user?.name?.split(' ')[0]}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium">Login</span>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative text-gray-700 hover:text-gray-900 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation - Desktop (Separate row) */}
          <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t border-gray-100" ref={dropdownRef}>
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('categories')}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'categories' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={() => setActiveDropdown(null)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/products" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              All Products
            </Link>

            <Link href="/track-order" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Track Order
            </Link>

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('about')}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/about-us"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact-us"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/faqs"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    FAQs
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop (Separate row) */}
          <div className="hidden md:block py-3 border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                Home
              </Link>
              
              <div className="space-y-1">
                <button
                  onClick={() => toggleDropdown('mobile-categories')}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-categories' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'mobile-categories' && (
                  <div className="pl-4 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}
                        className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                All Products
              </Link>

              <div className="space-y-1">
                <button
                  onClick={() => toggleDropdown('mobile-about')}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-about' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'mobile-about' && (
                  <div className="pl-4 space-y-1">
                    <Link
                      href="/about-us"
                      onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}
                      className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/contact-us"
                      onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}
                      className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/faqs"
                      onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}
                      className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      FAQs
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Search */}
              <div className="px-4 pt-3">
                <SearchBar isMobile />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Features Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Banknote className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">COD Available</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Zap className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Quick Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Award className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Quality Products</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
