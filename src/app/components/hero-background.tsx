'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const GridScan = dynamic(() => import('./GridScan').then((m) => ({ default: m.GridScan })), {
  ssr: false,
});

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden="true">
      {/* 1. Dark Gradient Base */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050507] via-[#0a0a0c] to-[#0f0720]" />

      {/* 2. Aurora Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[800px] z-[1] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />

      {/* 3. Grain */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4. GridScan - hero only */}
      <div className="absolute inset-0 z-[3] w-full h-full min-h-full">
        <div className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen', opacity: 1 }}>
          <GridScan
            sensitivity={0.55}
            lineThickness={2}
            linesColor="#a78bfa"
            gridScale={0.08}
            scanColor="#e879f9"
            scanOpacity={0.75}
            enablePost
            bloomIntensity={0.85}
            chromaticAberration={0.003}
            noiseIntensity={0.02}
            trackWindow={false}
          />
        </div>
      </div>
    </div>
  );
}
