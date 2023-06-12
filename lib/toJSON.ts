import { IProduct } from "@/interfaces/IProduct";
import { IUser } from "@/interfaces/IUser";

export default function toJSON(
  data: IUser | IProduct | IProduct[] | null | undefined
) {
  return JSON.parse(JSON.stringify(data));
}
