'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertTriangle } from 'lucide-react';

interface CustomPlayerProps {
  streamUrl?: string | null;
  embedUrl?: string | null;
  type?: string | null;
  title: string;
}

export function CustomPlayer({ streamUrl, embedUrl, type, title }: CustomPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    setError(null);
    setUseIframe(false);

    if (!streamUrl && embedUrl) {
      setUseIframe(true);
      return;
    }

    if (!streamUrl) {
      setError('Stream URL tidak tersedia.');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const isM3u8 = streamUrl.includes('.m3u8') || type === 'hls';

    if (isM3u8) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.warn('HLS Fatal Error, falling back to embed:', data);
            if (embedUrl) setUseIframe(true);
            else setError('Gagal memuat HLS stream.');
          }
        });
      } else {
        if (embedUrl) setUseIframe(true);
        else setError('Browser tidak mendukung pemutaran HLS video.');
      }
    } else {
      video.src = streamUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, embedUrl, type]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log(e));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (useIframe && embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-neu-flat border border-[#1e2230]">
        <iframe
          src={embedUrl}
          title={title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-neu-flat border border-[#1e2230] group">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-neu-surface">
          <AlertTriangle size={36} className="text-neu-error mb-2" />
          <p className="text-sm text-neu-muted mb-4">{error}</p>
          {embedUrl && (
            <button
              onClick={() => setUseIframe(true)}
              className="px-4 py-2 rounded-xl bg-neu-accent text-white text-xs font-bold shadow-neu-btn"
            >
              Gunakan Player Embed
            </button>
          )}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Minimal Neumorphic Overlay Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-neu-surface/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-text hover:text-neu-accent"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-text hover:text-neu-accent"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="w-9 h-9 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-text hover:text-neu-accent"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
