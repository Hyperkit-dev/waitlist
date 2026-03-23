'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, Zap, Network } from 'lucide-react';

export default function ValueProposition() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'what-is-hyperkit',
      title: 'What is Hyperkit Studio?',
      icon: Sparkles,
        content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Hyperkit Studio is a modular DeFi infrastructure suite that uses AI to automate Web3 development. Our Solidity AI engine generates production-ready smart contracts from plain English—describe what you need, and get deployable code in minutes.</p>
          <div className="bg-slate-900/50 rounded-lg p-4 mt-4">
            <p className="font-semibold text-white mb-2">5 Core Modules:</p>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">AI Project Generator:</strong> Generate Solidity contracts and complete Web3 apps from natural language prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Full-Stack Builder:</strong> Drag-and-drop interface for React/Next.js frontends and NestJS backends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Modular SDKs:</strong> Pre-audited building blocks for staking, swapping, liquidity pools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Multi-Chain Deployment:</strong> Write once, deploy to multiple networks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-white">Integrated Security:</strong> AI contract auditor built into the workflow for secure DeFi apps</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'why-chains',
      title: 'Why Skale Base, Metis, Mantle, and Avalanche?',
      icon: Network,
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Hyperkit is network-agnostic—it abstracts away blockchain differences so you can deploy anywhere without rewriting code.</p>
          <div className="space-y-3 mt-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="font-semibold text-white mb-1">Skale Base & Metis</p>
              <p className="text-slate-400 text-xs">Skale Base offers zero gas fees and instant finality. Metis SDK integration for seamless cross-chain asset and data bridging.</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="font-semibold text-white mb-1">Avalanche</p>
              <p className="text-slate-400 text-xs">Avalanche x402 integration enables pay-per-deploy and pay-per-API flows for monetizing your tools on Avalanche Fuji testnet.</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="font-semibold text-white mb-1">Mantle</p>
              <p className="text-slate-400 text-xs">Strategic integration partner—deploy to Mantle without network-specific rewrites (support in progress).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'value-prop',
      title: 'Why Build with Hyperkit?',
      icon: Zap,
        content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p><strong className="text-white">For DeFi and Web3 developers who want to ship faster and safer.</strong></p>
          <p>Hyperkit removes friction by combining our Solidity AI generator, smart contract auditing, multi-chain DeFi deployment, and monitoring in a single workspace.</p>
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 mt-4 border border-purple-500/20">
            <p className="font-semibold text-white mb-2">Key Benefits:</p>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Go from idea to deployed app in <strong className="text-white">under 30 minutes</strong> (vs. 2+ hours with traditional tools)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Use <strong className="text-white">pre-audited, battle-tested</strong> DeFi contract templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Deploy across <strong className="text-white">multiple L1 and L2 chains</strong> with one flow</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Security auditing <strong className="text-white">built into the workflow</strong>, not as an afterthought</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          What is Hyperkit Studio? AI Solidity & DeFi Development Platform
        </h2>
        <p className="text-slate-400 text-sm">
          Learn how our AI smart contract generator and multi-chain DeFi builder helps you ship Web3 apps faster
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSection === section.id;

          return (
            <div
              key={section.id}
              className="border border-white/10 rounded-xl bg-[#0e0e11] overflow-hidden transition-all hover:border-white/20"
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-medium text-white">{section.title}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-in slide-in-from-top-2">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

