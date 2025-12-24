export interface Product {
  id: number | string;
  name: string;
  price: number;
  slug: string;
  image: string;
  images?: string; // JSON string of additional showcase images
  category: string;
  categoryId?: string; // Category ID for coupon validation
  onSale: boolean;
  inStock: boolean;
  featured?: boolean;
  originalPrice?: number;
  description: string;
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  image: string;
}
