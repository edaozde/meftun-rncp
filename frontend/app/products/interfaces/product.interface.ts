export interface Variant {
  size: string;
  color: string;
  stock: number;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageExists: boolean;
  variants: Variant[]; // 🔥 Ajout des variantes
  images: ProductImage[];
}
