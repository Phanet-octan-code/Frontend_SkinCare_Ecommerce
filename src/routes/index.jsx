export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: (slug) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  ORDER_TRACKING: '/track',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ACCOUNT: {
    PROFILE: '/account/profile',
    ORDERS: '/account/orders',
    ORDER_DETAIL: (id) => `/account/orders/${id}`,
    ADDRESSES: '/account/addresses',
    WISHLIST: '/account/wishlist',
  },
  CONTENT: {
    ABOUT: '/about',
    CONTACT: '/contact',
    FAQ: '/faq',
    SHIPPING: '/shipping-policy',
    RETURNS: '/returns-policy',
    PRIVACY: '/privacy-policy',
    TERMS: '/terms',
  },
};

export default ROUTES;

