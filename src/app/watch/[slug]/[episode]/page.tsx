'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Play, Tv, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { getAnimeInfo, getAnimeEpisodes, getServers, getStream, resolveStream } from '@/lib/api';
import { CustomPlayer } from '@/components/player/CustomPlayer';
import { AnimeDetail, EpisodeItem, ServerItem, StreamData } from '@/types';
import { useWatchHistory } from '@/lib/storage';

export default function WatchPage() {
  const params = useParams();
  const slug = (params.slug as string) || '';
  const episodeNo = parseInt((params.episode as string) || '1', 10);
  const cleanSlug = slug.split('/')[0];

  const [info, setInfo] = useState<AnimeDetail | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [activeType, setActiveType] = useState<'sub' | 'dub'>('sub');
  const [selectedServer, setSelectedServer] = useState<ServerItem | null>(null);
  const [streamData, setStreamData] = useState<StreamData | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { saveHistory } = useWatchHistory();

  // 1. Load Info & Episodes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [infoRes, epRes] = await Promise.all([
          getAnimeInfo(cleanSlug),
          getAnimeEpisodes(cleanSlug),
        ]);
        setInfo(infoRes);
        setEpisodes(epRes.episodes || []);

        if (infoRes) {
          saveHistory({
            slug,
            cleanSlug,
            title: infoRes.title,
            poster: infoRes.poster,
            lastEpisode: episodeNo,
            timestamp: Date.now(),
          });
        }
      } catch (err: any) {
        console.error('Error loading anime watch page:', err);
        setError('Gagal mengambil data anime atau episode.');
      } finally {
        setLoading(false);
      }
    }

    if (cleanSlug) {
      loadData();
    }
  }, [cleanSlug, episodeNo]);

  // 2. Load Servers for current episode
  useEffect(() => {
    if (!episodes || episodes.length === 0) return;
    const currentEp = episodes.find((e) => e.episode_no === episodeNo) || episodes[0];
    if (!currentEp || !currentEp.server_ids) {
      setServers([]);
      return;
    }

    async function loadServerList() {
      try {
        const serverList = await getServers(currentEp.server_ids);
        setServers(serverList || []);

        // Pick default server (prefer SUB)
        const subServers = (serverList || []).filter((s) => s.type === 'sub');
        if (subServers.length > 0) {
          setActiveType('sub');
          setSelectedServer(subServers[0]);
        } else if (serverList && serverList.length > 0) {
          setActiveType(serverList[0].type);
          setSelectedServer(serverList[0]);
        }
      } catch (err) {
        console.error('Error loading servers:', err);
      }
    }

    loadServerList();
  }, [episodes, episodeNo]);

  // 3. Load Stream when server selected
  useEffect(() => {
    if (!selectedServer || !selectedServer.link_id) {
      setStreamData(null);
      return;
    }

    async function loadStreamSource() {
      setLoadingStream(true);
      try {
        // Try resolve stream first
        const resolved = await resolveStream(selectedServer!.link_id, cleanSlug).catch(() => null);
        if (resolved && (resolved.url || resolved.embedUrl)) {
          setStreamData(resolved);
        } else {
          // Fallback to basic /stream endpoint
          const direct = await getStream(selectedServer!.link_id).catch(() => null);
          setStreamData(direct);
        }
      } catch (err) {
        console.error('Error streaming source:', err);
      } finally {
        setLoadingStream(false);
      }
    }

    loadStreamSource();
  }, [selectedServer, cleanSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={36} className="text-neu-accent animate-spin mb-3" />
        <p className="text-sm text-neu-muted">Memuat pemutar NekoStream...</p>
      </div>
    );
  }

  const filteredServers = servers.filter((s) => s.type === activeType);
  const nextEp = episodes.find((e) => e.episode_no === episodeNo + 1);
  const prevEp = episodes.find((e) => e.episode_no === episodeNo - 1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Title & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href={`/anime/${cleanSlug}`}
            className="text-xs text-neu-muted hover:text-neu-accent flex items-center gap-1 mb-1 font-semibold"
          >
            ← Kembali ke detail anime
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-white">
            {info?.title || 'Anime'} — Episode {episodeNo}
          </h1>
        </div>

        {/* Next / Prev Episode Buttons */}
        <div className="flex items-center gap-2">
          {prevEp && (
            <Link
              href={`/watch/${cleanSlug}/${prevEp.episode_no}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-text hover:text-neu-accent transition-all"
            >
              <ArrowLeft size={14} />
              <span>Prev Ep</span>
            </Link>
          )}
          {nextEp && (
            <Link
              href={`/watch/${cleanSlug}/${nextEp.episode_no}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neu-accent text-white shadow-neu-btn text-xs font-bold hover:brightness-110 transition-all"
            >
              <span>Next Ep</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Video Player Box */}
      <div className="relative">
        {loadingStream ? (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black flex flex-col items-center justify-center shadow-neu-flat">
            <Loader2 size={32} className="text-neu-accent animate-spin mb-2" />
            <p className="text-xs text-neu-muted">Menghubungkan ke server video...</p>
          </div>
        ) : (
          <CustomPlayer
            streamUrl={streamData?.url}
            embedUrl={streamData?.embedUrl}
            type={streamData?.type}
            title={`${info?.title} - Ep ${episodeNo}`}
          />
        )}
      </div>

      {/* Server & Sub/Dub Switcher */}
      <div className="p-4 md:p-6 rounded-3xl bg-neu-surface shadow-neu-flat border border-[#1e2230] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Segmented Control Sub / Dub */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-neu-surface shadow-neu-inset">
            <button
              onClick={() => {
                setActiveType('sub');
                const firstSub = servers.find((s) => s.type === 'sub');
                if (firstSub) setSelectedServer(firstSub);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                activeType === 'sub'
                  ? 'bg-neu-surface text-neu-accent shadow-neu-btn'
                  : 'text-neu-muted hover:text-white'
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => {
                setActiveType('dub');
                const firstDub = servers.find((s) => s.type === 'dub');
                if (firstDub) setSelectedServer(firstDub);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                activeType === 'dub'
                  ? 'bg-neu-surface text-yellow-400 shadow-neu-btn'
                  : 'text-neu-muted hover:text-white'
              }`}
            >
              DUB
            </button>
          </div>

          <span className="text-xs text-neu-muted font-medium">
            Ganti server jika video lambat atau buffering.
          </span>
        </div>

        {/* Available Servers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {filteredServers.length > 0 ? (
            filteredServers.map((srv, idx) => {
              const isSelected = selectedServer?.link_id === srv.link_id;
              return (
                <button
                  key={srv.link_id || idx}
                  onClick={() => setSelectedServer(srv)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-neu-surface text-neu-accent shadow-neu-inset border border-neu-accent/30'
                      : 'bg-neu-surface shadow-neu-btn text-neu-text hover:text-white'
                  }`}
                >
                  {srv.name || `Server ${idx + 1}`}
                </button>
              );
            })
          ) : (
            <div className="flex items-center gap-2 text-xs text-neu-muted py-2">
              <AlertCircle size={14} />
              <span>Tidak ada server {activeType.toUpperCase()} yang tersedia untuk episode ini.</span>
            </div>
          )}
        </div>
      </div>

      {/* Episode Selector Grid */}
      <div className="p-4 md:p-6 rounded-3xl bg-neu-surface shadow-neu-flat border border-[#1e2230] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center justify-between">
          <span>Pilih Episode</span>
          <span className="text-xs text-neu-muted font-normal">Total {episodes.length} Episode</span>
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-60 overflow-y-auto p-1">
          {episodes.map((ep) => {
            const isActive = ep.episode_no === episodeNo;
            return (
              <Link
                key={ep.id || ep.episode_no}
                href={`/watch/${cleanSlug}/${ep.episode_no}`}
                className={`py-2 text-center rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-neu-accent text-white shadow-md'
                    : 'bg-neu-surface shadow-neu-btn text-neu-muted hover:text-white hover:shadow-neu-inset'
                }`}
              >
                {ep.episode_no}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
