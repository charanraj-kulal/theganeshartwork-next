'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/products'),
      ]);

      const orders = await ordersRes.json();
      const productsData = await productsRes.json();
      const products = productsData.products || productsData || [];

      setStats({
        totalOrders: orders.length || 0,
        totalRevenue: orders.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0
        ),
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length || 0,
        totalProducts: products.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Pending Orders</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.totalProducts}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Manage Products
          </a>
          <a
            href="/admin/orders"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            View Orders
          </a>
        </div>
      </div>
    </div>
  );
}
