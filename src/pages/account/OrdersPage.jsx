import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatDate, formatOrderStatus } from '../../utils/formatters';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import AccountNav from '../../components/navigation/AccountNav';
import EmptyState from '../../components/feedback/EmptyState';
import { Package, Truck, Eye, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();
  const { t } = useTranslation();

  useEffect(() => {
    orderService
      .getOrders()
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setOrders(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('account.client_portal') || 'Client Portal', link: '/account/profile' },
            { label: t('account.order_history') || 'Order History' },
          ]}
        />

        {/* Global Account Navigation Bar */}
        <AccountNav />

        {/* Section Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-1">
            {t('account.my_orders') || 'Order History & Receipts'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6358] font-normal">
            {t('account.orders_desc') || 'Review all fulfilled dispensations, live courier dispatches, and invoices.'}
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-white border border-[#ECE8DE] p-6 h-28 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-8 sm:p-12 shadow-xs text-center">
            <EmptyState
              icon={Package}
              title={t('account.no_orders_title') || 'No Orders Yet'}
              description={t('account.no_orders_desc') || 'Your dispensary order log is currently empty. Explore our catalog of active botanical formulations.'}
              actionText={t('account.explore_dispensary') || 'Explore Formulations'}
              actionLink="/shop"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = formatOrderStatus(order.status);
              const itemCount = order.items?.length || order.details?.length || order.details_count || 1;

              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs hover:border-[#71856B]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-serif text-base sm:text-lg font-semibold text-[#1F2520] tracking-wide">
                        #{order.invoice_number}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === 'completed' || order.status === 'paid'
                          ? 'bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/20'
                          : order.status === 'cancelled'
                          ? 'bg-[#C55A48]/10 text-[#C55A48] border border-[#C55A48]/20'
                          : 'bg-[#C29B38]/10 text-[#C29B38] border border-[#C29B38]/20'
                      }`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#7A8578] flex-wrap">
                      <span>{t('order_success.order_date') || 'Placed'}: <strong className="text-[#1F2520] font-medium">{formatDate(order.sale_date || order.created_at)}</strong></span>
                      <span>•</span>
                      <span>{itemCount} {itemCount === 1 ? 'Formulation' : 'Formulations'}</span>
                      {order.tracking_number && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[#71856B]">Tracking: {order.tracking_number}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[#ECE8DE]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A8578] block">
                        Order Total
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#1F2520]">
                        {format(order.final_total ?? order.total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                      >
                        <Eye size={13} />
                        <span>{t('account.view_details') || 'Details'}</span>
                      </Link>

                      <Link
                        to={`/track?query=${encodeURIComponent(order.invoice_number)}`}
                        className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520] text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all"
                        title="Track courier dispatch"
                      >
                        <Truck size={13} />
                        <span className="hidden xs:inline">{t('account.track_order') || 'Track'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
