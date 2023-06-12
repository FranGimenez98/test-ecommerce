import { CartItem, UserAddress, UserData } from "@/interfaces/IInitalState";
import { createContext } from "react";

export interface State {
  cart: {
    cartItems: CartItem[] | [];
    userData: UserData;
    userAddress: UserAddress;
    orderId: string;
  };
}

interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export interface Action {
  type: string;
  payload?: any;
}

const CartContext = createContext<ContextType>({
  state: {
    cart: {
      cartItems: [],
      userData: {
        name: "",
        surname: "",
        email: "",
        phone: {
          area_code: 0,
          number: 0,
        },
        identification: {
          type: "",
          number: 0,
        },
      },
      userAddress: {
        zip_code: 0,
        street_name: "",
        street_number: 0,
        floor: 0,
        apartment: 0,
        city_name: "",
        state_name: "",
        country_name: "",
      },
      orderId: "",
    },
  },
  dispatch: () => {},
});

export default CartContext;
