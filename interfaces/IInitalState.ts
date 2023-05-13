export interface CartItem {
  _id: string;
  slug: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  size: string;
  stock: number;
}

// export interface ShippingAddress {
//   location: {
//     address: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   fullName: string;
//   phoneNumber: string;
// }

export interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: UserPhone;
  identification: UserIdentification;
}

export interface UserPhone {
  area_code: number;
  number: number;
}

export interface UserIdentification {
  type: string;
  number: number;
}

export interface UserAddress {
  zip_code: number;
  street_name: string;
  street_number: number;
  floor?: number;
  apartment?: number;
  city_name: string;
  state_name: string;
  country_name: string;
}

export interface IInitialState {
  cart: {
    cartItems: CartItem[];
    userData: UserData;
    userAddress: UserAddress;
  };
}
