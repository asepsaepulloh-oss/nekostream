'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Flame,
  Star,
  Sparkles,
  ListPlus,
  Clock,
  Calendar,
  Grid,
  History,
  Bookmark,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Trending', href: '/trending', icon: Flame },
    { label: 'Popular', href: '/popular', icon: Star },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Genres', href: '/genres', icon: Grid },
    { label: 'A-Z List', href: '/az-list', icon: ListPlus },
    { label: 'Watch History', href: '/history', icon: History },
    { label: 'My List', href: '/my-list', icon: Bookmark },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-neu-surface border-r border-[#1a1c26] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#181a24]">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-accent font-black text-xl flex-shrink-0">
              🐾
            </div>
            {!collapsed && (
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-neu-accent to-neu-secondary bg-clip-text text-transparent">
                NekoStream
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-muted hover:text-neu-text transition-all"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-neu-surface text-neu-accent shadow-neu-inset font-semibold'
                    : 'text-neu-muted hover:text-neu-text hover:bg-[#252a38]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={active ? 'text-neu-accent' : ''} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[#181a24] space-y-2">
          <Link
            href="/random"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-neu-surface shadow-neu-btn text-neu-secondary hover:text-white transition-all text-xs font-bold"
          >
            <Shuffle size={16} />
            {!collapsed && <span>Surprise Me</span>}
          </Link>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-neu-surface shadow-neu-btn text-neu-muted hover:text-neu-text transition-all text-xs font-medium"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Header onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-neu-surface h-full shadow-2xl flex flex-col z-10 border-r border-[#1a1c26]">
            <div className="h-16 flex items-center justify-between px-5 border-b border-[#181a24]">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                <span className="text-2xl">🐾</span>
                <span className="font-extrabold text-xl bg-gradient-to-r from-neu-accent to-neu-secondary bg-clip-text text-transparent">
                  NekoStream
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-muted"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl ${
                      active
                        ? 'bg-neu-surface text-neu-accent shadow-neu-inset font-semibold'
                        : 'text-neu-muted hover:text-neu-text'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-neu-surface border-t border-[#181a24] shadow-neu-flat flex items-center justify-around z-40 px-2">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-neu-accent font-bold' : 'text-neu-muted'}`}>
          <Home size={18} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/trending" className={`flex flex-col items-center gap-1 ${pathname === '/trending' ? 'text-neu-accent font-bold' : 'text-neu-muted'}`}>
          <Flame size={18} />
          <span className="text-[10px]">Trending</span>
        </Link>
        <Link href="/explore" className={`flex flex-col items-center gap-1 ${pathname === '/explore' ? 'text-neu-accent font-bold' : 'text-neu-muted'}`}>
          <Compass size={18} />
          <span className="text-[10px]">Explore</span>
        </Link>
        <Link href="/my-list" className={`flex flex-col items-center gap-1 ${pathname === '/my-list' ? 'text-neu-accent font-bold' : 'text-neu-muted'}`}>
          <Bookmark size={18} />
          <span className="text-[10px]">My List</span>
        </Link>
      </div>
    </div>
  );
}
