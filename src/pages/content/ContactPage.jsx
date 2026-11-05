import React, { useState } from 'react';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Your inquiry has been logged with our dispensary team.', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles size={13} />
            <span>Client Concierge &amp; Dispensary Care</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-3 leading-tight">
            We are Here to Guide Your Skin Health
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] max-w-xl mx-auto leading-relaxed font-normal">
            Have a question regarding active concentrations, batch dispatch times, or skin tolerance? Our formulation advisory team responds within 24 hours.
          </p>
        </div>

        {/* Content Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Left Column: Dispensary Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full">
              <div>
                <h3 className="font-serif text-xl font-normal text-[#1F2520] mb-6">
                  Dispensary Headquarters
                </h3>

                <div className="space-y-6 text-xs sm:text-sm text-[#5A6358]">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <strong className="block text-[#1F2520] font-semibold mb-0.5">
                        Physical Boutique &amp; Counter
                      </strong>
                      <span className="leading-relaxed block">
                        #42 Preah Norodom Blvd, Sangkat Phsar Thmey 1, Khan Daun Penh, Phnom Penh, Cambodia
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <strong className="block text-[#1F2520] font-semibold mb-0.5">
                        Client Care Line
                      </strong>
                      <a
                        href="tel:+85523888999"
                        className="text-[#71856B] hover:text-[#1F2520] font-semibold text-sm transition-colors"
                      >
                        +855 23 888 999
                      </a>
                      <span className="text-[11px] text-[#7A8578] block mt-0.5">
                        Direct connection to Phnom Penh dispensary desk
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <strong className="block text-[#1F2520] font-semibold mb-0.5">
                        Email Concierge
                      </strong>
                      <a
                        href="mailto:care@elixir-botanique.com"
                        className="text-[#71856B] hover:text-[#1F2520] block transition-colors font-medium"
                      >
                        care@elixir-botanique.com
                      </a>
                      <span className="text-[11px] text-[#7A8578] block mt-0.5">
                        dispensary@elixir-botanique.com (Wholesale &amp; Clinicians)
                      </span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <strong className="block text-[#1F2520] font-semibold mb-0.5">
                        Operating Hours
                      </strong>
                      <span className="block">
                        Monday – Saturday: 8:00 AM – 7:00 PM ICT
                      </span>
                      <span className="text-[11px] text-[#7A8578] block mt-0.5">
                        Sunday: Closed for sterile lab calibration &amp; batch compounding
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot notice */}
              <div className="mt-8 p-4 rounded-2xl bg-[#EEF2EB] border border-[#71856B]/20 text-xs text-[#5A6358] leading-relaxed">
                <strong className="text-[#1F2520] block mb-0.5">Instant Messaging Support:</strong>
                Connect via Telegram Support Bot <code className="text-[#71856B] font-semibold">@ElixirBotaniqueCare</code> or official WhatsApp hotline.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-9 shadow-xs">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
                Send a Clinical Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6358] mb-6">
                Receive personalized guidance from our licensed skincare consultants.
              </p>

              {submitted ? (
                <div className="text-center py-10 px-4">
                  <div className="w-14 h-14 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="font-serif text-xl font-normal text-[#1F2520] mb-2">
                    Inquiry Transmitted Successfully
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5A6358] max-w-sm mx-auto mb-6 leading-relaxed">
                    Thank you, <strong className="text-[#1F2520]">{form.name}</strong>. A dedicated skincare consultant has been assigned to your message and will reply within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'Order Inquiry',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full border border-[#1F2520] text-[#1F2520] hover:bg-[#1F2520] hover:text-white text-xs font-medium transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                      Full Name <span className="text-[#C55A48]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="e.g. Sreysros Chan"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                        Email Address <span className="text-[#C55A48]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="client@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        placeholder="012 345 678"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                      Topic of Inquiry
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                    >
                      <option value="Order Inquiry">Order Inquiry &amp; Dispatch Status</option>
                      <option value="Skin Consultation">Formulation &amp; Skin Consultation</option>
                      <option value="Returns Guarantee">14-Day Tolerance Return / Exchange</option>
                      <option value="Wholesale">Wholesale &amp; Dermatologist Supply</option>
                      <option value="General">General Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                      Message or Skin Regimen Details <span className="text-[#C55A48]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="Please specify your order invoice number, skin type, or formulation inquiry..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <Send size={15} />
                    <span>{loading ? 'Transmitting...' : 'Dispatch Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
