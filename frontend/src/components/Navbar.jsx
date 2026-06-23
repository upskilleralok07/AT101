import React from 'react';
import { useAuth } from '../services/auth';
import { Bell, Search, User, Sparkles } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8">
      {/* Page Title */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>

      {/* Quick Utilities */}
      <div className="flex items-center gap-6">
        {/* Search Input Bar (SaaS mockup design style) */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources, lessons..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-sm outline-none focus:border-primary/50 focus:bg-white transition-all"
          />
        </div>

        {/* Upskill Now CTA Button */}
        <a
          href="https://upskillerai.lovable.app/upskiller"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-orange-600/30 transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-white" />
          <span>Upskill Now</span>
        </a>

        {/* Alerts Notification Button */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Quick Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-semibold text-slate-800">{user?.name}</h4>
            <p className="text-[11px] text-slate-400 font-medium">Candidate</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary text-white border border-primary/20 flex items-center justify-center font-bold text-sm shadow-sm select-none">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
