import { AnimeItem, SpotlightAnime, AnimeDetail, EpisodeItem, ServerItem, StreamData, PaginatedResult } from '@/types';

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.louiv.me/api';
// Normalise base URL without trailing slash
export const API_BASE_URL = RAW_BASE.replace(/\/+$/, '');

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.success === false) {
    throw new Error(json.message || 'API request returned unsuccessful status');
  }

  return json.results as T;
}

// 1. Home
export async function getHomeData() {
  return fetchApi<{
    spotlights: SpotlightAnime[];
    trending: AnimeItem[];
    topAiring: AnimeItem[];
    genres: string[];
  }>('/');
}

// 2. Trending
export async function getTrending() {
  return fetchApi<AnimeItem[]>('/trending');
}

// 3. Most Popular
export async function getMostPopular(page = 1) {
  return fetchApi<PaginatedResult<AnimeItem>>(`/most-popular?page=${page}`);
}

// 4. New Release
export async function getNewRelease(page = 1) {
  return fetchApi<PaginatedResult<AnimeItem>>(`/new-release?page=${page}`);
}

// 5. Newly Added
export async function getNewlyAdded(page = 1) {
  return fetchApi<PaginatedResult<AnimeItem>>(`/newly-added?page=${page}`);
}

// 6. Top 10
export async function getTopTen() {
  return fetchApi<{
    today: AnimeItem[];
    week: AnimeItem[];
    month: AnimeItem[];
  }>('/top-ten');
}

// 7. Trending Sidebar
export async function getTrendingSidebar() {
  return fetchApi<{
    day: AnimeItem[];
    week: AnimeItem[];
    month: AnimeItem[];
    latestEpisodes: AnimeItem[];
  }>('/trending-sidebar');
}

// 8. Search & Suggestions
export async function getSuggestions(keyword: string) {
  if (!keyword.trim()) return [];
  return fetchApi<AnimeItem[]>(`/suggestions?keyword=${encodeURIComponent(keyword)}`);
}

export async function searchAnime(keyword: string, page = 1) {
  return fetchApi<PaginatedResult<AnimeItem>>(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
}

// 9. Filter
export async function filterAnime(params: Record<string, string | number>) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      query.set(k, String(v));
    }
  }
  return fetchApi<PaginatedResult<AnimeItem>>(`/filter?${query.toString()}`);
}

// 10. Schedule
export async function getSchedule(dateStr: string) {
  return fetchApi<any[]>(`/schedule?date=${dateStr}`);
}

// 11. Random
export async function getRandomAnime() {
  return fetchApi<AnimeDetail>('/random');
}

// 12. Info
export async function getAnimeInfo(idOrSlug: string) {
  return fetchApi<AnimeDetail>(`/info?id=${encodeURIComponent(idOrSlug)}`);
}

// 13. Episodes
export async function getAnimeEpisodes(idOrSlug: string) {
  const res = await fetchApi<any>(`/episodes/${encodeURIComponent(idOrSlug)}`);
  if (res && res.episodes && Array.isArray(res.episodes)) {
    return {
      animeId: res.animeId,
      slug: res.slug,
      totalEpisodes: res.totalEpisodes,
      episodes: res.episodes as EpisodeItem[],
    };
  }
  return {
    episodes: [] as EpisodeItem[],
  };
}

// 14. Servers
export async function getServers(serverIds: string) {
  return fetchApi<ServerItem[]>(`/servers?ids=${encodeURIComponent(serverIds)}`);
}

// 15. Stream
export async function getStream(linkId: string) {
  return fetchApi<StreamData>(`/stream?id=${encodeURIComponent(linkId)}`);
}

// 16. Resolve Stream
export async function resolveStream(linkId: string, slug?: string) {
  const ep = slug ? `/stream/resolve?id=${encodeURIComponent(linkId)}&slug=${encodeURIComponent(slug)}` : `/stream/resolve?id=${encodeURIComponent(linkId)}`;
  return fetchApi<StreamData>(ep);
}

// 17. Categories (AZ-list, Genre)
export async function getGenreAnime(genre: string, page = 1) {
  return fetchApi<PaginatedResult<AnimeItem>>(`/genre/${encodeURIComponent(genre)}?page=${page}`);
}

export async function getAzList(letter: string, page = 1) {
  return fetchApi<PaginatedResult<AnimeItem>>(`/az-list/${encodeURIComponent(letter)}?page=${page}`);
}
