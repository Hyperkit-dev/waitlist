'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Wallet, ArrowRight } from 'lucide-react';
import ChainTooltip from './chain-tooltip';
import WaitlistStats from './waitlist-stats';
import SuccessModal from './success-modal';

export default function Web3Hero() {
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      checkIfWalletIsConnected();
    }
  }, [isMounted]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const handleConnectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const ethereum = window.ethereum;
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      const chainId = await ethereum.request({ method: 'eth_chainId' }) as string;
      
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
      
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsWalletConnected(false);
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
        }
      });

      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSecureSpot = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          walletAddress: walletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to secure spot. Please try again.');
        return;
      }

      // Success
      setSuccess(true);
      setError('');
      setSubmittedEmail(email.trim());
      setShowModal(true);
      
      // Reset form after showing modal
      setEmail('');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Error securing spot:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewSteps = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden selection:bg-purple-500/30">
      {/* Main Container */}
      <main className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-24 sm:pb-32 flex flex-col items-center text-center">
        
        {/* Logo Area with Float Animation */}
        <div className="mb-8 sm:mb-10 animate-float">
          <div className="relative group">
            <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative w-20 h-20 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5 p-4">
                <Image
                  src="/logo/brand/hyperkit/Hyperkit-logo.png"
                  alt="Hyperkit Studio - AI Solidity and DeFi Development Platform"
                  width={56}
                  height={56}
                  priority
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
            </div>
          </div>
        </div>

        {/* Hero Text - SEO: Solidity AI, AI smart contract generator, DeFi keywords */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4 sm:mb-6 max-w-4xl leading-[1.1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            AI Studio to Build and Ship
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] [text-shadow:0_0_40px_rgba(168,85,247,0.3)]">
            Secure Multi-Chain DeFi Apps
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Generate Solidity smart contracts with AI, audit, test, and deploy secure DeFi apps fast. Hyperkit Studio is your AI-powered smart contract builder for{' '}
          <ChainTooltip chain="skalebase">Skale Base</ChainTooltip>,{' '}
          <ChainTooltip chain="metis">Metis</ChainTooltip>,{' '}
          <ChainTooltip chain="mantle">Mantle</ChainTooltip>,{' '}
          <ChainTooltip chain="avalanche">Avalanche</ChainTooltip>,{' '}
          <ChainTooltip chain="filecoin">Filecoin</ChainTooltip>, and more.
        </p>

        {/* Error message */}
        {error && (
          <div id="email-error" className="w-full max-w-md mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4" role="alert">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Area */}
        <div className="w-full max-w-md space-y-5">
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <label htmlFor="waitlist-email" className="sr-only">Email address</label>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-50 group-focus-within:opacity-50 transition duration-500"></div>
              <div className="relative flex bg-[#0e0e11]/90 rounded-xl border border-white/10 overflow-hidden focus-within:border-purple-500/40 focus-within:ring-1 focus-within:ring-purple-500/30 transition-colors">
                <div className="pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  id="waitlist-email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@hyperkit.xyz" 
                  className="w-full pl-3 pr-4 py-3.5 sm:py-4 bg-transparent text-base sm:text-lg text-white placeholder-slate-600 focus:outline-none" 
                  autoComplete="email"
                  maxLength={254}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleConnectWallet}
                disabled={isConnecting || isWalletConnected}
                className={`group flex-1 py-3.5 px-4 ${
                  isWalletConnected 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-white/5 hover:bg-white/10 hover:border-purple-500/30 hover:text-white'
                } border border-white/10 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : isWalletConnected ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{formatAddress(walletAddress)}</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>

              <button 
                onClick={handleSecureSpot}
                disabled={isSubmitting}
                className="group flex-[1.5] py-3.5 px-5 bg-white text-black rounded-xl text-base font-semibold hover:bg-purple-50 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                aria-label="Secure your spot on the waitlist"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Securing...</span>
                  </>
                ) : (
                  <>
                    <span>Join Waitlist (Free)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" aria-hidden></span>
            <span>
              Limited spots · Beta Wave 1 · No spam,{' '}
              <Link
                href="/unsubscribe"
                className="text-slate-400 underline underline-offset-2 decoration-slate-600 hover:text-purple-400 hover:decoration-purple-400/60 transition-colors"
              >
                unsubscribe anytime
              </Link>
            </span>
          </p>

          {/* Waitlist Stats */}
          <WaitlistStats />
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSuccess(false);
        }}
        email={submittedEmail || undefined}
        walletAddress={walletAddress ? formatAddress(walletAddress) : undefined}
        onViewSteps={handleViewSteps}
      />
    </div>
  );
}