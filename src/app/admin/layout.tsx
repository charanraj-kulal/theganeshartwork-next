'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any)?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex gap-4">
              <a
                href="/admin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a
                href="/admin/products"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Products
              </a>
              <a
                href="/admin/orders"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Orders
              </a>
              <a
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Back to Site
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
