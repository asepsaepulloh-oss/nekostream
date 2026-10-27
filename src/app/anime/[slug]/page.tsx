import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Star, Calendar, Clock, Tv } from 'lucide-react';
import { getAnimeInfo, getAnimeEpisodes } from '@/lib/api';
import { EpisodeItem } from '@/types';

interface AnimeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { slug } = await params;
  let info = null;
  let episodeList: EpisodeItem[] = [];

  try {
    const [infoRes, epRes] = await Promise.all([
      getAnimeInfo(slug),
      getAnimeEpisodes(slug).catch(() => ({ episodes: [] })),
    ]);
    info = infoRes;
    episodeList = (epRes && epRes.episodes) || [];
  } catch (err) {
    console.error('Error fetching anime detail:', err);
  }

  if (!info) {
    notFound();
  }

  const cleanSlug = (info.slug || slug).split('/')[0];
  const firstEpisode = episodeList.length > 0 ? episodeList[0] : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner / Poster Section */}
      <div className="relative rounded-3xl overflow-hidden bg-neu-surface shadow-neu-flat border border-[#1e2230] p-6 md:p-8">
        {/* Background Backdrop Blur */}
        {info.backgroundImage && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={info.backgroundImage} alt="" className="w-full h-full object-cover filter blur-md" />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <img
            src={info.poster}
            alt={info.title}
            className="w-48 sm:w-56 aspect-[3/4] object-cover rounded-2xl shadow-neu-flat border border-[#232736]"
          />

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <span className="px-2.5 py-1 rounded-lg bg-neu-accent/20 text-neu-accent text-xs font-bold uppercase tracking-wider">
                {info.type || 'Anime'}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 leading-tight">
                {info.title}
              </h1>
              {info.japaneseTitle && (
                <p className="text-sm text-neu-secondary mt-1 font-medium">{info.japaneseTitle}</p>
              )}
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-neu-muted font-medium">
              {info.malScore && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn text-yellow-400 font-bold">
                  <Star size={14} fill="currentColor" /> {info.malScore}
                </span>
              )}
              {info.status && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn text-neu-secondary">
                  <Tv size={14} /> {info.status}
                </span>
              )}
              {info.duration && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn">
                  <Clock size={14} /> {info.duration}
                </span>
              )}
              {info.aired && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn">
                  <Calendar size={14} /> {info.aired}
                </span>
              )}
            </div>

            {/* Genres */}
            {info.genres && info.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {info.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-lg bg-neu-surface shadow-neu-btn text-xs text-neu-muted hover:text-white"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {info.synopsis && (
              <p className="text-xs md:text-sm text-neu-muted leading-relaxed line-clamp-4">
                {info.synopsis}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              {firstEpisode ? (
                <Link
                  href={`/watch/${cleanSlug}/${firstEpisode.episode_no}`}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-neu-accent text-white font-bold text-sm shadow-neu-btn hover:brightness-110 active:scale-95 transition-all"
                >
                  <Play size={16} fill="white" />
                  <span>Watch Episode 1</span>
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-xl bg-neu-surface text-neu-muted text-xs">
                  Episode Belum Tersedia
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <div className="rounded-3xl bg-neu-surface p-6 md:p-8 shadow-neu-flat border border-[#1e2230]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>Daftar Episode</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-neu-accent/20 text-neu-accent font-bold">
            {episodeList.length} Ep
          </span>
        </h2>

        {episodeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-1">
            {episodeList.map((ep) => (
              <Link
                key={ep.id || ep.episode_no}
                href={`/watch/${cleanSlug}/${ep.episode_no}`}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-neu-surface shadow-neu-btn hover:text-neu-accent hover:shadow-neu-inset transition-all group"
              >
                <span className="text-xs font-bold text-neu-text group-hover:text-neu-accent">
                  EP {ep.episode_no}
                </span>
                {ep.title && <span className="text-[10px] text-neu-muted truncate w-full text-center mt-0.5">{ep.title}</span>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-neu-muted text-sm">
            Tidak ada episode yang dapat dimuat.
          </div>
        )}
      </div>
    </div>
  );
}
