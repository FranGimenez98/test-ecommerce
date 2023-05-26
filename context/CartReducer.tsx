import { CartItem, UserAddress, UserData } from "@/interfaces/IInitalState";

interface State {
  cart: {
    cartItems: CartItem[];
    userData: UserData;
    userAddress: UserAddress;
    orderId: string;
  };
}

interface Action {
  type: string;
  payload?: any;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug && item.size === newItem.size
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item.slug === existingItem.slug && item.size === existingItem.size
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem(
        "cart",
        JSON.stringify({ ...state.cart, cartItems })
      );
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_UPDATE_ITEM_QUANTITY": {
      const { id, size, quantity } = action.payload;
      const cartItems = state.cart.cartItems.map((item) =>
        item._id === id && item.size === size ? { ...item, quantity } : item
      );
      localStorage.setItem(
        "cart",
        JSON.stringify({ ...state.cart, cartItems })
      );
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) =>
          item.slug !== action.payload.slug || item.size !== action.payload.size
      );
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    // case "CART_RESET": {
    //   return {
    //     ...state,
    //     cart: {
    //       cartItems: [],
    //       shippingAddress: { location: {} },
    //     },
    //   };
    // }
    case "SAVE_SHIPPING_ADRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          userAddress: {
            ...action.payload,
          },
        },
      };
    }
    case "SAVE_USER_DATA":
      return {
        ...state,
        cart: {
          ...state.cart,
          userData: { ...action.payload },
        },
      };

    case "ADD_ORDER_ID": {
      const { orderId } = action.payload;
      return {
        ...state,
        cart: {
          ...state.cart,
          orderId: orderId,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
