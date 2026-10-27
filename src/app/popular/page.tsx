import { getMostPopular } from '@/lib/api';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Star } from 'lucide-react';
import { AnimeItem } from '@/types';
import Link from 'next/link';

interface PopularPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PopularPage({ searchParams }: PopularPageProps) {
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  let results: { data: AnimeItem[]; totalPages: number } = { data: [], totalPages: 1 };

  try {
    const res = await getMostPopular(currentPage);
    if (res && res.data) {
      results = res;
    }
  } catch (err) {
    console.error('Error loading most popular anime:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-yellow-400">
          <Star size={22} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Most Popular Anime</h1>
          <p className="text-xs text-neu-muted mt-0.5">Anime dengan jumlah penonton dan rating tertinggi sepanjang masa.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.data.map((anime) => (
          <AnimeCard key={anime.slug} anime={anime} />
        ))}
      </div>

      {/* Pagination */}
      {results.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          {currentPage > 1 && (
            <Link
              href={`/popular?page=${currentPage - 1}`}
              className="px-4 py-2 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-text hover:text-white"
            >
              Prev
            </Link>
          )}
          <span className="text-xs text-neu-muted font-bold px-2">
            Halaman {currentPage} dari {results.totalPages}
          </span>
          {currentPage < results.totalPages && (
            <Link
              href={`/popular?page=${currentPage + 1}`}
              className="px-4 py-2 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-accent hover:text-white"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
