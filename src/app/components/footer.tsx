import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#050507] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © 2025 Hyperkit Toolkit. AI-powered Solidity & DeFi development.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://hyperkitlabs.com/legal" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-purple-400 transition-colors">Privacy</a>
            <a href="https://hyperkitlabs.com/legal" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-purple-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;