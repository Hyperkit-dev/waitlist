'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChainTooltipProps {
  chain: 'skalebase' | 'metis' | 'avalanche' | 'mantle' | 'base';
  children: React.ReactNode;
}

const chainInfo = {
  skalebase: 'SKALE on Base: Zero gas fees, encrypted transactions, instant finality. Deploy AI-generated Solidity and DeFi apps with native Base integration.',
  metis: 'Metis DeFi network. Hyperkit includes native Metis SDK integration for cross-chain operations and multi-chain DeFi deployment.',
  avalanche: 'Avalanche DeFi: x402 integration enables pay-per-deploy and pay-per-API monetization flows on Fuji testnet.',
  mantle: 'Mantle DeFi network. Deploy your AI-generated smart contracts to Mantle without network-specific rewrites (support in progress).',
  base: 'Base network support coming soon. Deploy your Hyperkit AI DeFi apps to Base with the same unified workflow.',
};

export default function ChainTooltip({ chain, children }: ChainTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spaceAbove = buttonRect.top;
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      // Position tooltip above if not enough space below, otherwise below
      if (spaceBelow < tooltipRect.height + 10 && spaceAbove > tooltipRect.height + 10) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isOpen]);

  return (
    <span className="relative inline-block">
      <button
        ref={buttonRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="underline decoration-dotted decoration-purple-400/50 underline-offset-2 hover:decoration-purple-400 cursor-help text-inherit"
      >
        {children}
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 border border-white/20 rounded-lg shadow-xl z-50 text-xs text-slate-300 pointer-events-none`}
        >
          <span>{chainInfo[chain]}</span>
          <div
            className={`absolute ${position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'} left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/20 rotate-45`}
          ></div>
        </div>
      )}
    </span>
  );
}

