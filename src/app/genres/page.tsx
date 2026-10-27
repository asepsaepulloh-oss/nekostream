import Link from 'next/link';
import { Grid } from 'lucide-react';

const ALL_GENRES = [
  'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 'Ecchi',
  'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Kids',
  'Magic', 'Mahou Shoujo', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery',
  'Parody', 'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi',
  'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 'Space',
  'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
];

export default function GenresPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-accent">
          <Grid size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black">All Anime Genres</h1>
          <p className="text-xs text-neu-muted mt-0.5">Pilih genre anime favorit Anda untuk mulai menonton.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {ALL_GENRES.map((g) => (
          <Link
            key={g}
            href={`/explore?genre=${encodeURIComponent(g)}`}
            className="flex items-center justify-center p-4 rounded-2xl bg-neu-surface shadow-neu-btn hover:shadow-neu-inset hover:text-neu-accent text-sm font-bold text-center transition-all"
          >
            {g}
          </Link>
        ))}
      </div>
    </div>
  );
}
