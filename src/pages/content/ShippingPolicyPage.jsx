import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import {
  Truck,
  Clock,
  ThermometerSnowflake,
  ArrowRight,
} from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Shipping & Delivery Policy' }]} />

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-xs font-semibold tracking-wider uppercase mb-3">
            <Truck size={13} />
            <span>Fulfillment &amp; Cold-Chain Care</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-3 leading-tight">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] max-w-xl mx-auto leading-relaxed font-normal">
            Formulations dispatched with pharmaceutical precision from our temperature-controlled dispensary in Phnom Penh.
          </p>
        </div>

        {/* 3 Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <Truck size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Complimentary Over $50
            </strong>
            <span className="text-xs text-[#7A8578] block">
              Nationwide express courier for orders exceeding $50.00 USD.
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <Clock size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Same-Day Dispatch
            </strong>
            <span className="text-xs text-[#7A8578] block">
              Orders in Phnom Penh placed before 2:00 PM ICT dispatched same-day.
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <ThermometerSnowflake size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Thermal Insulation
            </strong>
            <span className="text-xs text-[#7A8578] block">
              Protected against heat to safeguard active vitamins &amp; peptides.
            </span>
          </div>
        </div>

        {/* Detailed Policy Content */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-7 sm:p-10 shadow-xs mb-10 sm:mb-12 text-sm text-[#5A6358] leading-relaxed space-y-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-3">
              1. Delivery Zones, Rates &amp; Timelines
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[#ECE8DE] mt-3">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF9F5] border-b border-[#ECE8DE] text-xs font-bold text-[#71856B] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 sm:px-4">Destination Zone</th>
                    <th className="p-3.5 sm:px-4">Standard Rate</th>
                    <th className="p-3.5 sm:px-4">Free Delivery Threshold</th>
                    <th className="p-3.5 sm:px-4">Transit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE8DE]">
                  <tr>
                    <td className="p-3.5 sm:px-4 font-semibold text-[#1F2520]">Phnom Penh Urban Districts</td>
                    <td className="p-3.5 sm:px-4">$1.50</td>
                    <td className="p-3.5 sm:px-4 text-[#71856B] font-semibold">Orders $50.00+</td>
                    <td className="p-3.5 sm:px-4">Same-Day / 24 Hours</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 sm:px-4 font-semibold text-[#1F2520]">Provincial Hubs (Siem Reap, Battambang, Sihanoukville)</td>
                    <td className="p-3.5 sm:px-4">$2.00 – $2.50</td>
                    <td className="p-3.5 sm:px-4 text-[#71856B] font-semibold">Orders $50.00+</td>
                    <td className="p-3.5 sm:px-4">24 – 48 Hours</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 sm:px-4 font-semibold text-[#1F2520]">Outlying Communes &amp; Border Zones</td>
                    <td className="p-3.5 sm:px-4">$2.50 – $3.00</td>
                    <td className="p-3.5 sm:px-4 text-[#71856B] font-semibold">Orders $60.00+</td>
                    <td className="p-3.5 sm:px-4">48 – 72 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              2. Heat-Sensitive Skincare Protection
            </h2>
            <p className="mb-3">
              Dermatological formulations containing unbuffered Vitamin C (L-Ascorbic Acid), Retinoids, and Ceramide lipids degrade rapidly when exposed to tropical heat (exceeding 32°C). To preserve active bio-potency:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Formulations housed in pharmaceutical-grade amber glass or airless pump dispensers.</li>
              <li>Outbound packages feature reflective thermal bubble mailers to maintain ambient conditions.</li>
              <li>Couriers transport consignments in shaded, climate-regulated vehicles.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              3. Real-Time Tracking &amp; Verification
            </h2>
            <p>
              Once your order is sealed at our dispensary desk, our central POS generates an official courier tracking waybill. You can monitor your consignment at any moment on our{' '}
              <Link to="/track" className="text-[#71856B] hover:text-[#1F2520] font-semibold underline underline-offset-2">
                Live Order Tracking
              </Link>{' '}
              portal using your invoice number.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              4. Cash on Delivery (COD) Protocol
            </h2>
            <p>
              For customers selecting Cash on Delivery, our concierge may call or message prior to dispatch to verify courier handoff availability. If contact cannot be established within 48 hours, the order is cancelled to release held inventory back to our central store stock.
            </p>
          </div>
        </div>

        {/* Track Now CTA Banner */}
        <div className="rounded-3xl bg-[#FAF9F5] border border-[#ECE8DE] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-1">
              Already have an order in transit?
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358]">
              Verify fulfillment milestones directly using your invoice number.
            </p>
          </div>
          <Link
            to="/track"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] shrink-0"
          >
            <span>Track Order Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
