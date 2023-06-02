import { ICart } from "./ICart";
import { ICategory } from "./ICategory";
import { IColor } from "./IColor";

export interface ILayoutProps {
  children?: React.ReactNode;
  title?: string;
  user?: void;
  cart?: ICart | undefined;
  categories?: ICategory[];
  colors?: IColor[];
  showFilters?: boolean;
  setShowFilters?: (bool: boolean) => void;
  categoryHandler?: (category: string) => void;
  priceHandler?: (price: string) => void;
  sexHandler?: (sex: string) => void;
  ratingHandler?: (rating: number) => void;
  colorHandler?: (color: string) => void;

  setIsOpenCart?: (bool: boolean) => void;
}
