import { useState, useEffect } from 'react';
import { WatchHistoryItem } from '@/types';

const STORAGE_KEY_LIST = 'nekostream_my_list';
const STORAGE_KEY_HISTORY = 'nekostream_watch_history';

export function useMyList() {
  const [list, setList] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIST);
      if (saved) {
        setList(JSON.parse(saved));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const addToList = (slug: string) => {
    setList((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const removeFromList = (slug: string) => {
    setList((prev) => {
      const next = prev.filter((s) => s !== slug);
      try {
        localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleList = (slug: string) => {
    if (list.includes(slug)) {
      removeFromList(slug);
    } else {
      addToList(slug);
    }
  };

  return { list, isLoaded, addToList, removeFromList, toggleList, inList: (slug: string) => list.includes(slug) };
}

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const saveHistory = (item: WatchHistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.cleanSlug !== item.cleanSlug);
      const next = [item, ...filtered].slice(0, 50); // Simpan max 50 riwayat
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  };

  return { history, isLoaded, saveHistory, clearHistory };
}
