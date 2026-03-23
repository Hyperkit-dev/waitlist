import React from 'react';
import { Zap, Bot, BadgeCheck, Percent, Users, Map, Coins, Share2, Network } from 'lucide-react';
import ChainTooltip from './chain-tooltip';

const WaitlistPerks = () => {
  const perks = [
    {
      icon: Zap,
      title: "Guaranteed Access",
      description: "Be the first to enter Hyperkit Studio before public launch via our limited beta waves.",
      color: "purple",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",
      ring: "ring-purple-500/20",
      hoverBorder: "hover:border-purple-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(126,34,206,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-purple-900/20",
      bottomGlow: "bg-purple-600/20 group-hover:bg-purple-500/30"
    },
    {
      icon: Bot,
      title: "Priority AI Access",
      description: "Get priority access to new AI smart contract generator features, DeFi templates, and multi-chain deployment tools.",
      color: "blue",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
      hoverBorder: "hover:border-blue-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-blue-900/20",
      bottomGlow: "bg-blue-600/20 group-hover:bg-blue-500/30"
    },
    {
      icon: BadgeCheck,
      title: "Founding Status",
      description: 'Exclusive "Founding Builder" profile badge in-app and a special role in our Discord.',
      color: "amber",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
      hoverBorder: "hover:border-amber-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.25)]",
      gradientOverlay: "from-transparent via-transparent to-amber-900/20",
      bottomGlow: "bg-amber-600/20 group-hover:bg-amber-500/30"
    },
    {
      icon: Percent,
      title: "Exclusive Discounts",
      description: "Waitlist-only discounts or extended free trial with extra usage credits for the first months.",
      color: "emerald",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-emerald-900/20",
      bottomGlow: "bg-emerald-600/20 group-hover:bg-emerald-500/30"
    },
    {
      icon: Users,
      title: "Private Sessions",
      description: "Invitation to private office hours, workshops, and behind-the-scenes dev updates.",
      color: "rose",
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10",
      ring: "ring-rose-500/20",
      hoverBorder: "hover:border-rose-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(244,63,94,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-rose-900/20",
      bottomGlow: "bg-rose-600/20 group-hover:bg-rose-500/30"
    },
    {
      icon: Map,
      title: "Shape the Roadmap",
      description: "Direct line to the core team via priority feedback calls and surveys to shape the product.",
      color: "cyan",
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      ring: "ring-cyan-500/20",
      hoverBorder: "hover:border-cyan-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(6,182,212,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-cyan-900/20",
      bottomGlow: "bg-cyan-600/20 group-hover:bg-cyan-500/30"
    },
    {
      icon: Coins,
      title: "On-Chain Rewards",
      description: "Eligibility for future NFTs or loyalty points recognizing you as an early adopter.",
      color: "yellow",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10",
      ring: "ring-yellow-500/20",
      hoverBorder: "hover:border-yellow-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(234,179,8,0.25)]",
      gradientOverlay: "from-transparent via-transparent to-yellow-900/20",
      bottomGlow: "bg-yellow-600/20 group-hover:bg-yellow-500/30"
    },
    {
      icon: Share2,
      title: "Referral Perks",
      description: "Move up the queue and unlock higher-tier rewards by inviting other builders.",
      color: "pink",
      iconColor: "text-pink-400",
      iconBg: "bg-pink-500/10",
      ring: "ring-pink-500/20",
      hoverBorder: "hover:border-pink-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(236,72,153,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-pink-900/20",
      bottomGlow: "bg-pink-600/20 group-hover:bg-pink-500/30"
    },
    {
      icon: Network,
      title: "Integrations",
      description: (
        <>
          First to deploy on <ChainTooltip chain="skalebase">Skale Base</ChainTooltip>,{' '}
          <ChainTooltip chain="metis">Metis</ChainTooltip>,{' '}
          <ChainTooltip chain="mantle">Mantle</ChainTooltip>,{' '}
          <ChainTooltip chain="avalanche">Avalanche</ChainTooltip>, and{' '}
          <ChainTooltip chain="filecoin">Filecoin</ChainTooltip> using our advanced testnet tools.
        </>
      ),
      color: "indigo",
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
      ring: "ring-indigo-500/20",
      hoverBorder: "hover:border-indigo-500/40",
      hoverShadow: "hover:shadow-[0_20px_60px_-10px_rgba(99,102,241,0.3)]",
      gradientOverlay: "from-transparent via-transparent to-indigo-900/20",
      bottomGlow: "bg-indigo-600/20 group-hover:bg-indigo-500/30"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header - SEO: waitlist perks for AI DeFi platform */}
      <div className="mb-10 sm:mb-14 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 sm:mb-4 tracking-tight">
          Waitlist <span className="text-purple-400">Perks</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Unlock exclusive benefits for early adopters. Priority access to AI features and multi-chain tools.
        </p>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 text-left">
        {perks.map((perk, index) => {
          const IconComponent = perk.icon;
          return (
            <div
              key={index}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-[#0e0e11] p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1 active:translate-y-0 ${perk.hoverBorder} ${perk.hoverShadow}`}
            >
              {/* Bottom Gradient Glow */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${perk.gradientOverlay} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}></div>
              
              {/* Bottom Light Source */}
              <div className={`pointer-events-none absolute -bottom-16 left-1/2 h-40 w-full -translate-x-1/2 blur-[50px] transition-all duration-500 ${perk.bottomGlow}`}></div>
              
              <div className="relative z-10">
                <div className={`mb-5 sm:mb-6 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${perk.iconBg} ${perk.iconColor} ring-1 ring-inset ${perk.ring} transition-colors shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]`}>
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-2 sm:mb-3 tracking-tight">
                  {perk.title}
                </h3>
                <div className="text-sm leading-relaxed text-slate-400">
                  {perk.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaitlistPerks;