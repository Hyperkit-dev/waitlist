'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Wallet, ArrowRight } from 'lucide-react';
import HowItWorks from './how-it-works';
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
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-purple-500/30">
      {/* Background Layers */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Dark Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#0a0a0c] to-[#0f0720]"></div>
        
        {/* Top Center Glow (Aurora) */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[800px] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen opacity-60"></div>
        
        {/* Grain Texture */}
        <div 
          className="absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        
        {/* Logo Area with Float Animation */}
        <div className="mb-12 animate-float">
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
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6 max-w-5xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
            AI Studio to Build and Ship
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            Secure Multi-Chain DeFi Apps
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400/90 mb-12 max-w-2xl leading-relaxed font-light">
          Generate Solidity smart contracts with AI, audit, test, and deploy secure DeFi apps fast. Hyperkit Studio is your AI-powered smart contract builder for{' '}
          <ChainTooltip chain="skalebase">Skale Base</ChainTooltip>,{' '}
          <ChainTooltip chain="metis">Metis</ChainTooltip>,{' '}
          <ChainTooltip chain="mantle">Mantle</ChainTooltip>,{' '}
          <ChainTooltip chain="avalanche">Avalanche</ChainTooltip>, and more.
        </p>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-md mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Area */}
        <div className="w-full max-w-md space-y-6 mb-32">
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
                <div className="pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@hyperkit.xyz" 
                  className="w-full pl-3 pr-4 py-4 bg-transparent text-lg text-white placeholder-slate-600 focus:outline-none" 
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
                className="group flex-[1.5] py-3.5 px-4 bg-white text-black rounded-xl text-base font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <span>Secure your spot</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            <span>Limited spots available for Beta Wave 1</span>
          </div>

          {/* Waitlist Stats */}
          <WaitlistStats />
        </div>

        {/* How It Works Section */}
        <HowItWorks />
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