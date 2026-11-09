import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext(null);

const STORAGE_KEY = 'skincare_guest_cart';
const COUPON_STORAGE_KEY = 'skincare_applied_coupon';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCouponCode, setAppliedCouponCode] = useState(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [serverQuote, setServerQuote] = useState(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { deliveryThreshold, standardShipping } = useCurrency();
  const quoteDebounceRef = useRef(null);

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota exceptions
    }
  }, [items]);

  // Persist applied coupon code to localStorage
  useEffect(() => {
    try {
      if (appliedCouponCode) {
        localStorage.setItem(COUPON_STORAGE_KEY, appliedCouponCode);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [appliedCouponCode]);

  // Authoritative real-time quote calculation with Laravel backend
  const fetchAuthoritativeQuote = useCallback(
    async (itemsToQuote, couponToApply) => {
      if (!itemsToQuote || itemsToQuote.length === 0) {
        setServerQuote(null);
        setQuoteError(null);
        return null;
      }

      setIsQuoteLoading(true);
      try {
        const res = await cartService.getQuote(itemsToQuote, couponToApply || null);
        if (res?.success && res?.data) {
          setServerQuote(res.data);
          setQuoteError(null);
          return res.data;
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Could not validate cart quote.';
        setQuoteError(message);
        if (couponToApply) {
          setAppliedCouponCode('');
          showToast(message, 'warning');
        }
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [showToast]
  );

  // Debounced quote synchronization when cart items or coupon change
  useEffect(() => {
    if (quoteDebounceRef.current) {
      clearTimeout(quoteDebounceRef.current);
    }

    if (items.length === 0) {
      setServerQuote(null);
      setQuoteError(null);
      return;
    }

    quoteDebounceRef.current = setTimeout(() => {
      fetchAuthoritativeQuote(items, appliedCouponCode);
    }, 250);

    return () => {
      if (quoteDebounceRef.current) {
        clearTimeout(quoteDebounceRef.current);
      }
    };
  }, [items, appliedCouponCode, fetchAuthoritativeQuote]);

  // Merge guest cart to server cart upon login
  useEffect(() => {
    const handleLoginSync = async () => {
      const token = localStorage.getItem('skincare_customer_token');
      if (token && items.length > 0) {
        try {
          await cartService.syncCart(items);
        } catch {
          // Gracefully continue
        }
      }
    };

    window.addEventListener('skincare:auth-login', handleLoginSync);
    return () => window.removeEventListener('skincare:auth-login', handleLoginSync);
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product, qty = 1, options = {}) => {
      if (!isAuthenticated) {
        showToast('Please sign in or register an account to add items to your cart.', 'warning');
        return false;
      }

      const quantityToAdd = Math.max(1, Number(qty) || 1);

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product_id === product.id);

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const newQty = updated[existingIndex].qty + quantityToAdd;
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: newQty,
          };
          return updated;
        } else {
          return [
            ...prevItems,
            {
              product_id: product.id,
              qty: quantityToAdd,
              product: {
                id: product.id,
                name: product.name,
                barcode: product.barcode,
                slug: product.slug,
                price: Number(product.price ?? product.sale_price ?? 0),
                sale_price: Number(product.sale_price ?? product.price ?? 0),
                final_price: Number(product.final_price ?? product.sale_price ?? product.price ?? 0),
                image_url: product.image_url,
                category_name: product.category?.name || product.category_name || 'Skincare',
                stock: product.stock ?? product.qty ?? 999,
              },
            },
          ];
        }
      });

      const message = quantityToAdd > 1
        ? `Added ${quantityToAdd} × "${product.name}" to your bag`
        : `Added "${product.name}" to your bag`;
      showToast(message, 'success');

      // Only open cart drawer if explicitly requested (e.g. via direct options)
      if (options?.openDrawer) {
        setIsCartOpen(true);
      }
    },
    [showToast, isAuthenticated]
  );

  const addBundleToCart = useCallback(
    (bundle, qty = 1, options = {}) => {
      if (!isAuthenticated) {
        showToast('Please sign in or register an account to add sets to your cart.', 'warning');
        return;
      }

      const quantityToAdd = Math.max(1, Number(qty) || 1);

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.bundle_id === bundle.id);

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const newQty = updated[existingIndex].qty + quantityToAdd;
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: newQty,
          };
          return updated;
        } else {
          return [
            ...prevItems,
            {
              bundle_id: bundle.id,
              product_id: null,
              is_bundle: true,
              qty: quantityToAdd,
              product: {
                id: bundle.id,
                name: bundle.name,
                price: Number(bundle.price),
                sale_price: Number(bundle.price),
                final_price: Number(bundle.price),
                image_url: bundle.image_url,
                category_name: bundle.type === 'gift_set' ? 'Luxury Gift Set' : 'Routine Bundle',
                stock: bundle.available_qty ?? 999,
              },
            },
          ];
        }
      });

      showToast(`Added "${bundle.name}" to your bag`, 'success');
      if (options?.openDrawer) {
        setIsCartOpen(true);
      }
    },
    [showToast, isAuthenticated]
  );

  const updateQty = useCallback((id, qty, isBundle = false) => {
    const targetQty = Number(qty);
    if (targetQty <= 0) {
      setItems((prev) => prev.filter((item) => (isBundle ? item.bundle_id !== id : item.product_id !== id)));
    } else {
      setItems((prev) =>
        prev.map((item) => {
          const match = isBundle ? item.bundle_id === id : item.product_id === id;
          return match ? { ...item, qty: targetQty } : item;
        })
      );
    }
  }, []);

  const removeFromCart = useCallback(
    (id, isBundle = false) => {
      setItems((prev) => prev.filter((item) => (isBundle ? item.bundle_id !== id : item.product_id !== id)));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCouponCode('');
    setServerQuote(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const applyCoupon = useCallback(
    async (code) => {
      const cleanCode = (code || '').trim().toUpperCase();
      if (!cleanCode) {
        showToast('Please enter a promo or coupon code', 'warning');
        return false;
      }

      setIsQuoteLoading(true);
      try {
        const quote = await cartService.getQuote(items, cleanCode);
        if (quote?.success && quote?.data) {
          setServerQuote(quote.data);
          setAppliedCouponCode(cleanCode);
          setQuoteError(null);
          showToast(`Coupon "${cleanCode}" applied successfully!`, 'success');
          return true;
        }
      } catch (err) {
        const msg = err.response?.data?.message || `Coupon "${cleanCode}" is invalid or expired.`;
        showToast(msg, 'error');
        setQuoteError(msg);
        return false;
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [items, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCouponCode('');
    setQuoteError(null);
    showToast('Coupon removed', 'info');
    fetchAuthoritativeQuote(items, null);
  }, [items, fetchAuthoritativeQuote, showToast]);

  // Dynamic summary computation (authoritative server quote prioritized)
  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    if (serverQuote?.subtotal !== undefined) {
      return Number(serverQuote.subtotal);
    }
    return items.reduce((sum, item) => {
      const unitPrice = item.product?.final_price ?? item.product?.sale_price ?? item.product?.price ?? 0;
      return sum + unitPrice * item.qty;
    }, 0);
  }, [items, serverQuote]);

  const promoDiscount = useMemo(() => {
    return Number(serverQuote?.promo_discount ?? 0);
  }, [serverQuote]);

  const memberDiscount = useMemo(() => {
    return Number(serverQuote?.member_discount ?? 0);
  }, [serverQuote]);

  const couponDiscount = useMemo(() => {
    return Number(serverQuote?.coupon_discount ?? 0);
  }, [serverQuote]);

  const totalDiscount = useMemo(() => {
    return Number(serverQuote?.total_discount ?? promoDiscount + memberDiscount + couponDiscount);
  }, [serverQuote, promoDiscount, memberDiscount, couponDiscount]);

  const tax = useMemo(() => {
    return Number(serverQuote?.tax ?? 0);
  }, [serverQuote]);

  const taxPercent = useMemo(() => {
    return Number(serverQuote?.tax_percent ?? 5.0);
  }, [serverQuote]);

  const shippingFee = useMemo(() => {
    if (serverQuote?.shipping_fee !== undefined) {
      return Number(serverQuote.shipping_fee);
    }
    if (subtotal === 0) return 0;
    return subtotal >= deliveryThreshold ? 0 : standardShipping;
  }, [serverQuote, subtotal, deliveryThreshold, standardShipping]);

  const total = useMemo(() => {
    if (serverQuote?.final_total !== undefined) {
      return Number(serverQuote.final_total);
    }
    return Math.max(0, subtotal - totalDiscount) + tax + shippingFee;
  }, [serverQuote, subtotal, totalDiscount, tax, shippingFee]);

  const freeShippingDifference = useMemo(() => {
    const threshold = serverQuote?.free_shipping_threshold ?? deliveryThreshold ?? 50.0;
    return Math.max(0, threshold - Math.max(0, subtotal - totalDiscount));
  }, [serverQuote, deliveryThreshold, subtotal, totalDiscount]);

  const freeShippingProgress = useMemo(() => {
    const threshold = serverQuote?.free_shipping_threshold ?? deliveryThreshold ?? 50.0;
    if (threshold <= 0) return 100;
    const net = Math.max(0, subtotal - totalDiscount);
    return Math.min(100, Math.round((net / threshold) * 100));
  }, [serverQuote, deliveryThreshold, subtotal, totalDiscount]);

  // Out of stock validation checking against latest Laravel POS database
  const outOfStockItems = useMemo(() => {
    if (!serverQuote?.items) return [];
    return serverQuote.items.filter((it) => it.in_stock === false || it.available_qty < it.qty);
  }, [serverQuote]);

  const hasOutOfStockItems = outOfStockItems.length > 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        subtotal,
        promoDiscount,
        memberDiscount,
        couponDiscount,
        totalDiscount,
        tax,
        taxPercent,
        shippingFee,
        total,
        freeShippingDifference,
        freeShippingProgress,
        appliedCoupon: serverQuote?.applied_coupon || (appliedCouponCode ? { code: appliedCouponCode } : null),
        appliedCouponCode,
        serverQuote,
        isQuoteLoading,
        quoteError,
        outOfStockItems,
        hasOutOfStockItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        addBundleToCart,
        updateQty,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshQuote: () => fetchAuthoritativeQuote(items, appliedCouponCode),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
