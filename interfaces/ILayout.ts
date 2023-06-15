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
  setShowFilters?: (bool: boolean) => void | undefined;
  categoryHandler?: (category: string) => void | undefined;
  priceHandler?: (price: string) => void | undefined;
  sexHandler?: (sex: string) => void | undefined;
  ratingHandler?: (rating: number) => void | undefined;
  colorHandler?: (color: string) => void | undefined;

  setIsOpenCart?: (bool: boolean) => void | undefined;

  cartItems?: number | undefined;

  isOpenWishlistMessage?: boolean | undefined;
  isOpenCart?: boolean | undefined;
  setIsOpenWishlistMessage?: (bool: boolean) => void | undefined;

  isOpenSideBar?: boolean | undefined;
  setIsOpenSidebar?: (bool: boolean) => void | undefined;

  isOpenSignOutMessage?: boolean | undefined;
  setIsOpenSignOutMessage?: (bool: boolean) => void | undefined;

  showSort?: boolean | undefined;
  setShowSort?: (bool: boolean) => void | undefined;
  sortHandler?: (sort: string) => void | undefined;
}
