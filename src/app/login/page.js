'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { user, isAuthenticated, login, register, isLoading } = useAuth();

  // Mode: 'signin' or 'register'
  const [mode, setMode] = useState('signin');

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, user, redirectUrl, router]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    const result = await login({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccessMsg('Welcome back! Redirecting...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 600);
    } else {
      setErrorMsg(result.message || 'Invalid email or password');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);

    const result = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim(),
      address: {
        address: regAddress.trim(),
        city: regCity.trim(),
        state: regState.trim(),
        postalCode: regPostalCode.trim(),
        country: 'India',
      },
    });

    setSubmitting(false);

    if (result.success) {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } else {
      setErrorMsg(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-[0.25em] text-white group-hover:text-gray-300 transition-colors uppercase">
              ICONIC
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">
            {redirectUrl === '/checkout'
              ? 'Sign in to complete your order'
              : 'Exclusive Member Access'}
          </p>
        </div>

        {/* Tab Toggle: Sign In / Register */}
        <div className="bg-white/5 border border-white/10 p-1 rounded-full flex mb-6 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
              mode === 'signin'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
              mode === 'register'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f0f13]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-white text-black hover:bg-gray-200 disabled:opacity-50 py-3.5 rounded-full font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-white/10"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Shipping Address Details for Quick Checkout */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                  Default Shipping Address (Optional)
                </span>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Street Address, Flat / Apartment"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-white/30 text-xs"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:bg-white/10 text-xs"
                  />
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    placeholder="State"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:bg-white/10 text-xs"
                  />
                  <input
                    type="text"
                    value={regPostalCode}
                    onChange={(e) => setRegPostalCode(e.target.value)}
                    placeholder="PIN Code"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:bg-white/10 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 bg-white text-black hover:bg-gray-200 disabled:opacity-50 py-3.5 rounded-full font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-white/10"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>CREATE ACCOUNT & CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Secure Guarantee */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center space-x-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted Security & Privacy Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
