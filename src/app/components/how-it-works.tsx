'use client';

import React from 'react';
import { Wallet2, MailCheck, TrendingUp } from 'lucide-react';
import ChainTooltip from './chain-tooltip';

const steps = [
  {
    icon: Wallet2,
    number: '01',
    title: 'Connect wallet & email',
    description: (
      <>
        Click "Join waitlist" and connect a supported wallet to register. Hyperkit supports early access on the{' '}
        <ChainTooltip chain="skalebase">Skale Base</ChainTooltip> with planned support for{' '}
        <ChainTooltip chain="metis">Metis</ChainTooltip>,{' '}
        <ChainTooltip chain="mantle">Mantle</ChainTooltip>,{' '}
        <ChainTooltip chain="avalanche">Avalanche</ChainTooltip>, and{' '}
        <ChainTooltip chain="base">Base</ChainTooltip> networks.
      </>
    ),
    color: 'purple',
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-500/50',
    shadowColor: 'group-hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]',
    badgeColor: 'text-purple-300',
  },
  {
    icon: MailCheck,
    number: '02',
    title: 'Confirm from your inbox',
    description: 'Check your email for a confirmation link. Open it to verify your identity and confirm your Hyperkit waitlist registration.',
    color: 'blue',
    iconColor: 'text-blue-400',
    borderColor: 'group-hover:border-blue-500/50',
    shadowColor: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
    badgeColor: 'text-blue-300',
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'Climb the queue',
    description: 'Your spot is locked. Boost your position by completing optional steps like inviting builders or linking projects in your dashboard.',
    color: 'amber',
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-500/50',
    shadowColor: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    badgeColor: 'text-amber-300',
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="w-full max-w-5xl mb-32 relative scroll-mt-24">
      <div className="mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          How to secure your spot
        </h2>
      </div>
      
      {/* Connecting Line (Desktop) */}
      <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="group flex flex-col items-center">
              <div className={`relative w-14 h-14 mb-6 rounded-2xl bg-[#0e0e11] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.1)] ${step.borderColor} ${step.shadowColor} transition-all duration-300`}>
                <Icon className={`w-6 h-6 ${step.iconColor}`} />
                <div className={`absolute -bottom-2 bg-[#0e0e11] border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold ${step.badgeColor}`}>
                  {step.number}
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
              <div className="text-sm text-slate-400 max-w-[280px] leading-relaxed">
                {step.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

