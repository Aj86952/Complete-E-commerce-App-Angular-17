export interface signUp {
  name: string;
  email: string;
  password: string;
}

export interface logIn {
  email: string;
  password: string;
}

export interface product {
  name: string;
  price: number;
  color: string;
  category: string;
  url: string;
  // id: undefined | number;
  // qunatity: undefined | number;
}

export interface cart {
  name: string;
  price: number;
  color: string;
  category: string;
  url: string;
  id: undefined | number;
  userId: undefined | number;
  productId: undefined | number;
  qunatity: undefined | number;
}

export interface priceSummary {
  price: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}

export interface order {
  email: string;
  mobile: string;
  address: string;
  userId: string;
  totalPrice: number;
  id: undefined;   //Auto-generating so kept undefined
}
