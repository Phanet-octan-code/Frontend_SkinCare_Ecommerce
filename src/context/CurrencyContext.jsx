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
    // Bootstrap store settings, currencies, and active zones in 1 round-trip
    storeService.getBootstrap()
      .then((res) => {
        const rawSettings = res?.data?.settings || res?.data;
        const rate = rawSettings?.exchange_rate_khr ?? rawSettings?.currency_exchange_rate;
        if (rate) {
          setExchangeRate(Number(rate));
        }
        if (rawSettings?.free_shipping_threshold) {
          setDeliveryThreshold(Number(rawSettings.free_shipping_threshold));
        }
        if (rawSettings?.standard_shipping_fee) {
          setStandardShipping(Number(rawSettings.standard_shipping_fee));
        }
        const zones = res?.data?.shipping_zones || rawSettings?.shipping_zones;
        if (Array.isArray(zones)) {
          setShippingZones(zones);
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
