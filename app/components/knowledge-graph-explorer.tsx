'use client';

import Link from 'next/link';
import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';

type NodeType = 'person' | 'concept' | 'surah' | 'scholar' | 'hadith';
interface GraphNode { id: string; label: string; type: NodeType; href: string; x: number; y: number; vx: number; vy: number }
interface GraphEdge { from: string; to: string }

const seedNodes: Omit<GraphNode, 'vx' | 'vy'>[] = [
  { id: 'musa', label: 'Moses', type: 'person', href: '/person/musa', x: .28, y: .42 },
  { id: 'muhammad', label: 'Muhammad', type: 'person', href: '/person/muhammad', x: .67, y: .56 },
  { id: 'revelation', label: 'Revelation', type: 'concept', href: '/concept/revelation', x: .49, y: .28 },
  { id: 'prophethood', label: 'Prophethood', type: 'concept', href: '/concept/prophethood', x: .51, y: .55 },
  { id: 'guidance', label: 'Guidance', type: 'concept', href: '/concept/guidance', x: .42, y: .74 },
  { id: 'mercy', label: 'Mercy', type: 'concept', href: '/concept/mercy', x: .78, y: .25 },
  { id: 'ta-ha', label: 'Ta-Ha', type: 'surah', href: '/surah/ta-ha', x: .13, y: .64 },
  { id: 'qasas', label: 'Al-Qasas', type: 'surah', href: '/surah/al-qasas', x: .13, y: .24 },
  { id: 'ahzab', label: 'Al-Ahzab', type: 'surah', href: '/surah/al-ahzab', x: .86, y: .68 },
  { id: 'tabari', label: 'Al-Tabari', type: 'scholar', href: '/scholars/taberi', x: .34, y: .12 },
  { id: 'kathir', label: 'Ibn Kathir', type: 'scholar', href: '/scholars/ibn-kesir', x: .65, y: .12 },
  { id: 'qurtubi', label: 'Al-Qurtubi', type: 'scholar', href: '/scholars/kurtubi', x: .88, y: .43 },
  { id: 'worship', label: 'Worship', type: 'concept', href: '/concept/worship', x: .64, y: .82 },
  { id: 'hadith', label: 'Authentic hadith', type: 'hadith', href: '/hadith', x: .87, y: .86 },
];

const edges: GraphEdge[] = [
  { from: 'musa', to: 'revelation' }, { from: 'musa', to: 'prophethood' }, { from: 'musa', to: 'guidance' }, { from: 'musa', to: 'ta-ha' }, { from: 'musa', to: 'qasas' },
  { from: 'muhammad', to: 'revelation' }, { from: 'muhammad', to: 'prophethood' }, { from: 'muhammad', to: 'mercy' }, { from: 'muhammad', to: 'ahzab' }, { from: 'muhammad', to: 'hadith' },
  { from: 'revelation', to: 'tabari' }, { from: 'revelation', to: 'kathir' }, { from: 'prophethood', to: 'qurtubi' }, { from: 'guidance', to: 'worship' }, { from: 'worship', to: 'hadith' },
];

const colors: Record<NodeType, string> = { person: '#111827', concept: '#2563eb', surah: '#ffffff', scholar: '#f3f4f6', hadith: '#ffffff' };

