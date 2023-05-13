import { IProduct } from "@/interfaces/IProduct";

export default function toJSON (products: IProduct | IProduct[] | null | undefined) {
    return JSON.parse(JSON.stringify(products));
}