import Link from 'next/link';
import { getAzList } from '@/lib/api';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { ListPlus } from 'lucide-react';
import { AnimeItem } from '@/types';

interface AzListPageProps {
  searchParams: Promise<{ letter?: string; page?: string }>;
}

const LETTERS = ['all', 'other', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

export default async function AzListPage({ searchParams }: AzListPageProps) {
  const { letter = 'a', page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  let results: { data: AnimeItem[]; totalPages: number } = { data: [], totalPages: 1 };

  try {
    const res = await getAzList(letter, currentPage);
    if (res && res.data) {
      results = res;
    }
  } catch (err) {
    console.error('Error fetching AZ list:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-secondary">
          <ListPlus size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black">A-Z Anime Directory</h1>
          <p className="text-xs text-neu-muted mt-0.5">Daftar anime lengkap berdasarkan abjad judul.</p>
        </div>
      </div>

      {/* Alphabet Selector */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-neu-surface shadow-neu-inset">
        {LETTERS.map((l) => (
          <Link
            key={l}
            href={`/az-list?letter=${l}`}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black uppercase transition-all ${
              letter === l
                ? 'bg-neu-surface text-neu-accent shadow-neu-btn'
                : 'text-neu-muted hover:text-white'
            }`}
          >
            {l}
          </Link>
        ))}
      </div>

      {/* Grid Results */}
      {results.data && results.data.length > 0 ? (
        <div className="space-y-6">
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
                  href={`/az-list?letter=${letter}&page=${currentPage - 1}`}
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
                  href={`/az-list?letter=${letter}&page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-accent hover:text-white"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-neu-muted">
          Tidak ada anime yang ditemukan untuk huruf "{letter.toUpperCase()}".
        </div>
      )}
    </div>
  );
}
