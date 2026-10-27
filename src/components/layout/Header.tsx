'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2, Menu, Shuffle } from 'lucide-react';
import { getSuggestions } from '@/lib/api';
import { AnimeItem } from '@/types';

interface HeaderProps {
  onOpenMobile: () => void;
}

export function Header({ onOpenMobile }: HeaderProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await getSuggestions(keyword.trim());
        setSuggestions(results || []);
        setOpen(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setOpen(false);
    router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-neu-bg/85 backdrop-blur-md border-b border-[#181a24] px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-muted hover:text-white"
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="md:hidden font-extrabold text-lg tracking-wider text-neu-accent">
          🐾 NekoStream
        </Link>
      </div>

      {/* Search Bar Neumorphic Inset */}
      <div ref={searchRef} className="relative flex-1 max-w-lg">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search anime, movies, ova..."
            className="w-full h-11 pl-11 pr-10 rounded-2xl bg-neu-surface shadow-neu-inset text-neu-text placeholder-neu-muted/60 text-sm focus:outline-none focus:ring-1 focus:ring-neu-accent transition-all"
          />
          <Search size={18} className="absolute left-4 text-neu-muted pointer-events-none" />
          {loading ? (
            <Loader2 size={16} className="absolute right-4 text-neu-accent animate-spin" />
          ) : keyword ? (
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setSuggestions([]);
                setOpen(false);
              }}
              className="absolute right-4 text-neu-muted hover:text-white"
            >
              <X size={16} />
            </button>
          ) : null}
        </form>

        {/* Autocomplete Dropdown */}
        {open && suggestions.length > 0 && (
          <div className="absolute top-13 left-0 right-0 mt-2 bg-neu-surface rounded-2xl shadow-neu-flat border border-[#1f2330] p-2 z-50 max-h-96 overflow-y-auto">
            {suggestions.map((item) => {
              const cleanSlug = (item.slug || '').split('/')[0];
              return (
                <Link
                  key={item.slug}
                  href={`/anime/${cleanSlug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#272c3d] transition-all"
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-10 h-14 object-cover rounded-lg flex-shrink-0 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neu-text truncate">{item.title}</h4>
                    {item.japaneseTitle && (
                      <p className="text-xs text-neu-muted truncate">{item.japaneseTitle}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neu-secondary font-medium">
                      {item.type && <span className="uppercase">{item.type}</span>}
                      {item.sub !== undefined && <span>SUB: {item.sub}</span>}
                      {item.dub !== undefined && item.dub > 0 && <span>DUB: {item.dub}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/random"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-semibold text-neu-accent hover:text-white transition-all"
        >
          <Shuffle size={14} />
          <span>Random</span>
        </Link>
      </div>
    </header>
  );
}
