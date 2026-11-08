import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import { Check, AlertCircle, AlertTriangle, Sparkles, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const { openCart } = useCart();
  const navigate = useNavigate();

  if (!toasts.length) return null;

  const renderMiniIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-4.5 h-4.5 rounded-full bg-[#71856B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Check size={11} strokeWidth={2.8} />
          </div>
        );
      case 'error':
        return (
          <div className="w-4.5 h-4.5 rounded-full bg-[#C55A48] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <AlertCircle size={11} strokeWidth={2.8} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-4.5 h-4.5 rounded-full bg-[#C29B38] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle size={11} strokeWidth={2.8} />
          </div>
        );
      default:
        return (
          <div className="w-4.5 h-4.5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles size={11} strokeWidth={2.8} />
          </div>
        );
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1300] flex flex-col-reverse items-end gap-2 sm:gap-2.5 pointer-events-none select-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const lowerMsg = (toast.message || '').toLowerCase();
        const isAuthNotice =
          lowerMsg.includes('sign in') ||
          lowerMsg.includes('register') ||
          lowerMsg.includes('log in') ||
          lowerMsg.includes('account');

        const isCartNotice =
          !isAuthNotice && (lowerMsg.includes('bag') || lowerMsg.includes('cart'));

        // Extract product name if enclosed in quotes: e.g. Added "Dermalogica Daily Microfoliant" to your bag
        const match = toast.message.match(/"([^"]+)"/);
        const productName = match ? match[1] : null;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto relative flex items-center gap-2 sm:gap-2.5 pl-3 pr-2 py-1.5 sm:py-2 rounded-full bg-[#1F2520]/95 backdrop-blur-md text-white border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.22)] animate-[toastSlideUp_0.22s_cubic-bezier(0.16,1,0.3,1)] transition-all max-w-[calc(100vw-32px)] sm:max-w-md group"
          >
            {/* Minimal Status Icon */}
            {renderMiniIcon(toast.type)}

            {/* Single-line Clean Typography */}
            <div className="text-xs text-white/95 flex items-center gap-1.5 min-w-0 pr-1">
              {productName ? (
                <>
                  <span className="font-semibold text-white shrink-0">Added to bag</span>
                  <span className="text-white/30 shrink-0">•</span>
                  <span className="text-white/85 truncate max-w-[130px] sm:max-w-[200px]">
                    {productName}
                  </span>
                </>
              ) : (
                <span className="text-white/90 truncate max-w-[220px] sm:max-w-[280px]">
                  {toast.message}
                </span>
              )}
            </div>

            {/* Quick "Sign In" & "Register" Actions for Auth requirement */}
            {isAuthNotice && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login', { state: { from: window.location.pathname } });
                    removeToast(toast.id);
                  }}
                  className="text-[11px] sm:text-xs font-semibold text-[#A3C293] hover:text-white px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all shrink-0 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login?tab=register', { state: { from: window.location.pathname } });
                    removeToast(toast.id);
                  }}
                  className="text-[11px] sm:text-xs font-semibold text-white/90 hover:text-white px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all shrink-0 cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Quick "View" Action for Cart items */}
            {isCartNotice && (
              <button
                type="button"
                onClick={() => {
                  openCart();
                  removeToast(toast.id);
                }}
                className="text-[11px] sm:text-xs font-semibold text-[#A3C293] hover:text-white px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all shrink-0 cursor-pointer"
              >
                View
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-3 bg-white/15 shrink-0" />

            {/* Minimal Close (✕) */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
