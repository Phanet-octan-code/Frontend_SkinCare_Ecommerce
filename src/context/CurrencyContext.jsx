import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatPrice } from '../utils/formatters';
import storeService from '../services/storeService';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('skincare_currency') || 'USD';
  });
  const [exchangeRate, setExchangeRate] = useState(4100);
  const [deliveryThreshold, setDeliveryThreshold] = useState(50.0);
  const [standardShipping, setStandardShipping] = useState(2.5);
  const [shippingZones, setShippingZones] = useState([]);

  useEffect(() => {
    // Fetch store settings to get configured exchange rate, delivery fee, and shipping zones
    storeService.getSettings()
      .then((res) => {
        const rate = res?.data?.exchange_rate_khr ?? res?.data?.currency_exchange_rate;
        if (rate) {
          setExchangeRate(Number(rate));
        }
        if (res?.data?.free_shipping_threshold) {
          setDeliveryThreshold(Number(res.data.free_shipping_threshold));
        }
        if (res?.data?.standard_shipping_fee) {
          setStandardShipping(Number(res.data.standard_shipping_fee));
        }
        if (Array.isArray(res?.data?.shipping_zones)) {
          setShippingZones(res.data.shipping_zones);
        }
      })
      .catch(() => {
        // Fallback to default values gracefully
      });
  }, []);

  const setCurrency = useCallback((curr) => {
    setCurrencyState(curr);
    localStorage.setItem('skincare_currency', curr);
  }, []);

  const format = useCallback(
    (amount) => formatPrice(amount, currency, exchangeRate),
    [currency, exchangeRate]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        deliveryThreshold,
        standardShipping,
        shippingZones,
        format,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
