export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  type: 'single' | 'layered';
  fragrances?: string[]; // For layered fragrances
}

export interface ProductSize {
  size: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: {
    [key: string]: string;
  };
  description: string;
  sizes: ProductSize[];
  // ... other product properties
}
