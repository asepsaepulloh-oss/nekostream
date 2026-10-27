'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Star } from 'lucide-react';
import { AnimeItem } from '@/types';
import { useMyList } from '@/lib/storage';

interface AnimeCardProps {
  anime: AnimeItem;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const cleanSlug = (anime.slug || '').split('/')[0];
  const { toggleList, inList } = useMyList();
  const isSaved = inList(cleanSlug);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-neu-surface p-2.5 shadow-neu-flat hover:shadow-neu-inset transition-all duration-300">
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#151722]">
        <img
          src={anime.poster}
          alt={anime.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {anime.type && (
            <span className="px-2 py-0.5 rounded-md bg-neu-bg/80 backdrop-blur-md text-[10px] font-extrabold uppercase text-neu-accent shadow-sm">
              {anime.type}
            </span>
          )}
          {anime.rating && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/80 backdrop-blur-md text-[10px] font-bold text-white shadow-sm">
              <Star size={10} fill="white" />
              {anime.rating}
            </span>
          )}
        </div>

        {/* Bookmark Action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleList(cleanSlug);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all backdrop-blur-md ${
            isSaved
              ? 'bg-neu-accent text-white shadow-md'
              : 'bg-neu-bg/60 text-neu-muted hover:text-white'
          }`}
          aria-label="Add to List"
        >
          <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Sub / Dub Indicators */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1">
            {anime.sub !== undefined && (
              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-neu-secondary">
                SUB {anime.sub}
              </span>
            )}
            {anime.dub !== undefined && anime.dub > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-yellow-400">
                DUB {anime.dub}
              </span>
            )}
          </div>
          {anime.total ? (
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-gray-300 font-medium">
              EP {anime.total}
            </span>
          ) : null}
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="mt-2.5 flex flex-col flex-1 justify-between px-1">
        <Link href={`/anime/${cleanSlug}`} className="block">
          <h3
            className="text-sm font-semibold text-neu-text line-clamp-2 hover:text-neu-accent transition-colors leading-snug"
            title={anime.title}
          >
            {anime.title}
          </h3>
        </Link>
        {anime.japaneseTitle && (
          <p className="text-[11px] text-neu-muted truncate mt-0.5">
            {anime.japaneseTitle}
          </p>
        )}
      </div>
    </div>
  );
}
