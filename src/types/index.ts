export interface Product {
  id: number | string;
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string;
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
