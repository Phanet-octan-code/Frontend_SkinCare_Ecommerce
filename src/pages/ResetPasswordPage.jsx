import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../i18n/LanguageContext';
import Input from '../components/forms/Input';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const fieldErrors = {};
    if (!email.trim()) fieldErrors.email = 'Registered email address is required.';
    if (!token.trim()) fieldErrors.token = 'Reset verification token is missing.';
    if (!password) fieldErrors.password = 'New password is required.';
    if (password.length < 6) fieldErrors.password = 'Password must be at least 6 characters.';
    if (password !== passwordConfirmation) {
      fieldErrors.password_confirmation = 'Passwords confirmation does not match.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        token: token.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      showToast('Password reset successfully. You may now sign in with your new credentials.', 'success');
      navigate('/login');
    } catch (err) {
      setErrors({
        general: err.userMessage || 'Password reset token expired or invalid. Please request a new recovery link.',
      });
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
            { label: 'Set New Password' },
          ]}
        />

        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-9 shadow-xs">
          {/* Circular Key Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#71856B] border border-[#71856B]/20 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Lock size={20} strokeWidth={1.8} />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-2">
              Set New Password
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6358] font-normal leading-relaxed">
              Create a secure passphrase to safeguard your clinical dispensary account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium">
                {errors.general}
              </div>
            )}

            <Input
              label="Registered Email Address"
              name="email"
              type="email"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="Reset Verification Token"
              name="token"
              required
              icon={KeyRound}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token from email"
              error={errors.token}
            />

            <Input
              label="New Password"
              name="password"
              type="password"
              required
              icon={Lock}
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Input
              label="Confirm New Password"
              name="password_confirmation"
              type="password"
              required
              icon={Lock}
              placeholder="Repeat new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              error={errors.password_confirmation}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Updating Credentials...' : 'Save New Password'}</span>
              <ArrowRight size={15} />
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-[#71856B] hover:text-[#1F2520] font-medium transition-colors"
              >
                Return to Client Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
