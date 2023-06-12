import { Document } from "mongoose";
import { IProduct } from "./IProduct";

interface CartItem {
  price: number;
  product: IProduct;
  quantity: number;
  _id: string;
}

export interface ICart {
  user: string;
  products: CartItem[];
  totalPrice: number;
}
