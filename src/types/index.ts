export interface AnimeItem {
  id?: string | number;
  slug: string;
  title: string;
  japaneseTitle?: string;
  poster: string;
  type?: string;
  rating?: string;
  sub?: number;
  dub?: number;
  total?: number;
  episodes?: number;
  date?: string;
  description?: string;
  synopsis?: string;
  quality?: string;
}

export interface SpotlightAnime extends AnimeItem {
  description?: string;
  date?: string;
  quality?: string;
}

export interface AnimeDetail {
  slug: string;
  animeId?: string | number;
  title: string;
  japaneseTitle?: string;
  altNames?: string[];
  poster: string;
  backgroundImage?: string;
  synopsis?: string;
  type?: string;
  premiered?: string;
  aired?: string;
  status?: string;
  malScore?: string;
  duration?: string;
  episodes?: number | string;
  studios?: string[];
  producers?: string[];
  genres?: string[];
  rating?: string;
  reviewCount?: string;
}

export interface EpisodeItem {
  id: string;
  episode_no: number;
  slug: string;
  title?: string;
  active?: boolean;
  server_ids: string;
  timestamp?: string;
  mal_id?: string;
}

export interface ServerItem {
  type: 'sub' | 'dub';
  typeLabel?: string;
  ep_id?: string;
  link_id: string;
  cmid?: string;
  sv_id?: string;
  name: string;
  normalizedName?: string;
}

export interface StreamData {
  linkId?: string;
  url?: string | null;
  embedUrl?: string | null;
  type?: string | null;
  qualities?: string[];
  skipData?: {
    intro?: [number, number];
    outro?: [number, number];
  };
  backup?: string | null;
}

export interface WatchData {
  slug: string;
  animeId?: string | number;
  title: string;
  japaneseTitle?: string;
  episodeNumber?: number | string;
  synopsis?: string;
  poster?: string;
  backgroundImage?: string;
  type?: string;
  status?: string;
  servers?: ServerItem[];
  trending?: AnimeItem[];
  recommended?: AnimeItem[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  pagination?: PaginationInfo;
}

export interface WatchHistoryItem {
  slug: string;
  cleanSlug: string;
  title: string;
  poster: string;
  lastEpisode: number | string;
  timestamp: number;
  progressSeconds?: number;
  durationSeconds?: number;
}
