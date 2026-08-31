import { NextResponse } from 'next/server';
import { isLocale } from '@/lib/locale';
import { getKnowledgeGraphBranch, getKnowledgeGraphFocus, getKnowledgeGraphNetwork, getKnowledgeGraphOverview, searchKnowledgeGraph } from '@/lib/knowledge-graph';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || 'allah';
  const requestedLocale = url.searchParams.get('locale') || undefined;
  const locale = isLocale(requestedLocale) ? requestedLocale : 'en';
  const mode = url.searchParams.get('mode');
  const cacheHeaders = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };
  if (mode === 'overview' || mode === 'global') return NextResponse.json(getKnowledgeGraphOverview(locale), { headers: cacheHeaders });
  if (mode === 'focus') {
    const depth = Number(url.searchParams.get('depth') || 1);
    const network = getKnowledgeGraphFocus(locale, id, Number.isFinite(depth) ? depth : 1);
    return network ? NextResponse.json(network, { headers: cacheHeaders }) : NextResponse.json({ error: 'Graph node not found' }, { status: 404 });
  }
  if (mode === 'search') {
    const match = searchKnowledgeGraph(locale, url.searchParams.get('q') || '');
    const network = match ? getKnowledgeGraphFocus(locale, match.id, 1) : undefined;
    return match && network
      ? NextResponse.json({ selectedId: match.id, network }, { headers: cacheHeaders })
      : NextResponse.json({ error: 'Graph node not found' }, { status: 404 });
  }
  if (mode === 'full') return NextResponse.json(getKnowledgeGraphNetwork(locale), { headers: cacheHeaders });
  const branch = getKnowledgeGraphBranch(id, locale);
  return branch ? NextResponse.json(branch) : NextResponse.json({ error: 'Graph node not found' }, { status: 404 });
}
