export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: {
    name: string,
  };
  sizes: { size: string; quantity: number }[];
  // image: string;
  images: string[];
  description?: string;
  stock: number;
  color: {
    name: string,
  };
  rating: number; // Nuevo campo de rating
  discount: {
    isActive: boolean;
    value: number;
  };
  sex: string;
}
