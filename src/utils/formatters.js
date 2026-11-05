/**
 * Shared formatters for SkinCare E-Commerce
 */

/**
 * Format price according to currency and optional exchange rate
 * @param {number|string} amount - price in USD
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
 * Format date string into readable format
 * @param {string|Date} dateString
 * @param {boolean} includeTime
 * @returns {string}
 */
export function formatDate(dateString, includeTime = false) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return dateString;
  }
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
