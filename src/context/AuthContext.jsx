import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => localStorage.getItem('skincare_customer_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('skincare_customer_token');
    if (!currentToken) {
      setIsLoading(false);
      return null;
    }
    try {
      const res = await authService.getProfile();
      const cust = res.customer || res.data?.customer || res.data;
      setCustomer(cust);
      return cust;
    } catch {
      setCustomer(null);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Listen for unauthorized events triggered by API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setCustomer(null);
      setToken(null);
      showToast('Your session has expired. Please sign in again.', 'warning');
    };

    window.addEventListener('skincare:auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('skincare:auth-unauthorized', handleUnauthorized);
  }, [showToast]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const newToken = res.token || res.data?.token;
    const newCustomer = res.customer || res.data?.customer || res.data;
    setToken(newToken);
    setCustomer(newCustomer);
    window.dispatchEvent(new Event('skincare:auth-login'));
    showToast(`Welcome back, ${newCustomer?.name || 'Customer'}!`, 'success');
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const newToken = res.token || res.data?.token;
    const newCustomer = res.customer || res.data?.customer || res.data;
    setToken(newToken);
    setCustomer(newCustomer);
    window.dispatchEvent(new Event('skincare:auth-login'));
    showToast(`Welcome to SkinCare Luxury Boutique, ${newCustomer?.name}!`, 'success');
    return res;
  };

  const forgotPassword = async (data) => {
    const res = await authService.forgotPassword(data);
    return res;
  };

  const resetPassword = async (data) => {
    const res = await authService.resetPassword(data);
    const newToken = res.token || res.data?.token;
    const newCustomer = res.customer || res.data?.customer || res.data;
    if (newToken) {
      setToken(newToken);
      setCustomer(newCustomer);
    }
    showToast('Your password has been successfully reset.', 'success');
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed even if backend request fails
    } finally {
      setCustomer(null);
      setToken(null);
      showToast('You have been logged out safely.', 'info');
    }
  };

  const updateCustomerState = (updatedCustomer) => {
    setCustomer(updatedCustomer);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: Boolean(token && customer),
        isLoading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        refreshProfile,
        updateCustomerState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
