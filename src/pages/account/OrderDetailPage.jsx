import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatDate, formatOrderStatus } from '../../utils/formatters';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import AccountNav from '../../components/navigation/AccountNav';
import { DetailSkeleton } from '../../components/feedback/LoadingSkeleton';
import ErrorState from '../../components/feedback/ErrorState';
import {
  Package,
  Truck,
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
  ExternalLink,
  XCircle,
} from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (!window.confirm(`Are you sure you want to cancel Order #${order.invoice_number}? Items will be returned to store inventory.`)) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await orderService.cancelOrder(order.id, 'Customer requested cancellation via portal');
      if (res?.success) {
        showToast(`Order #${order.invoice_number} has been cancelled.`, 'info');
        setOrder(res.order || { ...order, status: 'cancelled' });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel this order.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    async function fetchOrderDetails() {
      setLoading(true);
      setError(null);

      try {
        const res = await orderService.getOrder(id);
        if (res?.data) {
          setOrder(res.data);
        } else {
          setError('Order receipt not found.');
        }
      } catch (err) {
        setError(err.userMessage || 'Could not load order details or you do not have permission to view this order.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
        <div className="container max-w-lg mx-auto px-4">
          <ErrorState
            title="Receipt Unavailable"
            message={error || 'We could not retrieve this order record.'}
            actionText="Return to Order History"
            onAction={() => navigate('/account/orders')}
          />
        </div>
      </div>
    );
  }

  const statusInfo = formatOrderStatus(order.status);
  const items = order.items || order.details || [];

  // Fulfillment steps timeline calculation
  const statusLower = (order.status || '').toLowerCase();
  const isDelivered = statusLower === 'delivered' || statusLower === 'completed';
  const isShipped = isDelivered || statusLower === 'shipped';
  const isProcessing = isShipped || statusLower === 'processing';
  const isPlaced = true;

  const timelineSteps = [
    { label: 'Order Placed', completed: isPlaced, date: formatDate(order.sale_date || order.created_at) },
    { label: 'Payment Confirmed', completed: isProcessing, date: isProcessing ? 'Verified' : 'Pending' },
    { label: 'Dispatched / In Transit', completed: isShipped, date: order.tracking_number || 'Awaiting Courier' },
    { label: 'Doorstep Delivered', completed: isDelivered, date: isDelivered ? 'Received' : 'Estimated 1–2 Days' },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('account.client_portal') || 'Client Portal', link: '/account/profile' },
            { label: t('account.order_history') || 'Order History', link: '/account/orders' },
            { label: `#${order.invoice_number}` },
          ]}
        />

        {/* Global Account Navigation Bar */}
        <AccountNav />

        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#71856B] hover:text-[#1F2520] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t('account.my_orders') || 'Back to Order History'}</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            {['pending', 'confirmed'].includes((order.status || '').toLowerCase()) && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 rounded-full border border-[#C55A48] text-[#C55A48] hover:bg-[#C55A48]/10 text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all"
              >
                <XCircle size={14} />
                <span>{isCancelling ? 'Cancelling...' : 'Cancel Order'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full border border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520] text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all bg-white"
            >
              <Printer size={14} />
              <span>Print Receipt</span>
            </button>

            <Link
              to={`/track?query=${encodeURIComponent(order.invoice_number)}`}
              className="px-5 py-2 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <Truck size={14} />
              <span>Live Courier Track</span>
            </Link>
          </div>
        </div>

        {/* Order Header Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-[0.14em] text-[#71856B] block mb-1">
                Official Clinical Dispensary Receipt
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-1">
                Order #{order.invoice_number}
              </h1>
              <p className="text-xs text-[#7A8578]">
                Placed on {formatDate(order.sale_date || order.created_at)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === 'completed' || order.status === 'paid'
                  ? 'bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/20'
                  : order.status === 'cancelled'
                  ? 'bg-[#C55A48]/10 text-[#C55A48] border border-[#C55A48]/20'
                  : 'bg-[#C29B38]/10 text-[#C29B38] border border-[#C29B38]/20'
              }`}>
                {statusInfo.label}
              </span>
              <div className="mt-2 text-xl sm:text-2xl font-bold text-[#1F2520]">
                {format(order.final_total ?? order.total)}
              </div>
            </div>
          </div>

          {/* Fulfillment Journey Stepper */}
          <div className="mt-8 pt-6 border-t border-[#ECE8DE]">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1F2520] mb-4">
              Fulfillment Journey & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {timelineSteps.map((step) => (
                <div
                  key={step.label}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    step.completed
                      ? 'bg-[#EEF2EB] border-[#71856B]/30'
                      : 'bg-[#FAF9F5] border-[#ECE8DE]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {step.completed ? (
                      <CheckCircle2 size={16} className="text-[#71856B] shrink-0" />
                    ) : (
                      <Clock size={16} className="text-[#7A8578] shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${step.completed ? 'text-[#1F2520]' : 'text-[#7A8578]'}`}>
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7A8578] block truncate">
                    {step.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dual Delivery & Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Shipping Destination */}
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-5 sm:p-6 shadow-xs">
            <h3 className="font-serif text-base font-semibold text-[#1F2520] flex items-center gap-2 mb-3">
              <MapPin size={17} className="text-[#71856B]" />
              <span>Delivery Destination</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed">
              {order.shipping_address || 'Boutique Courier Hand-Delivery Destination'}
            </p>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-5 sm:p-6 shadow-xs">
            <h3 className="font-serif text-base font-semibold text-[#1F2520] flex items-center gap-2 mb-3">
              <CreditCard size={17} className="text-[#71856B]" />
              <span>Payment Details</span>
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-[#5A6358]">
              <div>
                <strong className="text-[#1F2520]">Method:</strong> {(order.payment_type || order.payment_method || 'Bakong KHQR / Card').toUpperCase()}
              </div>
              <div>
                <strong className="text-[#1F2520]">Payment Status:</strong> <span className="capitalize">{order.payment_status || 'Pending'}</span>
              </div>
              <div className="text-[11px] text-[#7A8578]">
                ✓ Synchronized with SkinCare Central POS Inventory
              </div>
            </div>
          </div>
        </div>

        {/* Dispensed Items Table */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs mb-6">
          <h3 className="font-serif text-lg font-semibold text-[#1F2520] mb-4">
            Dispensed Formulations ({items.length})
          </h3>

          <div className="divide-y divide-[#ECE8DE]">
            {items.map((item) => {
              const product = item.product || {};
              const productName = item.product_name || product.name || `Formulation #${item.product_id}`;
              const productImage = item.product_image || product.image_url;
              const unitPrice = Number(item.price ?? item.unit_price ?? 0);
              const quantity = Number(item.qty ?? item.quantity ?? 1);
              const lineTotal = Number(item.subtotal ?? item.total ?? unitPrice * quantity);

              return (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] overflow-hidden flex items-center justify-center shrink-0 p-1">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      ) : (
                        <Package size={20} className="text-[#7A8578]" />
                      )}
                    </div>

                    <div>
                      <Link
                        to={`/products/${item.product_id || product.id}`}
                        className="text-xs sm:text-sm font-semibold text-[#1F2520] hover:text-[#71856B] block mb-0.5"
                      >
                        {productName}
                      </Link>
                      <span className="text-xs text-[#7A8578]">
                        Quantity: {quantity} × {format(unitPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-[#1F2520]">
                      {format(lineTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Summary */}
          <div className="mt-6 pt-4 border-t border-[#ECE8DE] flex flex-col gap-2 max-w-xs ml-auto text-xs sm:text-sm text-[#5A6358]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1F2520]">{format(order.subtotal ?? (order.final_total ?? order.total))}</span>
            </div>

            {Number(order.discount ?? order.discount_amount ?? 0) > 0 && (
              <div className="flex justify-between text-[#71856B] font-medium">
                <span>Promotional Savings:</span>
                <span>-{format(order.discount ?? order.discount_amount)}</span>
              </div>
            )}

            {Number(order.tax ?? 0) > 0 && (
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span className="font-semibold text-[#1F2520]">{format(order.tax)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Courier Delivery:</span>
              <span className="text-[#71856B] font-medium">
                {Number(order.shipping_fee ?? 0) === 0 ? 'Complimentary' : format(order.shipping_fee)}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#ECE8DE] text-sm sm:text-base font-bold text-[#1F2520]">
              <span>Total Paid:</span>
              <span>{format(order.final_total ?? order.total)}</span>
            </div>
          </div>
        </div>

        {/* Concierge Assistance Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A6358]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#71856B] shrink-0" />
            <span>Need assistance with this order? Contact our clinical care concierge at +855 23 888 999.</span>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#71856B] hover:text-[#1F2520] shrink-0 transition-colors"
          >
            Browse New Formulations →
          </Link>
        </div>
      </div>
    </div>
  );
}
