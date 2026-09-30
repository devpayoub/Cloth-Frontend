export const ROUTES = {
  home: "/",
  shop: "/shop",
  product: (slug: string) => `/products/${slug}`,
  category: (slug: string) => `/categories/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  register: "/register",
  account: "/account",
  orders: "/account/orders",
  wishlist: "/wishlist",
} as const;