export function KnowledgeGraphExplorer({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>(seedNodes.map((node) => ({ ...node, vx: 0, vy: 0 })));
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);
  const [activeId, setActiveId] = useState<string>('musa');
  const active = useMemo(() => seedNodes.find((node) => node.id === activeId) ?? seedNodes[0], [activeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const graphCanvas: HTMLCanvasElement = canvas;
    const graphContext: CanvasRenderingContext2D = context;
    let width = 0; let height = 0; let disposed = false;

    function resize() {
      const rect = graphCanvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      graphCanvas.width = Math.round(width * ratio); graphCanvas.height = Math.round(height * ratio);
      graphContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    const observer = new ResizeObserver(resize); observer.observe(graphCanvas); resize();

    function draw() {
      if (disposed) return;
      const nodes = nodesRef.current;
      const byId = new Map(nodes.map((node) => [node.id, node]));
      for (const node of nodes) {
        if (dragRef.current?.id === node.id) continue;
        const seed = seedNodes.find((item) => item.id === node.id)!;
        node.vx += (seed.x - node.x) * .00055; node.vy += (seed.y - node.y) * .00055;
        node.vx *= .94; node.vy *= .94; node.x += node.vx; node.y += node.vy;
      }
      graphContext.clearRect(0, 0, width, height);
      graphContext.lineWidth = 1;
      for (const edge of edges) {
        const from = byId.get(edge.from); const to = byId.get(edge.to); if (!from || !to) continue;
        graphContext.strokeStyle = edge.from === activeId || edge.to === activeId ? 'rgba(37,99,235,.56)' : 'rgba(107,114,128,.20)';
        graphContext.beginPath(); graphContext.moveTo(from.x * width, from.y * height); graphContext.lineTo(to.x * width, to.y * height); graphContext.stroke();
      }
      graphContext.textAlign = 'center'; graphContext.textBaseline = 'middle'; graphContext.font = '500 11px Geist, Arial, sans-serif';
      for (const node of nodes) {
        const x = node.x * width; const y = node.y * height; const radius = node.type === 'person' ? 26 : 18;
        graphContext.beginPath(); graphContext.arc(x, y, radius, 0, Math.PI * 2);
        graphContext.fillStyle = colors[node.type]; graphContext.fill();
        graphContext.strokeStyle = node.id === activeId ? '#2563eb' : '#d1d5db'; graphContext.lineWidth = node.id === activeId ? 2 : 1; graphContext.stroke();
        graphContext.fillStyle = node.type === 'person' || node.type === 'concept' ? '#fff' : '#1f2937';
        const shortLabel = node.label.length > 13 ? `${node.label.slice(0, 12)}…` : node.label; graphContext.fillText(shortLabel, x, y);
      }
      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => { disposed = true; cancelAnimationFrame(frameRef.current); observer.disconnect(); };
  }, [activeId]);

  function locate(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height;
    return nodesRef.current.find((node) => Math.hypot((node.x - x) * rect.width, (node.y - y) * rect.height) <= (node.type === 'person' ? 30 : 23));
  }
  function pointerDown(event: PointerEvent<HTMLCanvasElement>) { const node = locate(event); if (!node) return; dragRef.current = { id: node.id, moved: false }; event.currentTarget.setPointerCapture(event.pointerId); setActiveId(node.id); }
  function pointerMove(event: PointerEvent<HTMLCanvasElement>) { if (!dragRef.current) return; const node = nodesRef.current.find((item) => item.id === dragRef.current?.id); if (!node) return; const rect = event.currentTarget.getBoundingClientRect(); node.x = Math.max(.05, Math.min(.95, (event.clientX - rect.left) / rect.width)); node.y = Math.max(.08, Math.min(.92, (event.clientY - rect.top) / rect.height)); node.vx = 0; node.vy = 0; dragRef.current.moved = true; }
  function pointerUp(event: PointerEvent<HTMLCanvasElement>) { const dragged = dragRef.current; dragRef.current = null; if (!dragged?.moved) { const node = seedNodes.find((item) => item.id === dragged?.id); if (node) window.location.assign(node.href); } try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {} }

  return <section className={`knowledge-explorer${compact ? ' compact' : ''}`} aria-labelledby="knowledge-explorer-title">
    <div className="knowledge-explorer-copy"><span className="reader-overline">Knowledge graph</span><h2 id="knowledge-explorer-title">See how every article connects.</h2><p>Drag a node to explore the network. Select it to open the linked article.</p><Link href={active.href}>Open {active.label} <span aria-hidden="true">→</span></Link></div>
    <div className="knowledge-canvas-wrap"><canvas ref={canvasRef} role="img" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { dragRef.current = null; }} aria-label="Interactive graph connecting people, concepts, surahs, scholars, and hadith. The same nodes are available as links below." /><div className="graph-key"><span><i className="person" />Person</span><span><i className="concept" />Concept</span><span><i />Source article</span></div></div>
    <ul className="graph-node-links" aria-label="All nodes in the graph">{seedNodes.map((node) => <li key={node.id}><Link href={node.href}>{node.label} <small>{node.type}</small></Link></li>)}</ul>
  </section>;
}
