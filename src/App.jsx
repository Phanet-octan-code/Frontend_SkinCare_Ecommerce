import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { LanguageProvider } from './i18n/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout & Guards
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Storefront (HomePage statically imported for fastest First Contentful Paint)
import HomePage from './pages/HomePage';

// Lazy-loaded routes for optimal bundle splitting and performance
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Institutional & Content Pages
const AboutPage = lazy(() => import('./pages/content/AboutPage'));
const BlogPage = lazy(() => import('./pages/content/BlogPage'));
const ContactPage = lazy(() => import('./pages/content/ContactPage'));
const FaqPage = lazy(() => import('./pages/content/FaqPage'));
const ShippingPolicyPage = lazy(() => import('./pages/content/ShippingPolicyPage'));
const ReturnsPolicyPage = lazy(() => import('./pages/content/ReturnsPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/content/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/content/TermsPage'));

// Customer Account Pages (Protected)
const ProfilePage = lazy(() => import('./pages/account/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/account/OrderDetailPage'));
const AddressesPage = lazy(() => import('./pages/account/AddressesPage'));
const WishlistPage = lazy(() => import('./pages/account/WishlistPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Clean luxury suspense fallback
function RouteLoader() {
  return (
    <div
      className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8"
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#ECE8DE] border-t-[#71856B] animate-spin mb-3" />
      <span className="font-serif text-[11px] tracking-[0.2em] uppercase text-[#8C9388]">
        Élixir Botanique
      </span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                <Suspense fallback={<RouteLoader />}>
                  <Routes>
                    <Route element={<AppLayout />}>
                      {/* Public Storefront Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/products/:slug" element={<ProductDetailPage />} />
                      <Route path="/product/:slug" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-success" element={<OrderSuccessPage />} />
                      <Route path="/track" element={<OrderTrackingPage />} />

                      {/* Institutional & Policy Pages */}
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/journal" element={<Navigate to="/blog" replace />} />
                      <Route path="/categories" element={<Navigate to="/shop" replace />} />
                      <Route path="/brands" element={<Navigate to="/shop?filter=brands" replace />} />
                      <Route path="/offers" element={<Navigate to="/shop?promotion=1" replace />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/faq" element={<FaqPage />} />
                      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                      <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />
                      <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
                      <Route path="/returns" element={<Navigate to="/returns-policy" replace />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />

                  {/* Customer Authentication Routes */}
                  <Route path="/login" element={<AuthPage initialMode="login" />} />
                  <Route path="/register" element={<AuthPage initialMode="register" />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Customer Wishlist (Protected) */}
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Customer Account Routes (Protected) */}
                  <Route path="/account" element={<Navigate to="/account/profile" replace />} />
                  <Route path="/account/wishlist" element={<Navigate to="/wishlist" replace />} />

                  <Route
                    path="/account/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/addresses"
                    element={
                      <ProtectedRoute>
                        <AddressesPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ToastProvider>
    </LanguageProvider>
  </BrowserRouter>
  );
}
