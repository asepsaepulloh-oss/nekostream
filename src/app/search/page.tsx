import { searchAnime } from '@/lib/api';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { AnimeItem } from '@/types';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { keyword = '', page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  let results: { data: AnimeItem[]; totalPages: number } = { data: [], totalPages: 1 };

  if (keyword.trim()) {
    try {
      const res = await searchAnime(keyword.trim(), currentPage);
      if (res && res.data) {
        results = res;
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-black">
          Hasil Pencarian: <span className="text-neu-accent font-medium">"{keyword}"</span>
        </h1>
        <span className="text-xs text-neu-muted">{results.data.length} anime ditemukan</span>
      </div>

      {results.data && results.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.data.map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8">
              {currentPage > 1 && (
                <Link
                  href={`/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage - 1}`}
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
                  href={`/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-accent hover:text-white"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center text-neu-muted space-y-2">
          <p className="text-lg">Tidak ada anime yang ditemukan untuk kata kunci tersebut.</p>
          <p className="text-xs">Coba kata kunci lain atau gunakan fitur Explore.</p>
        </div>
      )}
    </div>
  );
}
