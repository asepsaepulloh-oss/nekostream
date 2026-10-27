import { getSchedule } from '@/lib/api';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface SchedulePageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const { date } = await searchParams;
  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDate = date || todayStr;

  let scheduleList: any[] = [];
  try {
    const res = await getSchedule(selectedDate);
    scheduleList = res || [];
  } catch (err) {
    console.error('Error fetching schedule:', err);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neu-surface shadow-neu-btn flex items-center justify-center text-neu-secondary">
            <Calendar size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Release Schedule</h1>
            <p className="text-xs text-neu-muted mt-0.5">Jadwal rilis episode anime harian.</p>
          </div>
        </div>

        {/* Date Selector Simple */}
        <form className="flex items-center gap-2">
          <input
            type="date"
            name="date"
            defaultValue={selectedDate}
            className="px-3.5 py-2 rounded-xl bg-neu-surface shadow-neu-inset text-xs font-bold text-neu-text focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-neu-accent text-white text-xs font-bold shadow-neu-btn"
          >
            Pilih
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-neu-surface p-6 shadow-neu-flat border border-[#1e2230] space-y-3">
        {scheduleList.length > 0 ? (
          scheduleList.map((item, idx) => {
            const cleanSlug = (item.slug || '').split('/')[0];
            return (
              <div
                key={item.slug || idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-neu-surface hover:bg-[#252a38] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 text-xs font-mono font-bold text-neu-accent">
                    {item.time || item.airingTime || 'Airing'}
                  </span>
                  <div>
                    <Link
                      href={`/anime/${cleanSlug}`}
                      className="text-sm font-bold text-white hover:text-neu-accent transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    {item.japaneseTitle && (
                      <p className="text-xs text-neu-muted truncate">{item.japaneseTitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.episode && (
                    <span className="px-2 py-0.5 rounded-lg bg-neu-surface shadow-neu-btn text-xs font-bold text-neu-secondary">
                      EP {item.episode}
                    </span>
                  )}
                  <Link
                    href={`/anime/${cleanSlug}`}
                    className="px-3 py-1.5 rounded-xl bg-neu-accent text-white text-xs font-bold shadow-neu-btn"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-neu-muted text-sm">
            Tidak ada jadwal rilis yang ditemukan untuk tanggal ini.
          </div>
        )}
      </div>
    </div>
  );
}
