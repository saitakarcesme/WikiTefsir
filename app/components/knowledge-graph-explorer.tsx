'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { KnowledgeGraphBranch, KnowledgeGraphNode } from '@/lib/knowledge-graph';
import type { Locale } from '@/lib/locale';

export function KnowledgeGraphExplorer({ initialBranch, locale }: { initialBranch: KnowledgeGraphBranch; locale: Locale }) {
  const [branch, setBranch] = useState(initialBranch);
  const [history, setHistory] = useState<KnowledgeGraphBranch[]>([]);
  const [forward, setForward] = useState<KnowledgeGraphBranch[]>([]);
  const [loading, setLoading] = useState(false);
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
      setBranch(next);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  async function zoomOut() {
    const previous = history.at(-1);
    if (previous) {
      setForward((items) => [branch, ...items]);
      setHistory((items) => items.slice(0, -1));
      setBranch(previous);
      return;
    }
    if (branch.parentId) await loadNode({ id: branch.parentId, label: '', eyebrow: '', childCount: 1 }, 'up');
  }

  function zoomIn() {
    const next = forward[0];
    if (!next) return;
    setHistory((items) => [...items, branch]);
    setForward((items) => items.slice(1));
    setBranch(next);
  }

  function goHome() {
    if (branch.node.id === 'allah') return;
    const root = history.find((item) => item.node.id === 'allah');
    if (root) {
      setForward((items) => [branch, ...items]);
      setHistory([]);
      setBranch(root);
      return;
    }
    void loadNode({ id: 'allah', label: 'الله', eyebrow: '', childCount: 1 }, 'up');
    setHistory([]);
  }

  return <section className={`atlas-stage${loading ? ' is-loading' : ''}`} aria-label={tr ? 'Etkileşimli bilgi grafiği' : 'Interactive knowledge graph'}>
    <div className="atlas-path" aria-label={tr ? 'Grafik yolu' : 'Graph path'}>
      {[...history, branch].map((item, index, items) => <button type="button" key={`${item.node.id}-${index}`} onClick={() => {
        if (index === items.length - 1) return;
        setForward(items.slice(index + 1));
        setHistory(items.slice(0, index));
        setBranch(item);
      }}>{item.node.label}</button>)}
    </div>
    <div className="atlas-tree" aria-live="polite">
      <div className={`atlas-parent${branch.node.id === 'allah' ? ' atlas-allah' : ''}`}>
        <small>{branch.node.eyebrow}</small><strong>{branch.node.label}</strong>
        {branch.node.href ? <Link href={branch.node.href} aria-label={tr ? 'Makaleyi aç' : 'Open article'}>↗</Link> : null}
      </div>
      {branch.children.length ? <><span className="atlas-stem" aria-hidden="true" /><div className={`atlas-children${branch.children.length > 24 ? ' atlas-many' : ''}`}>
        {branch.children.map((node) => <button type="button" onClick={() => void loadNode(node)} key={node.id} className={node.childCount ? '' : 'atlas-leaf'}>
          <small>{node.eyebrow}</small><strong>{node.label}</strong><span>{node.childCount ? node.childCount.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') : '↗'}</span>
        </button>)}
      </div></> : <p className="atlas-empty">{tr ? 'Bu düğüm doğrudan kaynak makalesine açılır.' : 'This node opens its source article directly.'}</p>}
    </div>
    <div className="atlas-controls" aria-label={tr ? 'Grafik kontrolleri' : 'Graph controls'}>
      <button type="button" onClick={zoomOut} disabled={branch.node.id === 'allah'} aria-label={tr ? 'Bir üst katmana çık' : 'Move up one level'}>−</button>
      <button type="button" onClick={zoomIn} disabled={!forward.length} aria-label={tr ? 'Alt katmana dön' : 'Return to child level'}>+</button>
      <button type="button" onClick={goHome} disabled={branch.node.id === 'allah'} aria-label={tr ? 'Allah düğümüne dön' : 'Return to Allah node'}>⌂</button>
    </div>
  </section>;
}
