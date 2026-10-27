'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { useMyList } from '@/lib/storage';
import { getAnimeInfo } from '@/lib/api';
import { AnimeItem } from '@/types';
import { AnimeCard } from '@/components/anime/AnimeCard';

export default function MyListPage() {
  const { list, removeFromList, isLoaded } = useMyList();
  const [animeData, setAnimeData] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (list.length === 0) {
      setAnimeData([]);
      setLoading(false);
      return;
    }

    async function loadSavedAnime() {
      setLoading(true);
      try {
        const promises = list.map((slug) => getAnimeInfo(slug).catch(() => null));
        const res = await Promise.all(promises);
        const valid = res.filter(Boolean) as AnimeItem[];
        setAnimeData(valid);
      } catch (err) {
        console.error('Error loading my list:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSavedAnime();
  }, [list, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-accent">
          <Bookmark size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black">My Anime List</h1>
          <p className="text-xs text-neu-muted mt-0.5">Daftar anime favorit Anda yang tersimpan di perangkat ini.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neu-muted text-sm">Memuat daftar simpanan...</div>
      ) : animeData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeData.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-neu-muted space-y-3">
          <p className="text-base font-semibold">Belum ada anime di daftar Anda.</p>
          <p className="text-xs">Klik tombol bookmark pada card anime untuk menyimpannya di sini.</p>
          <Link
            href="/trending"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-neu-accent text-white text-xs font-bold shadow-neu-btn"
          >
            Jelajahi Anime Trending
          </Link>
        </div>
      )}
    </div>
  );
}
