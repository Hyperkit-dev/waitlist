'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setStatus('success');
    } else if (error) {
      setStatus('error');
      switch (error) {
        case 'missing_params':
          setErrorMessage('Missing confirmation parameters. Please check your email link.');
          break;
        case 'invalid_token':
          setErrorMessage('Invalid or expired confirmation link. Please request a new one.');
          break;
        case 'server_error':
          setErrorMessage('Server error occurred. Please try again later.');
          break;
        default:
          setErrorMessage('An error occurred during confirmation.');
      }
    } else {
      setStatus('success'); // Default to success if no params
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-purple-500/30">
      {/* Simplified Background Layers - Optimized for Performance */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#0a0a0c] to-[#0f0720]"></div>
        {/* Reduced blur intensity for better performance */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[800px] bg-purple-900/20 blur-[80px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5 p-3">
                <Image
                  src="/logo/brand/hyperkit/Hyperkit-logo.png"
                  alt="Hyperkit Studio - AI Solidity & DeFi Development"
                  width={40}
                  height={40}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg className="animate-spin h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-slate-400">Confirming your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-green-500/10 border border-green-500/30 rounded-full p-4">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                Email Confirmed!
              </h1>
              
              <p className="text-lg text-slate-400 mb-2">
                Your spot on the waitlist is now confirmed.
              </p>
              
              <p className="text-sm text-slate-500 mb-8">
                We'll notify you when Beta Wave 1 launches. Stay tuned!
              </p>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <p className="text-sm text-slate-300">
                    Check your email for the confirmation receipt
                  </p>
                </div>
              </div>

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
                Confirmation Failed
              </h1>
              
              <p className="text-lg text-slate-400 mb-8">
                {errorMessage}
              </p>

              <div className="space-y-3">
                <Link
                  href="/"
                  className="block px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-purple-50 transition-all text-center"
                >
                  Return to Home
                </Link>
                <p className="text-sm text-slate-500">
                  If you continue to experience issues, please contact support.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmedContent />
    </Suspense>
  );
}

