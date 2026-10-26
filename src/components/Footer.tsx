import React from 'react';
import { Link } from 'react-router-dom';
import { RukaTvLogo } from './RukaTvLogo';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black border-t border-white/10 text-white/50 text-xs py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top: Logo & Language selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <RukaTvLogo className="h-5 w-auto text-white/70" />
            <span className="text-white/40">|</span>
            <span className="text-white/80 font-medium">Ruka Originals & Live Entertainment</span>
          </div>

          <div className="flex items-center gap-2 text-white/60 hover:text-white cursor-pointer transition-colors">
            <Globe className="w-4 h-4" />
            <span>United States (English)</span>
          </div>
        </div>

        {/* Legal and compliance disclaimer */}
        <div className="space-y-2 text-[11px] leading-relaxed text-white/40">
          <p>
            1. Compatible hardware and software required. 4K UHD, HDR10, Dolby Vision and Dolby Atmos streaming subject to device capabilities and connection speed.
          </p>
          <p>
            2. TV Season trademarks and copyrights are property of their respective broadcast networks. All rights reserved.
          </p>
        </div>

        {/* Links & Copyright (Exact match to Apple TV specification) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5 text-[11px]">
          <div>
            Copyright © {new Date().getFullYear()} RukaTV Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/60">
            <Link 
              to="/legal/privacy" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/terms" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Use
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/sales" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sales Policy
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/legal" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Legal
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/support" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
