import Link from 'next/link';
import { ArrowRight, Flame, Star, Sparkles, TrendingUp } from 'lucide-react';
import { getHomeData, getTopTen, getTrendingSidebar } from '@/lib/api';
import { HeroSpotlight } from '@/components/anime/HeroSpotlight';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { SpotlightAnime, AnimeItem } from '@/types';

export const revalidate = 300; // revalidate every 5 minutes

export default async function HomePage() {
  let homeData: {
    spotlights: SpotlightAnime[];
    trending: AnimeItem[];
    topAiring: AnimeItem[];
    genres: string[];
  } = { spotlights: [], trending: [], topAiring: [], genres: [] };

  let topTen: {
    today: AnimeItem[];
    week: AnimeItem[];
    month: AnimeItem[];
  } = { today: [], week: [], month: [] };

  let sidebar: {
    day: AnimeItem[];
    week: AnimeItem[];
    month: AnimeItem[];
    latestEpisodes: AnimeItem[];
  } = { day: [], week: [], month: [], latestEpisodes: [] };

  try {
    const [hRes, tRes, sRes] = await Promise.allSettled([
      getHomeData(),
      getTopTen(),
      getTrendingSidebar(),
    ]);
    if (hRes.status === 'fulfilled') homeData = hRes.value;
    if (tRes.status === 'fulfilled') topTen = tRes.value;
    if (sRes.status === 'fulfilled') sidebar = sRes.value;
  } catch (err) {
    console.error('Error loading home data:', err);
  }

  return (
    <div className="space-y-12">
      {/* 1. Hero Spotlight Carousel */}
      {homeData.spotlights && homeData.spotlights.length > 0 && (
        <HeroSpotlight spotlights={homeData.spotlights} />
      )}

      {/* 2. Trending Anime Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neu-surface shadow-neu-btn flex items-center justify-center text-orange-400">
              <Flame size={18} />
            </div>
            <h2 className="text-xl font-extrabold tracking-wide">Trending Now</h2>
          </div>
          <Link
            href="/trending"
            className="flex items-center gap-1.5 text-xs font-bold text-neu-accent hover:text-white px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn transition-all"
          >
            <span>See All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(homeData.trending || []).slice(0, 12).map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      </section>

      {/* 3. Top Airing & Top 10 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Airing (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-secondary">
                <Sparkles size={18} />
              </div>
              <h2 className="text-xl font-extrabold tracking-wide">Top Airing Anime</h2>
            </div>
            <Link
              href="/explore?status=Currently+Airing"
              className="flex items-center gap-1.5 text-xs font-bold text-neu-accent hover:text-white px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn transition-all"
            >
              <span>Explore</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(homeData.topAiring || []).slice(0, 8).map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        </div>

        {/* Top 10 Ranking Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neu-surface shadow-neu-btn flex items-center justify-center text-yellow-400">
              <Star size={18} />
            </div>
            <h2 className="text-xl font-extrabold tracking-wide">Top 10 Today</h2>
          </div>

          <div className="rounded-2xl bg-neu-surface p-4 shadow-neu-flat border border-[#1e2230] space-y-3">
            {(topTen.today || []).slice(0, 10).map((item, index) => {
              const cleanSlug = (item.slug || '').split('/')[0];
              return (
                <Link
                  key={item.slug || index}
                  href={`/anime/${cleanSlug}`}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#252a38] transition-all group"
                >
                  <span
                    className={`font-black text-lg w-6 text-center ${
                      index === 0
                        ? 'text-yellow-400'
                        : index === 1
                        ? 'text-gray-300'
                        : index === 2
                        ? 'text-amber-600'
                        : 'text-neu-muted'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-10 h-14 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neu-text group-hover:text-neu-accent transition-colors truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-neu-muted mt-1 font-medium">
                      {item.type && <span className="uppercase">{item.type}</span>}
                      {item.sub !== undefined && <span>SUB {item.sub}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Latest Updated Episodes */}
      {sidebar.latestEpisodes && sidebar.latestEpisodes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neu-surface shadow-neu-btn flex items-center justify-center text-emerald-400">
                <TrendingUp size={18} />
              </div>
              <h2 className="text-xl font-extrabold tracking-wide">Latest Updated Episodes</h2>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-xs font-bold text-neu-accent hover:text-white px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn transition-all"
            >
              <span>See All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sidebar.latestEpisodes.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
