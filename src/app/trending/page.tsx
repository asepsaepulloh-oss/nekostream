import { getTrending } from '@/lib/api';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Flame } from 'lucide-react';
import { AnimeItem } from '@/types';

export const revalidate = 300;

export default async function TrendingPage() {
  let trendingList: AnimeItem[] = [];

  try {
    const res = await getTrending();
    trendingList = res || [];
  } catch (err) {
    console.error('Error loading trending anime:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-orange-400">
          <Flame size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black">Trending Anime</h1>
          <p className="text-xs text-neu-muted mt-0.5">Anime terpopuler dan paling banyak dibicarakan saat ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {trendingList.map((anime) => (
          <AnimeCard key={anime.slug} anime={anime} />
        ))}
      </div>
    </div>
  );
}
