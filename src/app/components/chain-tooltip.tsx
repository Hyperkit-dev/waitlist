'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ChainTooltipProps {
  chain: 'skalebase' | 'metis' | 'avalanche' | 'mantle' | 'base' | 'filecoin';
  children: React.ReactNode;
}

const chainInfo = {
  skalebase: 'SKALE on Base: Zero gas fees, encrypted transactions, instant finality. Deploy AI-generated Solidity and DeFi apps with native Base integration.',
  metis: 'Metis DeFi network. Hyperkit includes native Metis SDK integration for cross-chain operations and multi-chain DeFi deployment.',
  avalanche: 'Avalanche DeFi: x402 integration enables pay-per-deploy and pay-per-API monetization flows on Fuji testnet.',
  mantle: 'Mantle DeFi network. Deploy your AI-generated smart contracts to Mantle without network-specific rewrites (support in progress).',
  base: 'Base network support coming soon. Deploy your Hyperkit AI DeFi apps to Base with the same unified workflow.',
  filecoin: 'Filecoin: Decentralized storage network. Deploy data-intensive DeFi apps and store smart contract state on Filecoin with Hyperkit integration.',
};

export default function ChainTooltip({ chain, children }: ChainTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [showAbove, setShowAbove] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current && typeof document !== 'undefined') {
      const rect = buttonRef.current.getBoundingClientRect();
      const tooltipHeight = 120;
      const gap = 8;
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      const above = spaceAbove >= tooltipHeight + gap || spaceAbove > spaceBelow;
      setShowAbove(above);
      const top = above ? rect.top - tooltipHeight - gap : rect.bottom + gap;
      const left = rect.left + rect.width / 2;
      setCoords({ top, left });
    }
  }, [isOpen]);

  const tooltip = isOpen && typeof document !== 'undefined' && createPortal(
    <div
      className="fixed w-64 p-3 bg-slate-900 border border-white/20 rounded-lg shadow-xl text-xs text-slate-300 pointer-events-none z-[9999]"
      style={{
        top: coords.top,
        left: coords.left,
        transform: 'translate(-50%, 0)',
      }}
    >
      <span>{chainInfo[chain]}</span>
      <div
        className={`absolute left-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/20 ${
          showAbove ? 'top-full -mt-1' : 'bottom-full -mb-1'
        }`}
        style={{ transform: 'translateX(-50%) rotate(45deg)' }}
      />
    </div>,
    document.body
  );

  return (
    <span className="relative inline-block">
      <button
        ref={buttonRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="underline decoration-dotted decoration-purple-400/70 underline-offset-2 hover:decoration-purple-400 cursor-help text-inherit font-medium"
      >
        {children}
      </button>
      {tooltip}
    </span>
  );
}

