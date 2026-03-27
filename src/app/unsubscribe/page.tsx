'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BellOff, CheckCircle, Mail, Wallet, XCircle } from 'lucide-react';

function resolveErrorMessage(error: string | null): string {
  switch (error) {
    case 'missing_params':
      return 'This unsubscribe link is incomplete. Use the link from your Hyperkit email, or contact support.';
    case 'invalid_token':
      return 'This unsubscribe link is invalid or has expired. If you still receive emails, contact support with your address.';
    case 'server_error':
      return 'Something went wrong. Please try again in a few minutes.';
    default:
      return 'We could not process your request.';
  }
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const already = searchParams.get('already_unsubscribed');

  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          walletAddress: walletAddress.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(
          typeof data.error === 'string'
            ? data.error
            : 'Something went wrong. Please try again.'
        );
        return;
      }
      if (data.alreadyUnsubscribed) {
        router.replace('/unsubscribe?success=true&already_unsubscribed=true');
      } else {
        router.replace('/unsubscribe?success=true');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success === 'true') {
    const variant = already === 'true' ? 'already' : 'default';
    return (
      <div className="relative min-h-screen overflow-hidden bg-black selection:bg-purple-500/30">
        <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#0a0a0c] to-[#0f0720]"></div>
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[800px] bg-purple-900/20 blur-[80px] rounded-full mix-blend-screen opacity-40"></div>
        </div>

        <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                <div className="relative w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5 p-3">
                  <Image
                    src="/logo/brand/hyperkit/Hyperkit-logo.png"
                    alt="Hyperkit Studio"
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-slate-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-slate-500/10 border border-slate-500/30 rounded-full p-4">
                    {variant === 'already' ? (
                      <CheckCircle className="w-16 h-16 text-slate-300" />
                    ) : (
                      <BellOff className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                {variant === 'already' ? 'Already unsubscribed' : "You're unsubscribed"}
              </h1>

              <p className="text-lg text-slate-400 mb-2">
                {variant === 'already'
                  ? 'This email was already removed from Hyperkit marketing messages.'
                  : 'You will no longer receive marketing emails from Hyperkit for this address.'}
              </p>

              <p className="text-sm text-slate-500 mb-8">
                Your waitlist registration is unchanged. Transactional messages about your account may
                still be sent when necessary.
              </p>

              <Link
                href="/"
                className="inline-block px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    const errorMessage = resolveErrorMessage(error);
    return (
      <div className="relative min-h-screen overflow-hidden bg-black selection:bg-purple-500/30">
        <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#0a0a0c] to-[#0f0720]"></div>
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[800px] bg-purple-900/20 blur-[80px] rounded-full mix-blend-screen opacity-40"></div>
        </div>

        <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                <div className="relative w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5 p-3">
                  <Image
                    src="/logo/brand/hyperkit/Hyperkit-logo.png"
                    alt="Hyperkit Studio"
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl"></div>
                  <div className="relative bg-red-500/10 border border-red-500/30 rounded-full p-4">
                    <XCircle className="w-16 h-16 text-red-400" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                Could not unsubscribe
              </h1>

              <p className="text-lg text-slate-400 mb-6">{errorMessage}</p>

              <p className="text-sm text-slate-500 mb-6">
                <Link href="/unsubscribe" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                  Unsubscribe using your email and wallet
                </Link>{' '}
                instead (same details you used to join the waitlist).
              </p>

              <Link
                href="/"
                className="inline-block px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-purple-500/30">
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#0a0a0c] to-[#0f0720]"></div>
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[800px] bg-purple-900/20 blur-[80px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full">
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5 p-3">
                <Image
                  src="/logo/brand/hyperkit/Hyperkit-logo.png"
                  alt="Hyperkit Studio"
                  width={40}
                  height={40}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
              Unsubscribe from marketing emails
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enter the same email and wallet address you used to join the Hyperkit waitlist. This
              only stops marketing messages; your waitlist spot stays the same.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
            {formError && (
              <div
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400"
                role="alert"
              >
                {formError}
              </div>
            )}

            <div>
              <label htmlFor="unsub-email" className="sr-only">
                Email
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-40 transition duration-500"></div>
                <div className="relative flex bg-[#0e0e11]/90 rounded-xl border border-white/10 overflow-hidden focus-within:border-purple-500/40 focus-within:ring-1 focus-within:ring-purple-500/30 transition-colors">
                  <div className="pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="unsub-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                    required
                    className="w-full pl-3 pr-4 py-3.5 bg-transparent text-base text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="unsub-wallet" className="sr-only">
                Wallet address
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-40 transition duration-500"></div>
                <div className="relative flex bg-[#0e0e11]/90 rounded-xl border border-white/10 overflow-hidden focus-within:border-purple-500/40 focus-within:ring-1 focus-within:ring-purple-500/30 transition-colors">
                  <div className="pl-4 flex items-center pointer-events-none shrink-0">
                    <Wallet className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="unsub-wallet"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x…"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={42}
                    required
                    className="w-full min-w-0 pl-3 pr-4 py-3.5 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 bg-white text-black rounded-xl text-base font-semibold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating…
                </>
              ) : (
                'Unsubscribe from marketing emails'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            You can also use the unsubscribe link in your confirmation email.{' '}
            <Link href="/" className="text-slate-400 hover:text-purple-400 transition-colors">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-12 w-12 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-slate-400">Loading…</p>
          </div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
