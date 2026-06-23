import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import {
  LayoutDashboard,
  Home as HomeIcon,
  FileText,
  Briefcase,
  Mic,
  Target,
  Lightbulb,
  LogOut,
  Rocket,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Job Match Score', path: '/match-score', icon: Briefcase },
    { name: 'Mock Interview', path: '/interviews', icon: Mic },
    { name: 'Internship Recommendation', path: '/internships', icon: Target },
    { name: 'AI Suggestions', path: '/suggestions', icon: Lightbulb },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <div className="bg-primary p-2 rounded-xl text-white">
          <Rocket className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight">UpSkiller</h1>
          <span className="text-xs text-slate-400 font-medium">PlacePilot AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Upskill CTA Button */}
      <div className="px-4 mb-4">
        <a
          href="https://upskillerai.lovable.app/upskiller"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-sm shadow-md hover:from-amber-600 hover:to-orange-700 hover:shadow-lg transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-white" />
          <span>Upskill Now</span>
        </a>
      </div>

      {/* User Session Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-base uppercase">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-semibold truncate text-slate-200">{user?.name || 'Guest User'}</h4>
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:border-rose-900/30 hover:bg-rose-950/20 hover:text-rose-400 text-sm font-medium transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
