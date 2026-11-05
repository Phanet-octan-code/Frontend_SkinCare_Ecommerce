import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import {
  RotateCcw,
  Clock,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Returns & Tolerance Guarantee' }]} />

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-xs font-semibold tracking-wider uppercase mb-3">
            <RotateCcw size={13} />
            <span>14-Day Tolerance Policy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-3 leading-tight">
            Returns, Exchanges &amp; Tolerance Guarantee
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] max-w-xl mx-auto leading-relaxed font-normal">
            Your skin health is our highest priority. We safeguard every purchase with verified clinical authenticity and client satisfaction guarantees.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <Clock size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              14-Day Evaluation Window
            </strong>
            <span className="text-xs text-[#7A8578] block">
              14 calendar days from delivery to request an exchange or refund.
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Adverse Reaction Care
            </strong>
            <span className="text-xs text-[#7A8578] block">
              Immediate replacement formulation if skin sensitivity occurs.
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <RotateCcw size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Complimentary Pickup
            </strong>
            <span className="text-xs text-[#7A8578] block">
              Courier collection arranged for damaged or incorrect deliveries.
            </span>
          </div>
        </div>

        {/* Detailed Policy Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-7 sm:p-10 shadow-xs mb-10 sm:mb-12 text-sm text-[#5A6358] leading-relaxed space-y-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              1. The 14-Day Skin Tolerance Guarantee
            </h2>
            <p>
              We understand that individual skin biomes respond uniquely to high-potency clinical actives (such as Vitamin C, Niacinamide, AHA/BHA exfoliants, and Retinoids). If an active formula purchased from our dispensary causes sustained irritation or unexpected skin intolerance:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm mt-2">
              <li>Contact our clinical concierge team within 14 days of receiving your package.</li>
              <li>Provide details regarding your regimen, frequency of application, and experienced reaction.</li>
              <li>Our team will recommend an alternative soothing barrier formula and coordinate a seamless exchange or store credit.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              2. Eligibility Criteria for Standard Returns
            </h2>
            <p className="mb-2">
              To be eligible for a standard return, exchange, or refund:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Item must be in its original packaging with unbroken tamper seals (unless returning under the Tolerance Guarantee).</li>
              <li>Proof of purchase (invoice number, receipt, or registered member email) must be provided.</li>
              <li>Items must have been purchased directly from our official online dispensary or Phnom Penh boutique.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              3. Damaged or Discrepant Deliveries
            </h2>
            <p>
              In the rare event that glass containers fracture or an incorrect product is delivered, please photograph the parcel and notify us within 48 hours of courier drop-off. We will immediately dispatch a replacement parcel via express courier at zero cost to you.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              4. Refund Settlement Timeframes
            </h2>
            <p>
              Approved refunds are credited through the original payment channel:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm mt-2">
              <li><strong>Bakong KHQR / Bank Transfer:</strong> Processed within 24 hours of return receipt.</li>
              <li><strong>Credit / Debit Cards:</strong> 3–7 business days depending on your issuing bank.</li>
              <li><strong>Cash on Delivery (COD):</strong> Reimbursed via KHQR bank transfer or boutique credit voucher.</li>
            </ul>
          </div>
        </div>

        {/* Support Card */}
        <div className="rounded-3xl bg-[#FAF9F5] border border-[#ECE8DE] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-1">
              Need to initiate a return or exchange?
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358]">
              Our concierge desk is ready to review your invoice details.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <MessageSquare size={14} />
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
