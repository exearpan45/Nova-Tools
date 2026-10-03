import React, { useState } from 'react';
import {
  Home, Grid, Star, History, GitFork, Settings, ChevronLeft, ChevronRight,
  Image, FileText, Type, Code2, GraduationCap, Calculator, Globe,
  Palette, ShieldCheck, Database, PenTool, Wrench, Sparkles
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { SUITE_LIST } from '../data/suitesData';
import { ToolSuite } from '../types';
import { NovaLogo } from './NovaLogo';

const SUITE_ICONS: Record<ToolSuite, React.ElementType> = {
  image: Image,
  pdf: FileText,
  text: Type,
  developer: Code2,
  student: GraduationCap,
  calculators: Calculator,
  web: Globe,
  design: Palette,
  security: ShieldCheck,
  data: Database,
  writing: PenTool,
  utility: Wrench,
};

export const Sidebar: React.FC = () => {
  const { currentPath, navigate, favorites, recentTools, sidebarCollapsed, toggleSidebar } = useNova();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'tools', label: 'All Tools', icon: Grid, path: '/tools' },
    { id: 'favorites', label: 'Favorites', icon: Star, path: '/favorites', badge: favorites.length },
    { id: 'recent', label: 'Recently Used', icon: History, path: '/recent', badge: recentTools.length },
    { id: 'workflows', label: 'Workflows', icon: GitFork, path: '/workflows' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] transition-all duration-300 z-30 fixed top-0 left-0 bottom-0 h-screen h-[100dvh] ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 overflow-hidden text-left focus:outline-none"
        >
          <NovaLogo size={sidebarCollapsed ? 'sm' : 'md'} showText={!sidebarCollapsed} />
        </button>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* Core Links */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-violet-500/15 to-pink-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 dark:border-cyan-400/25 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-mono rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Suites Section */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Tool Suites
            </span>
          )}
          {SUITE_LIST.map((suite) => {
            const Icon = SUITE_ICONS[suite.id] || Sparkles;
            const isSuiteActive = currentPath === `/tools?suite=${suite.id}`;
            return (
              <button
                key={suite.id}
                onClick={() => navigate(`/tools?suite=${suite.id}`)}
                title={sidebarCollapsed ? suite.name : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isSuiteActive
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {!sidebarCollapsed && <span className="truncate">{suite.name}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info in Sidebar */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-600 dark:text-slate-300">100% Local Engine</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-400 dark:text-slate-500">
            NOVA TOOLS · Zero Server Uploads
          </p>
        </div>
      )}
    </aside>
  );
};
