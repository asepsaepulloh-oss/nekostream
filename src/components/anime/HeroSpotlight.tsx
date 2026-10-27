'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info, ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import { SpotlightAnime } from '@/types';

interface HeroSpotlightProps {
  spotlights: SpotlightAnime[];
}

export function HeroSpotlight({ spotlights }: HeroSpotlightProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!spotlights || spotlights.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % spotlights.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [spotlights]);

  if (!spotlights || spotlights.length === 0) return null;

  const item = spotlights[current];
  const cleanSlug = (item.slug || '').split('/')[0];

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-3xl overflow-hidden bg-neu-surface shadow-neu-flat border border-[#1e2230] mb-10 group">
      {/* Background Poster / Banner with gradient */}
      <div className="absolute inset-0">
        <img
          src={item.poster}
          alt={item.title}
          className="w-full h-full object-cover object-center filter blur-[1px] brightness-75 scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neu-bg via-neu-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neu-bg via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-12 max-w-2xl z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-neu-accent text-white font-extrabold text-[11px] tracking-wider uppercase shadow-sm">
            Spotlight #{current + 1}
          </span>
          {item.type && (
            <span className="px-2.5 py-0.5 rounded-full bg-neu-surface shadow-neu-btn text-neu-secondary text-xs font-bold uppercase">
              {item.type}
            </span>
          )}
          {item.rating && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold border border-yellow-500/30">
              <Star size={12} fill="currentColor" /> {item.rating}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight line-clamp-2 drop-shadow-md">
          {item.title}
        </h1>

        {item.japaneseTitle && (
          <p className="text-xs md:text-sm text-neu-secondary font-medium mt-1 truncate">
            {item.japaneseTitle}
          </p>
        )}

        {item.description && (
          <p className="text-xs md:text-sm text-neu-muted line-clamp-3 mt-3 leading-relaxed">
            {item.description}
          </p>
        )}

        {item.date && (
          <div className="flex items-center gap-1.5 text-xs text-neu-muted mt-3">
            <Calendar size={13} />
            <span>{item.date}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <Link
            href={`/anime/${cleanSlug}`}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-neu-accent text-white font-bold text-sm shadow-neu-btn hover:brightness-110 active:scale-95 transition-all"
          >
            <Play size={16} fill="white" />
            <span>Watch Now</span>
          </Link>
          <Link
            href={`/anime/${cleanSlug}`}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-neu-surface text-neu-text font-bold text-sm shadow-neu-btn hover:text-neu-accent active:scale-95 transition-all"
          >
            <Info size={16} />
            <span>Details</span>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows & Indicators */}
      <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 z-10">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + spotlights.length) % spotlights.length)}
          className="w-10 h-10 rounded-xl bg-neu-surface/90 backdrop-blur-md shadow-neu-btn flex items-center justify-center text-neu-text hover:text-neu-accent transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-xs font-mono font-bold text-neu-muted px-1">
          {current + 1} / {spotlights.length}
        </span>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % spotlights.length)}
          className="w-10 h-10 rounded-xl bg-neu-surface/90 backdrop-blur-md shadow-neu-btn flex items-center justify-center text-neu-text hover:text-neu-accent transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
