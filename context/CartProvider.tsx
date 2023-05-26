import React, { useReducer, useEffect } from "react";
import reducer from "./CartReducer";
import StoreContext from "./CartContext";
import { IInitialState } from "@/interfaces/IInitalState";

interface StoreProviderProps {
  children: React.ReactNode;
}

const getInitialCartState = (): IInitialState => ({
  cart:
    typeof window !== "undefined" &&
    typeof localStorage === "object" &&
    localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart") ?? "")
      : {
          cartItems: [],
          userData: {},
          userAddress: {},
          orderId: "",
        },
});

const StoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, getInitialCartState());
  const value = { state, dispatch };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage === "object") {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    }
  }, [state.cart]);

  // Obtener el estado del carrito desde el localStorage al iniciar la app
  // useEffect(() => {
  //   if (typeof window !== "undefined" && typeof localStorage === "object") {
  //     const cartData = localStorage.getItem("cart");

  //     if (cartData) {
  //       dispatch({ type: "LOAD_CART", payload: JSON.parse(cartData) });
  //     }
  //   }
  // }, []);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
