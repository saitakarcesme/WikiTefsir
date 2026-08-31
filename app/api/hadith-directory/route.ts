import { getHadithDirectoryRecords, normalizeHadithSearch } from '@/lib/hadith-directory-data';
import { isLocale } from '@/lib/locale';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const requestedLocale = params.get('lang') ?? undefined;
  const locale = isLocale(requestedLocale) ? requestedLocale : 'en';
  const query = normalizeHadithSearch((params.get('q') ?? '').slice(0, 160));
  const theme = (params.get('theme') ?? '').slice(0, 80);
  const offset = Math.max(0, Number(params.get('offset') ?? 0) || 0);
  const limit = Math.min(60, Math.max(1, Number(params.get('limit') ?? 30) || 30));
  const filtered = getHadithDirectoryRecords(locale).filter((record) => {
    if (theme && !record.themes.includes(theme)) return false;
    if (query.length < 2) return true;
    return normalizeHadithSearch(`${record.id} ${record.title} ${record.attribution} ${record.grade} ${record.categories} ${record.themes.join(' ')}`).includes(query);
  });
  return Response.json({ records: filtered.slice(offset, offset + limit), total: filtered.length }, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
