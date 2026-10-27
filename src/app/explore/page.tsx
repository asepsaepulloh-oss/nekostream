import { filterAnime } from '@/lib/api';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { AnimeItem } from '@/types';
import Link from 'next/link';

interface ExplorePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'
];

const TYPES = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const currentGenre = params.genre || '';
  const currentType = params.type || '';
  const currentStatus = params.status || '';
  const currentPage = parseInt(params.page || '1', 10) || 1;

  let results: { data: AnimeItem[]; totalPages: number } = { data: [], totalPages: 1 };

  try {
    const res = await filterAnime({
      genre: currentGenre,
      type: currentType,
      status: currentStatus,
      page: currentPage,
    });
    if (res && res.data) {
      results = res;
    }
  } catch (err) {
    console.error('Filter error:', err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Explore & Filter Anime</h1>
        <p className="text-xs text-neu-muted mt-1">Temukan anime berdasarkan genre, tipe tayangan, dan status penayangan.</p>
      </div>

      {/* Filter Chips */}
      <div className="p-5 rounded-3xl bg-neu-surface shadow-neu-flat border border-[#1e2230] space-y-4">
        {/* Genre Selector */}
        <div>
          <span className="text-xs font-bold text-neu-muted uppercase tracking-wider block mb-2">Genre</span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/explore?type=${currentType}&status=${currentStatus}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !currentGenre ? 'bg-neu-surface text-neu-accent shadow-neu-inset' : 'bg-neu-surface shadow-neu-btn text-neu-muted hover:text-white'
              }`}
            >
              All
            </Link>
            {GENRES.map((g) => (
              <Link
                key={g}
                href={`/explore?genre=${encodeURIComponent(g)}&type=${currentType}&status=${currentStatus}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentGenre === g
                    ? 'bg-neu-surface text-neu-accent shadow-neu-inset'
                    : 'bg-neu-surface shadow-neu-btn text-neu-muted hover:text-white'
                }`}
              >
                {g}
              </Link>
            ))}
          </div>
        </div>

        {/* Type Selector */}
        <div>
          <span className="text-xs font-bold text-neu-muted uppercase tracking-wider block mb-2">Tipe</span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/explore?genre=${currentGenre}&status=${currentStatus}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !currentType ? 'bg-neu-surface text-neu-accent shadow-neu-inset' : 'bg-neu-surface shadow-neu-btn text-neu-muted hover:text-white'
              }`}
            >
              All
            </Link>
            {TYPES.map((t) => (
              <Link
                key={t}
                href={`/explore?genre=${currentGenre}&type=${t}&status=${currentStatus}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentType === t
                    ? 'bg-neu-surface text-neu-accent shadow-neu-inset'
                    : 'bg-neu-surface shadow-neu-btn text-neu-muted hover:text-white'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
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
                  href={`/explore?genre=${currentGenre}&type=${currentType}&status=${currentStatus}&page=${currentPage - 1}`}
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
                  href={`/explore?genre=${currentGenre}&type=${currentType}&status=${currentStatus}&page=${currentPage + 1}`}
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
          Tidak ada anime yang cocok dengan filter yang dipilih.
        </div>
      )}
    </div>
  );
}
