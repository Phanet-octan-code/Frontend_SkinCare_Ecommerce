/**
 * Shared formatters for SkinCare E-Commerce
 */

/**
 * Format price according to currency and optional exchange rate
 * @param {number|string} amount - price in base USD
 * @param {string} currency - 'USD' or 'KHR'
 * @param {number} exchangeRate - rate for 1 USD to KHR (default 4100)
 * @returns {string} Formatted price string
 */
export function formatPrice(amount, currency = 'USD', exchangeRate = 4100) {
  const num = Number(amount) || 0;

  if (currency === 'KHR') {
    const khrAmount = Math.round(num * exchangeRate);
    return `${khrAmount.toLocaleString('en-US')} ៛`;
  }

  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format order price using the order's permanently preserved historical currency and rate.
 * Guarantees historical transactions never silently change if store live rates change later.
 * @param {Object} order
 * @returns {string}
 */
export function formatOrderPrice(order) {
  if (!order) return '$0.00';
  if (order.formatted_final_total) return order.formatted_final_total;

  const currency = order.currency || 'USD';
  const rate = Number(order.exchange_rate) || 4100;
  const baseTotal = Number(order.final_total) || 0;

  return formatPrice(baseTotal, currency, rate);
}

/**
 * Format date string into readable format with locale support
 * @param {string|Date} dateString
 * @param {boolean} includeTime
 * @param {string} locale - 'en' or 'km'
 * @returns {string}
 */
export function formatDate(dateString, includeTime = false, locale = 'en') {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const intlLocale = locale === 'km' ? 'km-KH' : 'en-US';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    };
    return new Intl.DateTimeFormat(intlLocale, options).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Localized number formatting
 * @param {number|string} number
 * @param {string} locale
 * @returns {string}
 */
export function formatNumber(number, locale = 'en') {
  const num = Number(number) || 0;
  const intlLocale = locale === 'km' ? 'km-KH' : 'en-US';
  return new Intl.NumberFormat(intlLocale).format(num);
}

/**
 * Safe text truncation
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}...`;
}

/**
 * Format order status with human-readable labels
 * @param {string} status
 * @returns {{ label: string, className: string }}
 */
export function formatOrderStatus(status) {
  const map = {
    pending: { label: 'Pending Processing', className: 'badge-gold' },
    processing: { label: 'In Preparation', className: 'badge-primary' },
    shipped: { label: 'Shipped / In Transit', className: 'badge-primary' },
    delivered: { label: 'Delivered', className: 'badge-success' },
    cancelled: { label: 'Cancelled', className: 'badge-danger' },
    completed: { label: 'Completed', className: 'badge-success' },
  };

  return map[status?.toLowerCase()] || { label: status || 'Pending', className: 'badge-subtle' };
}
