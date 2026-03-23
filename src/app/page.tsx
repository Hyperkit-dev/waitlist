'use client';

import React from 'react';
import HeroPage from './components/hero-page';
import HowItWorks from './components/how-it-works';
import ValueProposition from './components/value-proposition';
import PerksPage from './components/perks-page';
import Section from './components/section';
import SectionNav from './components/section-nav';
import HeroBackground from './components/hero-background';

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#050507]">
      <SectionNav />

      <Section id="hero" fullHeight className="overflow-hidden">
        <HeroBackground />
        <div className="relative z-[5]">
          <HeroPage />
        </div>
      </Section>

      <Section id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <HowItWorks />
        </div>
      </Section>

      <Section id="about">
        <ValueProposition />
      </Section>

      <Section id="perks">
        <PerksPage />
      </Section>
    </div>
  );
}
