'use client';

import React from 'react';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export default function Section({ id, children, className = '', fullHeight = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative z-[5] scroll-mt-20 ${fullHeight ? 'min-h-screen flex flex-col justify-start pt-20' : 'py-14 sm:py-20 md:py-24 lg:py-28'} ${className}`}
    >
      {children}
    </section>
  );
}
