import { redirect } from 'next/navigation';
import { getRandomAnime } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function RandomPage() {
  try {
    const anime = await getRandomAnime();
    if (anime && anime.slug) {
      const cleanSlug = anime.slug.split('/')[0];
      redirect(`/anime/${cleanSlug}`);
    }
  } catch (err) {
    console.error('Error fetching random anime:', err);
  }

  redirect('/');
}
