'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { KnowledgeGraphBranch, KnowledgeGraphNode } from '@/lib/knowledge-graph';
import type { Locale } from '@/lib/locale';

const mosaicTileCount = 648;

function AllahMosaic({ locale }: { locale: Locale }) {
  const tr = locale === 'tr';
  return <div className="atlas-overview" aria-label={tr ? 'IslamWiki bilgi evreninin kuş bakışı görünümü' : 'Bird’s-eye view of the IslamWiki knowledge universe'}>
    <svg className="atlas-allah-mosaic" viewBox="0 0 1200 600" role="img" aria-label={tr ? 'Bilgi düğümlerinin oluşturduğu Allah lafzı' : 'The name of Allah formed by knowledge nodes'}>
      <defs>
        <mask id="atlas-allah-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <rect width="1200" height="600" fill="black" />
          <text x="600" y="485" fill="white" fontFamily="Amiri, Noto Naskh Arabic, Georgia, serif" fontSize="560" textAnchor="middle" direction="rtl">الله</text>
        </mask>
      </defs>
      <foreignObject x="70" y="35" width="1060" height="520" mask="url(#atlas-allah-mask)">
        <div className="atlas-mosaic-grid">
          {Array.from({ length: mosaicTileCount }, (_, index) => <span key={index} aria-hidden="true" />)}
        </div>
      </foreignObject>
    </svg>
    <p>{tr ? 'Düğümleri gerçek diyagram kartları olarak görmek için + ile yaklaşın.' : 'Use + to reveal the tiles as full diagram nodes.'}</p>
  </div>;
}

export function KnowledgeGraphExplorer({ initialBranch, locale }: { initialBranch: KnowledgeGraphBranch; locale: Locale }) {
  const pageSize = 48;
  const [branch, setBranch] = useState(initialBranch);
  const [history, setHistory] = useState<KnowledgeGraphBranch[]>([]);
  const [forward, setForward] = useState<KnowledgeGraphBranch[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const tr = locale === 'tr';

  useEffect(() => () => requestRef.current?.abort(), []);

  async function loadNode(node: KnowledgeGraphNode, direction: 'down' | 'up' = 'down') {
    if (!node.childCount) {
      if (node.href) window.location.assign(node.href);
      return;
    }
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    try {
      const response = await fetch(`/api/graph?id=${encodeURIComponent(node.id)}&locale=${locale}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Graph request failed: ${response.status}`);
      const next = await response.json() as KnowledgeGraphBranch;
      if (direction === 'down') {
        setHistory((items) => [...items, branch]);
        setForward([]);
      }
      setOverviewExpanded(false);
      setVisibleCount(pageSize);
      setBranch(next);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  async function zoomOut() {
    if (branch.node.id === 'allah' && overviewExpanded) {
      setOverviewExpanded(false);
      return;
    }
    const previous = history.at(-1);
    if (previous) {
      setForward((items) => [branch, ...items]);
      setHistory((items) => items.slice(0, -1));
      setVisibleCount(pageSize);
      setBranch(previous);
      return;
    }
    if (branch.parentId) await loadNode({ id: branch.parentId, label: '', eyebrow: '', childCount: 1 }, 'up');
  }

  function zoomIn() {
    if (branch.node.id === 'allah' && !overviewExpanded) {
      setOverviewExpanded(true);
      return;
    }
    const next = forward[0];
    if (!next) return;
    setHistory((items) => [...items, branch]);
    setForward((items) => items.slice(1));
    setVisibleCount(pageSize);
    setBranch(next);
  }

  function goHome() {
    if (branch.node.id === 'allah') {
      setOverviewExpanded(false);
      return;
    }
    const root = history.find((item) => item.node.id === 'allah');
    if (root) {
      setForward((items) => [branch, ...items]);
      setHistory([]);
      setVisibleCount(pageSize);
      setBranch(root);
      setOverviewExpanded(false);
      return;
    }
    void loadNode({ id: 'allah', label: 'الله', eyebrow: '', childCount: 1 }, 'up');
    setHistory([]);
  }

  const isOverview = branch.node.id === 'allah';
  const showMosaic = isOverview && !overviewExpanded;

  return <section className={`atlas-stage${loading ? ' is-loading' : ''}${showMosaic ? ' is-overview' : ''}`} aria-label={tr ? 'Etkileşimli bilgi grafiği' : 'Interactive knowledge graph'}>
    {!showMosaic ? <div className="atlas-path" aria-label={tr ? 'Grafik yolu' : 'Graph path'}>
      {[...history, branch].map((item, index, items) => <button type="button" key={`${item.node.id}-${index}`} onClick={() => {
        if (index === items.length - 1) return;
        setForward(items.slice(index + 1));
        setHistory(items.slice(0, index));
        setVisibleCount(pageSize);
        setBranch(item);
      }}>{item.node.label}</button>)}
    </div> : null}
    {showMosaic ? <AllahMosaic locale={locale} /> : <div className="atlas-tree" aria-live="polite">
      <div className={`atlas-parent${branch.node.id === 'allah' ? ' atlas-allah' : ''}`}>
        <small>{branch.node.eyebrow}</small><strong>{branch.node.label}</strong>
        {branch.node.href ? <Link href={branch.node.href} aria-label={tr ? 'Makaleyi aç' : 'Open article'}>↗</Link> : null}
      </div>
      {branch.children.length ? <><span className="atlas-stem" aria-hidden="true" /><div className={`atlas-children${branch.children.length > 24 ? ' atlas-many' : ''}`}>
        {branch.children.slice(0, visibleCount).map((node) => <button type="button" onClick={() => void loadNode(node)} key={node.id} className={node.childCount ? '' : 'atlas-leaf'}>
          <small>{node.eyebrow}</small><strong>{node.label}</strong><span>{node.childCount ? node.childCount.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') : '↗'}</span>
        </button>)}
        {visibleCount < branch.children.length ? <button type="button" className="atlas-more" onClick={() => setVisibleCount((count) => count + pageSize)}>
          <small>{tr ? 'Aynı katman' : 'Same level'}</small><strong>{tr ? 'Daha fazla düğüm göster' : 'Show more nodes'}</strong><span>+{Math.min(pageSize, branch.children.length - visibleCount)}</span>
        </button> : null}
      </div></> : <p className="atlas-empty">{tr ? 'Bu düğüm doğrudan kaynak makalesine açılır.' : 'This node opens its source article directly.'}</p>}
    </div>}
    <div className="atlas-controls" aria-label={tr ? 'Grafik kontrolleri' : 'Graph controls'}>
      <button type="button" onClick={zoomOut} disabled={branch.node.id === 'allah' && !overviewExpanded} aria-label={tr ? 'Bir üst katmana çık' : 'Move up one level'}>−</button>
      <button type="button" onClick={zoomIn} disabled={(branch.node.id !== 'allah' && !forward.length) || (branch.node.id === 'allah' && overviewExpanded)} aria-label={tr ? 'Düğümleri yaklaştır' : 'Zoom into nodes'}>+</button>
      <button type="button" onClick={goHome} disabled={branch.node.id === 'allah' && !overviewExpanded} aria-label={tr ? 'Allah görünümüne dön' : 'Return to Allah overview'}>⌂</button>
    </div>
  </section>;
}
