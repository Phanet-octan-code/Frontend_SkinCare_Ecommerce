import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  FileCheck,
  CheckCircle2,
  Mail,
  UserCheck,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-xs font-semibold tracking-wider uppercase mb-3">
            <Lock size={13} />
            <span>Data Governance &amp; Security</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-3 leading-tight">
            Client Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] max-w-xl mx-auto leading-relaxed font-normal">
            We hold your dermatological consultation notes and purchasing history with strict clinical confidentiality.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <Lock size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              End-to-End Encryption
            </strong>
            <span className="text-xs text-[#7A8578] block">
              All payment transactions tokenized; raw card digits never saved.
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <UserCheck size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Zero Data Selling
            </strong>
            <span className="text-xs text-[#7A8578] block">
              We never broker, monetize, or sell customer profiles to advertisers.
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 text-center shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-3">
              <Database size={20} />
            </div>
            <strong className="block text-sm sm:text-base font-serif font-semibold text-[#1F2520] mb-1">
              Controlled Access
            </strong>
            <span className="text-xs text-[#7A8578] block">
              Strict role-based access controls across our centralized POS database.
            </span>
          </div>
        </div>

        {/* Policy Content Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-7 sm:p-10 shadow-xs mb-10 sm:mb-12 text-sm text-[#5A6358] leading-relaxed space-y-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              1. Information We Collect
            </h2>
            <p>
              When interacting with our clinical ecommerce platform, we collect only the necessary parameters required for order fulfillment and personalized consultations:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm mt-2">
              <li><strong>Contact Information:</strong> Name, delivery address, phone number, and email.</li>
              <li><strong>Account Credentials:</strong> Hashed passwords and secure session tokens.</li>
              <li><strong>Order History:</strong> Formulations purchased, transaction references, and courier waybill numbers.</li>
              <li><strong>Regimen Notes:</strong> Voluntary skin concern inputs provided during consultation or product reviews.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              2. How Your Information is Utilized
            </h2>
            <p className="mb-2">
              Information collected is utilized strictly to:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Process and verify payment authorizations through Bakong KHQR and partner gateways.</li>
              <li>Dispatch and route couriers to your designated delivery destination.</li>
              <li>Transmit real-time SMS and email tracking links for your consignment.</li>
              <li>Deliver personalized skincare recommendations and member loyalty privileges.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              3. Protection of Financial Credentials
            </h2>
            <p>
              All payment transactions are conducted over encrypted HTTPS connections (TLS 1.3). Bakong KHQR transfers utilize cryptographically signed QR payloads. Credit and debit card authorizations utilize tokenized merchant APIs conforming to PCI-DSS standards; our servers never receive or store complete credit card numbers or CVV codes.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
              4. Client Rights &amp; Data Erasure
            </h2>
            <p>
              You maintain the absolute right to inspect, update, or request the erasure of your personal account data at any time. To request complete profile deletion or receive a copy of your stored records, contact our compliance officer at{' '}
              <a href="mailto:privacy@elixir-botanique.com" className="text-[#71856B] hover:text-[#1F2520] font-semibold underline">
                privacy@elixir-botanique.com
              </a>.
            </p>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="rounded-3xl bg-[#FAF9F5] border border-[#ECE8DE] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-1">
              Questions regarding our privacy governance?
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358]">
              Our legal and compliance team is available to assist.
            </p>
          </div>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
          >
            <span>Contact Privacy Officer</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
