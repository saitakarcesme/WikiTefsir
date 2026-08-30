import { NextResponse } from 'next/server';
import { isLocale } from '@/lib/locale';
import { getKnowledgeGraphBranch, getKnowledgeGraphNetwork } from '@/lib/knowledge-graph';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || 'allah';
  const requestedLocale = url.searchParams.get('locale') || undefined;
  const locale = isLocale(requestedLocale) ? requestedLocale : 'en';
  if (url.searchParams.get('mode') === 'global') return NextResponse.json(getKnowledgeGraphNetwork(locale));
  const branch = getKnowledgeGraphBranch(id, locale);
  return branch ? NextResponse.json(branch) : NextResponse.json({ error: 'Graph node not found' }, { status: 404 });
}
