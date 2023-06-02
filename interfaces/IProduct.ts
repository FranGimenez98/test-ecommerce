export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  sizes: { size: string; quantity: number }[];
  image: string;
  description?: string;
  stock: number;
  color: string;
  rating: number; // Nuevo campo de rating
  discount: {
    isActive: boolean;
    value: number;
  };
}
