import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../i18n/LanguageContext';
import Input from '../components/forms/Input';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import { Lock, Mail, User, Phone, ArrowRight, Sparkles, ShieldCheck, Leaf } from 'lucide-react';

export default function AuthPage({ initialMode }) {
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(initialMode || (urlTab === 'register' ? 'register' : 'login'));

  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account/profile';

  // If already logged in, redirect to destination
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Sync tab if URL changes
  useEffect(() => {
    if (urlTab === 'register' || initialMode === 'register') {
      setActiveTab('register');
    } else if (urlTab === 'login' || initialMode === 'login') {
      setActiveTab('login');
    }
  }, [urlTab, initialMode]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors({});

    const errs = {};
    if (!loginEmail.trim()) errs.email = 'Email address is required.';
    if (!loginPassword.trim()) errs.password = 'Password is required.';

    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      return;
    }

    setLoginLoading(true);
    try {
      await login({ email: loginEmail.trim(), password: loginPassword });
      showToast('Welcome back to Élixir Botanique.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setLoginErrors({ general: err.userMessage || 'Invalid email or password credentials provided.' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegErrors({});

    const errs = {};
    if (!regData.name.trim()) errs.name = 'Full name is required.';
    if (!regData.email.trim()) errs.email = 'Valid email address is required.';
    if (!regData.password) errs.password = 'Password is required.';
    if (regData.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (regData.password !== regData.password_confirmation) {
      errs.password_confirmation = 'Passwords confirmation does not match.';
    }

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      return;
    }

    setRegLoading(true);
    try {
      await register({
        name: regData.name.trim(),
        email: regData.email.trim(),
        phone: regData.phone.trim() || undefined,
        address: regData.address.trim() || undefined,
        password: regData.password,
        password_confirmation: regData.password_confirmation,
      });
      showToast('Welcome! Your dispensary member account is ready.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setRegErrors({ general: err.userMessage || 'Registration failed. Please review the highlighted fields.' });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-md mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: activeTab === 'login' ? 'Client Sign In' : 'Create Account' }]} />

        {/* Luxury Authentication Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-9 shadow-xs">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-[11px] font-semibold tracking-wider uppercase mb-3">
              <Leaf size={12} />
              <span>Boutique Dispensary Access</span>
            </div>
            <h1 className="brand-logo-title font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-0.5">
              ÉLIXIR <span className="brand-italic font-serif italic text-[#71856B]">BOTANIQUE</span>
            </h1>
            <span className="brand-logo-tagline text-[9px] tracking-[0.16em] uppercase text-[#8C9388] block mb-2 font-medium">
              CLINICAL SKINCARE & DISPENSARY
            </span>
            <p className="text-xs text-[#5A6358] font-normal">
              {activeTab === 'login'
                ? 'Sign in to access your curated formulations and orders'
                : 'Join our dispensary circle for bespoke clinical regimens'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all ${
                activeTab === 'login'
                  ? 'bg-[#1F2520] text-white shadow-xs'
                  : 'text-[#5A6358] hover:text-[#1F2520]'
              }`}
            >
              {t('nav.sign_in') || 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all ${
                activeTab === 'register'
                  ? 'bg-[#1F2520] text-white shadow-xs'
                  : 'text-[#5A6358] hover:text-[#1F2520]'
              }`}
            >
              {t('nav.sign_up') || 'Register'}
            </button>
          </div>

          {/* SIGN IN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginErrors.general && (
                <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium">
                  {loginErrors.general}
                </div>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                icon={Mail}
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                error={loginErrors.email}
                autoFocus
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  error={loginErrors.password}
                />

                <div className="text-right pt-0.5">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#71856B] hover:text-[#1F2520] font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>{loginLoading ? 'Signing In...' : 'Sign In to Boutique'}</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center text-xs text-[#7A8578] pt-2">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[#71856B] hover:text-[#1F2520] font-semibold underline underline-offset-2 transition-colors ml-1"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regErrors.general && (
                <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium">
                  {regErrors.general}
                </div>
              )}

              <Input
                label="Full Name"
                name="reg_name"
                required
                icon={User}
                placeholder="Jane Doe"
                value={regData.name}
                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                error={regErrors.name}
              />

              <Input
                label="Email Address"
                name="reg_email"
                type="email"
                required
                icon={Mail}
                placeholder="jane@example.com"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                error={regErrors.email}
              />

              <Input
                label="Phone Number (Optional)"
                name="reg_phone"
                icon={Phone}
                placeholder="+855 12 345 678"
                value={regData.phone}
                onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
              />

              <Input
                label="Password"
                name="reg_password"
                type="password"
                required
                icon={Lock}
                placeholder="Min 6 characters"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                error={regErrors.password}
              />

              <Input
                label="Confirm Password"
                name="reg_password_confirmation"
                type="password"
                required
                icon={Lock}
                placeholder="Repeat password"
                value={regData.password_confirmation}
                onChange={(e) => setRegData({ ...regData, password_confirmation: e.target.value })}
                error={regErrors.password_confirmation}
              />

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>{regLoading ? 'Creating Account...' : 'Join Dispensary Circle'}</span>
                <Sparkles size={15} />
              </button>

              <div className="text-center text-xs text-[#7A8578] pt-2">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[#71856B] hover:text-[#1F2520] font-semibold underline underline-offset-2 transition-colors ml-1"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Member Guarantees */}
          <div className="mt-7 pt-5 border-t border-[#ECE8DE] flex items-center justify-center gap-4 text-[11px] text-[#7A8578]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#71856B]" /> Secure POS Sync
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles size={13} className="text-[#C29B38]" /> Member Privileges
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
