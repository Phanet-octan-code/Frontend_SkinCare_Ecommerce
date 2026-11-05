import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../i18n/LanguageContext';
import Input from '../components/forms/Input';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email: email.trim() });
      setSuccessInfo({
        message: res.message || 'Password reset instructions have been dispatched to your email address.',
        email: email.trim(),
      });
      showToast('Reset email dispatched successfully.', 'success');
    } catch (err) {
      setError(err.userMessage || 'Could not find an account associated with that email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-md mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Client Sign In', link: '/login' },
            { label: 'Password Recovery' },
          ]}
        />

        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-9 shadow-xs">
          {/* Circular Key Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#71856B] border border-[#71856B]/20 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <KeyRound size={20} strokeWidth={1.8} />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-2">
              Password Recovery
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6358] font-normal leading-relaxed">
              Enter your registered dispensary email to receive verification credentials.
            </p>
          </div>

          {successInfo ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl bg-[#EEF2EB] border border-[#71856B]/20 text-xs sm:text-sm text-[#1F2520] leading-relaxed">
                <CheckCircle2 size={24} className="text-[#71856B] mx-auto mb-2" />
                <p className="font-semibold text-[#1F2520] mb-1">Recovery Link Dispatched</p>
                <p className="text-[#5A6358]">
                  We have forwarded password reset instructions to <strong className="text-[#1F2520]">{successInfo.email}</strong>.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full py-3 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <ArrowLeft size={15} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Registered Email Address"
                name="email"
                type="email"
                required
                icon={Mail}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Transmitting...' : 'Dispatch Reset Link'}</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#71856B] hover:text-[#1F2520] font-medium transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Client Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
