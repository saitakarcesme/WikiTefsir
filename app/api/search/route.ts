import { searchQuran } from '@/lib/quran-search';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const results = searchQuran(query);

  return Response.json(
    { query: query.slice(0, 160), results },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=3600' } },
  );
}
