import { searchQuran } from '@/lib/quran-search';
import { isLocale } from '@/lib/locale';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const requestedLocale = new URL(request.url).searchParams.get('lang') ?? undefined;
  const results = searchQuran(query, 12, isLocale(requestedLocale) ? requestedLocale : 'en');

  return Response.json(
    { query: query.slice(0, 160), results },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=3600' } },
  );
}
