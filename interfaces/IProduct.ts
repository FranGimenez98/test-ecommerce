export interface IProduct {
    name: string;
    slug: string;
    price: number;
    category: string;
    sizes: { size: string; quantity: number }[];
    image: string;
    description?: string;
    stock: number;
    color: string;
}
  