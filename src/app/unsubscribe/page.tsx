'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BellOff, CheckCircle, XCircle } from 'lucide-react';

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
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const already = searchParams.get('already_unsubscribed');

  const status: 'success' | 'error' =
    success === 'true' ? 'success' : 'error';
  const variant: 'default' | 'already' =
    already === 'true' ? 'already' : 'default';
  const errorMessage =
    status === 'error'
      ? error
        ? resolveErrorMessage(error)
        : 'Open the unsubscribe link from your Hyperkit email to opt out of marketing messages.'
      : '';

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

          {status === 'success' && (
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
          )}

          {status === 'error' && (
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

              <p className="text-lg text-slate-400 mb-8">{errorMessage}</p>

              <div className="space-y-3">
                <Link
                  href="/"
                  className="block px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-purple-50 transition-all text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
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
