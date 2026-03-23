'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'about', label: 'About' },
  { id: 'perks', label: 'Perks' },
];

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const targets = sections.map((s) => document.getElementById(s.id));
      const scrollY = window.scrollY + 150;
      for (let i = targets.length - 1; i >= 0; i--) {
        const el = targets[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-end">
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5 py-3.5 sm:py-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeSection === s.id
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden py-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                  activeSection === s.id
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
