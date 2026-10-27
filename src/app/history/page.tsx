'use client';

import React from 'react';
import Link from 'next/link';
import { History, Play, Trash2 } from 'lucide-react';
import { useWatchHistory } from '@/lib/storage';

export default function HistoryPage() {
  const { history, clearHistory, isLoaded } = useWatchHistory();

  if (!isLoaded) {
    return <div className="py-20 text-center text-neu-muted text-sm">Memuat riwayat tontonan...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-secondary">
            <History size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Watch History</h1>
            <p className="text-xs text-neu-muted mt-0.5">Riwayat episode anime yang terakhir Anda tonton.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-error hover:brightness-110 transition-all"
          >
            <Trash2 size={14} />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div
              key={item.cleanSlug || idx}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neu-surface shadow-neu-flat border border-[#1e2230] hover:bg-[#252a38] transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded-xl shadow-md"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-neu-accent/20 text-neu-accent text-[11px] font-bold">
                      Episode {item.lastEpisode}
                    </span>
                    <span className="text-[11px] text-neu-muted">
                      {new Date(item.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/watch/${item.cleanSlug}/${item.lastEpisode}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neu-accent text-white text-xs font-bold shadow-neu-btn hover:brightness-110 transition-all"
              >
                <Play size={13} fill="white" />
                <span>Lanjut Nonton</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-neu-muted space-y-3">
          <p className="text-base font-semibold">Belum ada riwayat tontonan.</p>
          <p className="text-xs">Episode anime yang Anda tonton akan otomatis dicatat di sini.</p>
        </div>
      )}
    </div>
  );
}
