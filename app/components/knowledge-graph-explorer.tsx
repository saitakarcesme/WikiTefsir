'use client';

import { FormEvent, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { KnowledgeGraphKind, KnowledgeGraphNetwork } from '@/lib/knowledge-graph';
import type { Locale } from '@/lib/locale';

type Point = { x: number; y: number };
type Camera = Point & { zoom: number };
type DragState = { pointerId: number; startX: number; startY: number; cameraX: number; cameraY: number; nodeId?: string };

const kindOrder: KnowledgeGraphKind[] = ['collection', 'surah', 'verse', 'hadith', 'person', 'concept', 'scholar', 'story'];
const kindColors: Record<KnowledgeGraphKind, string> = { root: '#f3c969', collection: '#8ab4f8', surah: '#75d3b1', verse: '#9aa0a6', hadith: '#d9a7ff', person: '#ff9f8f', concept: '#67c7e8', scholar: '#e9bb75', story: '#f28fb3' };
const kindLabels = {
  en: { root: 'root', collection: 'collection', surah: 'surah', verse: 'verse', hadith: 'hadith', person: 'person', concept: 'concept', scholar: 'scholar', story: 'story' },
  tr: { root: 'kök', collection: 'koleksiyon', surah: 'sure', verse: 'ayet', hadith: 'hadis', person: 'kişi', concept: 'kavram', scholar: 'âlim', story: 'kıssa' },
} as const;

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return Math.abs(result);
}

function createLayout(network: KnowledgeGraphNetwork) {
  const positions = new Map<string, Point>();
  const children = new Map<string, string[]>();
  for (const edge of network.edges) {
    if (edge.relation !== 'contains') continue;
    const items = children.get(edge.source) ?? [];
    items.push(edge.target);
    children.set(edge.source, items);
  }
  positions.set('islamwiki', { x: 0, y: 0 });
  const collectionIds = children.get('islamwiki') ?? [];
  collectionIds.forEach((id, index) => {
    const angle = index / Math.max(1, collectionIds.length) * Math.PI * 2 - Math.PI / 2;
    positions.set(id, { x: Math.cos(angle) * 930, y: Math.sin(angle) * 680 });
  });
  for (const collectionId of collectionIds) {
    const center = positions.get(collectionId) ?? { x: 0, y: 0 };
    const directChildren = children.get(collectionId) ?? [];
    directChildren.forEach((id, index) => {
      const angle = index * 2.399963 + (hash(collectionId) % 360) * Math.PI / 180;
      const radius = 84 + Math.sqrt(index + 1) * 47;
      positions.set(id, { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius });
    });
  }
  for (const [parentId, childIds] of children) {
    if (parentId === 'islamwiki' || collectionIds.includes(parentId)) continue;
    const center = positions.get(parentId);
    if (!center) continue;
    childIds.forEach((id, index) => {
      if (positions.has(id)) return;
      const angle = index * 2.399963 + (hash(parentId) % 360) * Math.PI / 180;
      const radius = 19 + Math.sqrt(index + 1) * 10;
      positions.set(id, { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius });
    });
  }
  for (const node of network.nodes) {
    if (positions.has(node.id)) continue;
    const angle = hash(node.id) % 6283 / 1000;
    const radius = 700 + hash(`${node.id}:r`) % 1000;
    positions.set(node.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return positions;
}

function buildAdjacency(network: KnowledgeGraphNetwork) {
  const result = new Map<string, Set<string>>();
  for (const edge of network.edges) {
    if (!result.has(edge.source)) result.set(edge.source, new Set());
    if (!result.has(edge.target)) result.set(edge.target, new Set());
    result.get(edge.source)?.add(edge.target);
    result.get(edge.target)?.add(edge.source);
  }
  return result;
}

function localIds(start: string, depth: number, adjacency: Map<string, Set<string>>) {
  const result = new Set([start]);
  let frontier = new Set([start]);
  for (let level = 0; level < depth; level += 1) {
    const next = new Set<string>();
    for (const id of frontier) for (const neighbor of adjacency.get(id) ?? []) if (!result.has(neighbor)) { result.add(neighbor); next.add(neighbor); }
    frontier = next;
  }
  return result;
}

export function KnowledgeGraphExplorer({ locale }: { locale: Locale }) {
  const tr = locale === 'tr';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const positionsRef = useRef(new Map<string, Point>());
  const globalPositionsRef = useRef(new Map<string, Point>());
  const cameraRef = useRef<Camera>({ x: 0, y: 0, zoom: .28 });
  const targetCameraRef = useRef<Camera>({ x: 0, y: 0, zoom: .28 });
  const dragRef = useRef<DragState | undefined>(undefined);
  const [network, setNetwork] = useState<KnowledgeGraphNetwork>();
  const [selectedId, setSelectedId] = useState('islamwiki');
  const [hoveredId, setHoveredId] = useState<string>();
  const [mode, setMode] = useState<'global' | 'local'>('global');
  const [depth, setDepth] = useState(1);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase(locale === 'tr' ? 'tr-TR' : 'en-US'));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [labelThreshold, setLabelThreshold] = useState(.78);
  const [nodeScale, setNodeScale] = useState(1);
  const [linkScale, setLinkScale] = useState(1);
  const [hiddenKinds, setHiddenKinds] = useState<Set<KnowledgeGraphKind>>(new Set());

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/graph?mode=global&locale=${locale}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Graph request failed: ${response.status}`); return response.json() as Promise<KnowledgeGraphNetwork>; })
      .then((payload) => {
        const positions = createLayout(payload);
        globalPositionsRef.current = positions;
        positionsRef.current = new Map(positions);
        setNetwork(payload);
      })
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) console.error(error); });
    return () => controller.abort();
  }, [locale]);

  const nodeById = useMemo(() => new Map(network?.nodes.map((node) => [node.id, node]) ?? []), [network]);
  const adjacency = useMemo(() => network ? buildAdjacency(network) : new Map<string, Set<string>>(), [network]);
  const local = useMemo(() => mode === 'local' ? localIds(selectedId, depth, adjacency) : undefined, [adjacency, depth, mode, selectedId]);
  const visibleNodeIds = useMemo(() => {
    if (!network) return new Set<string>();
    return new Set(network.nodes.flatMap((node) => node.kind !== 'root' && hiddenKinds.has(node.kind) || local && !local.has(node.id) ? [] : [node.id]));
  }, [hiddenKinds, local, network]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !network) return;
    const context = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!context || !parent) return;
    let width = 0; let height = 0; let dpr = 1;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height); dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(parent);
    const draw = () => {
      const camera = cameraRef.current; const targetCamera = targetCameraRef.current;
      camera.x += (targetCamera.x - camera.x) * .13; camera.y += (targetCamera.y - camera.y) * .13; camera.zoom += (targetCamera.zoom - camera.zoom) * .13;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const styles = getComputedStyle(document.documentElement);
      const paper = styles.getPropertyValue('--reader-paper').trim() || '#fff'; const ink = styles.getPropertyValue('--reader-ink').trim() || '#111'; const muted = styles.getPropertyValue('--reader-muted').trim() || '#777'; const line = styles.getPropertyValue('--reader-line').trim() || '#ddd';
      context.fillStyle = paper; context.fillRect(0, 0, width, height);
      const toScreen = (point: Point) => ({ x: width / 2 + (point.x - camera.x) * camera.zoom, y: height / 2 + (point.y - camera.y) * camera.zoom });
      const focusId = hoveredId ?? selectedId; const neighbors = adjacency.get(focusId); const hasFocus = Boolean(hoveredId || mode === 'local' && selectedId);
      context.lineCap = 'round';
      for (const edge of network.edges) {
        if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) continue;
        const source = positionsRef.current.get(edge.source); const targetPoint = positionsRef.current.get(edge.target); if (!source || !targetPoint) continue;
        const a = toScreen(source); const b = toScreen(targetPoint);
        if (a.x < -80 && b.x < -80 || a.y < -80 && b.y < -80 || a.x > width + 80 && b.x > width + 80 || a.y > height + 80 && b.y > height + 80) continue;
        const active = focusId === edge.source || focusId === edge.target;
        context.globalAlpha = hasFocus ? active ? .84 : .055 : .17; context.strokeStyle = active ? kindColors[nodeById.get(focusId)?.kind ?? 'root'] : line; context.lineWidth = (active ? 1.8 : .72) * linkScale;
        context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        if (showArrows && camera.zoom > .55) { const angle = Math.atan2(b.y - a.y, b.x - a.x); const arrow = 5; context.beginPath(); context.moveTo(b.x, b.y); context.lineTo(b.x - Math.cos(angle - .45) * arrow, b.y - Math.sin(angle - .45) * arrow); context.lineTo(b.x - Math.cos(angle + .45) * arrow, b.y - Math.sin(angle + .45) * arrow); context.closePath(); context.fillStyle = active ? kindColors[nodeById.get(focusId)?.kind ?? 'root'] : line; context.fill(); }
      }
      for (const node of network.nodes) {
        if (!visibleNodeIds.has(node.id)) continue;
        const point = positionsRef.current.get(node.id); if (!point) continue;
        const screen = toScreen(point); const radius = Math.max(1.7, Math.min(14, (2.1 + Math.sqrt(node.weight) * 1.5) * nodeScale * Math.sqrt(Math.max(.35, camera.zoom))));
        if (screen.x < -40 || screen.y < -40 || screen.x > width + 40 || screen.y > height + 40) continue;
        const active = node.id === focusId; const related = neighbors?.has(node.id) || active;
        context.globalAlpha = hasFocus ? related ? 1 : .12 : .82; context.beginPath(); context.arc(screen.x, screen.y, radius, 0, Math.PI * 2); context.fillStyle = kindColors[node.kind]; context.fill();
        if (node.id === selectedId) { context.strokeStyle = ink; context.lineWidth = 2; context.stroke(); }
        const queryMatch = deferredQuery.length > 1 && node.label.toLocaleLowerCase(locale === 'tr' ? 'tr-TR' : 'en-US').includes(deferredQuery);
        const showLabel = active || queryMatch || node.kind === 'root' || node.kind === 'collection' && camera.zoom > .32 || camera.zoom > labelThreshold + (node.kind === 'verse' || node.kind === 'hadith' ? .7 : 0);
        if (showLabel) { context.globalAlpha = hasFocus ? related ? 1 : .18 : 1; context.font = `${active ? 600 : 500} ${active ? 13 : 11}px system-ui, sans-serif`; context.fillStyle = active ? ink : muted; context.textAlign = 'center'; context.textBaseline = 'top'; const text = node.label.length > 46 ? `${node.label.slice(0, 43)}…` : node.label; context.fillText(text, screen.x, screen.y + radius + 5); }
      }
      context.globalAlpha = 1; frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    return () => { observer.disconnect(); cancelAnimationFrame(frameRef.current); };
  }, [adjacency, deferredQuery, hoveredId, labelThreshold, linkScale, locale, mode, network, nodeById, nodeScale, selectedId, showArrows, visibleNodeIds]);

  function screenToWorld(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect(); const camera = cameraRef.current;
    if (!rect) return { x: 0, y: 0 };
    return { x: camera.x + (clientX - rect.left - rect.width / 2) / camera.zoom, y: camera.y + (clientY - rect.top - rect.height / 2) / camera.zoom };
  }
  function nodeAt(clientX: number, clientY: number) {
    const point = screenToWorld(clientX, clientY); let best: { id: string; distance: number } | undefined;
    for (const id of visibleNodeIds) { const position = positionsRef.current.get(id); const node = nodeById.get(id); if (!position || !node) continue; const distance = Math.hypot(position.x - point.x, position.y - point.y); const radius = Math.max(12 / cameraRef.current.zoom, 5 + Math.sqrt(node.weight) * 2.2); if (distance <= radius && (!best || distance < best.distance)) best = { id, distance }; }
    return best?.id;
  }
  function arrangeLocal(id: string, level = depth) {
    const center = positionsRef.current.get(id) ?? globalPositionsRef.current.get(id) ?? { x: 0, y: 0 };
    const distances = new Map<string, number>([[id, 0]]);
    let frontier = [id];
    for (let distance = 1; distance <= level; distance += 1) {
      const next: string[] = [];
      for (const current of frontier) for (const neighbor of adjacency.get(current) ?? []) {
        if (distances.has(neighbor)) continue;
        distances.set(neighbor, distance); next.push(neighbor);
      }
      frontier = next;
    }
    positionsRef.current.set(id, center);
    for (let distance = 1; distance <= level; distance += 1) {
      const ring = [...distances].filter(([, value]) => value === distance).map(([nodeId]) => nodeId).sort();
      const perRing = 16;
      ring.forEach((nodeId, index) => {
        const band = Math.floor(index / perRing);
        const itemsInBand = Math.min(perRing, ring.length - band * perRing);
        const indexInBand = index % perRing;
        const radius = 175 + (distance - 1) * 180 + band * 105;
        const angle = -Math.PI / 2 + (indexInBand / Math.max(1, itemsInBand)) * Math.PI * 2 + distance * .14;
        positionsRef.current.set(nodeId, { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius });
      });
    }
    return center;
  }
  function focusNode(id: string, localMode = mode === 'local') {
    const position = localMode ? arrangeLocal(id) : positionsRef.current.get(id);
    if (!position) return;
    setSelectedId(id);
    if (localMode) setMode('local');
    const localZoom = (canvasRef.current?.clientWidth ?? 1000) < 600 ? .56 : .82;
    targetCameraRef.current = { x: position.x, y: position.y, zoom: Math.max(targetCameraRef.current.zoom, localMode ? localZoom : .62) };
  }
  function activateGlobal() {
    positionsRef.current = new Map(globalPositionsRef.current);
    setMode('global');
    targetCameraRef.current = { x: 0, y: 0, zoom: .28 };
  }
  function activateLocal(level = depth) {
    const center = arrangeLocal(selectedId, level);
    setMode('local');
    const localZoom = (canvasRef.current?.clientWidth ?? 1000) < 600 ? .56 : .82;
    targetCameraRef.current = { x: center.x, y: center.y, zoom: localZoom };
  }
  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) { const id = nodeAt(event.clientX, event.clientY); event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, cameraX: targetCameraRef.current.x, cameraY: targetCameraRef.current.y, nodeId: id }; }
  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) { const drag = dragRef.current; if (drag?.pointerId === event.pointerId) { const dx = event.clientX - drag.startX; const dy = event.clientY - drag.startY; if (drag.nodeId && Math.hypot(dx, dy) > 3) positionsRef.current.set(drag.nodeId, screenToWorld(event.clientX, event.clientY)); else if (!drag.nodeId) targetCameraRef.current = { ...targetCameraRef.current, x: drag.cameraX - dx / cameraRef.current.zoom, y: drag.cameraY - dy / cameraRef.current.zoom }; return; } setHoveredId(nodeAt(event.clientX, event.clientY)); }
  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>) { const drag = dragRef.current; dragRef.current = undefined; if (drag && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4 && drag.nodeId) focusNode(drag.nodeId, false); }
  function handleWheel(event: ReactWheelEvent<HTMLCanvasElement>) { event.preventDefault(); const factor = Math.exp(-event.deltaY * .0012); targetCameraRef.current = { ...targetCameraRef.current, zoom: Math.min(3.5, Math.max(.08, targetCameraRef.current.zoom * factor)) }; }
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!network || deferredQuery.length < 2) return;
    const kindPriority: Record<KnowledgeGraphKind, number> = {
      person: 0, root: 1, collection: 2, surah: 3, concept: 4, story: 5, scholar: 6, hadith: 7, verse: 8,
    };
    const normalized = (value: string) => value.toLocaleLowerCase(locale === 'tr' ? 'tr-TR' : 'en-US');
    const match = network.nodes
      .filter((node) => normalized(node.label).includes(deferredQuery))
      .sort((a, b) => {
        const aLabel = normalized(a.label); const bLabel = normalized(b.label);
        const aMatch = aLabel === deferredQuery ? 0 : aLabel.startsWith(deferredQuery) ? 1 : 2;
        const bMatch = bLabel === deferredQuery ? 0 : bLabel.startsWith(deferredQuery) ? 1 : 2;
        return aMatch - bMatch || kindPriority[a.kind] - kindPriority[b.kind] || aLabel.length - bLabel.length;
      })[0];
    if (match) focusNode(match.id, true);
  }

  const selected = nodeById.get(selectedId);
  const zoomBy = (factor: number) => { targetCameraRef.current = { ...targetCameraRef.current, zoom: Math.min(3.5, Math.max(.08, targetCameraRef.current.zoom * factor)) }; };
  const fit = () => { activateGlobal(); setSelectedId('islamwiki'); };

  return <section className="obsidian-graph" aria-label={tr ? 'Etkileşimli IslamWiki bilgi grafiği' : 'Interactive IslamWiki knowledge graph'}>
    <canvas ref={canvasRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={() => { dragRef.current = undefined; }} onDoubleClick={(event) => { const node = nodeById.get(nodeAt(event.clientX, event.clientY) ?? ''); if (node?.href) window.location.assign(node.href); }} onWheel={handleWheel} aria-label={tr ? 'Grafik tuvali' : 'Graph canvas'} />
    <form className="graph-search" role="search" onSubmit={handleSearch}><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr ? 'Grafikte ara…' : 'Search graph…'} aria-label={tr ? 'Grafikte ara' : 'Search graph'} /><button type="submit">↵</button></form>
    <div className="graph-mode" role="group" aria-label={tr ? 'Grafik kapsamı' : 'Graph scope'}><button className={mode === 'global' ? 'active' : ''} onClick={activateGlobal} type="button">{tr ? 'Genel' : 'Global'}</button><button className={mode === 'local' ? 'active' : ''} onClick={() => activateLocal()} type="button">{tr ? 'Yerel' : 'Local'}</button>{mode === 'local' ? <label>{tr ? 'Derinlik' : 'Depth'} <input type="range" min="1" max="3" value={depth} onChange={(event) => { const nextDepth = Number(event.target.value); setDepth(nextDepth); activateLocal(nextDepth); }} /><span>{depth}</span></label> : null}</div>
    <button className="graph-settings-toggle" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen} aria-label={tr ? 'Grafik ayarları' : 'Graph settings'}>⚙</button>
    {settingsOpen ? <aside className="graph-settings"><header><strong>{tr ? 'Grafik ayarları' : 'Graph settings'}</strong><button type="button" onClick={() => setSettingsOpen(false)}>×</button></header><fieldset><legend>{tr ? 'Filtreler' : 'Filters'}</legend>{kindOrder.map((kind) => <label key={kind}><input type="checkbox" checked={!hiddenKinds.has(kind)} onChange={() => setHiddenKinds((current) => { const next = new Set(current); if (next.has(kind)) next.delete(kind); else next.add(kind); return next; })} /><span style={{ background: kindColors[kind] }} />{kindLabels[locale][kind]}</label>)}</fieldset><fieldset><legend>{tr ? 'Görünüm' : 'Display'}</legend><label className="graph-slider">{tr ? 'Etiket eşiği' : 'Text fade'}<input type="range" min=".35" max="1.4" step=".05" value={labelThreshold} onChange={(event) => setLabelThreshold(Number(event.target.value))} /></label><label className="graph-slider">{tr ? 'Düğüm boyutu' : 'Node size'}<input type="range" min=".65" max="1.8" step=".05" value={nodeScale} onChange={(event) => setNodeScale(Number(event.target.value))} /></label><label className="graph-slider">{tr ? 'Çizgi kalınlığı' : 'Link thickness'}<input type="range" min=".5" max="2" step=".05" value={linkScale} onChange={(event) => setLinkScale(Number(event.target.value))} /></label><label><input type="checkbox" checked={showArrows} onChange={(event) => setShowArrows(event.target.checked)} />{tr ? 'Okları göster' : 'Show arrows'}</label></fieldset></aside> : null}
    <div className="graph-selection" aria-live="polite"><span style={{ background: kindColors[selected?.kind ?? 'root'] }} /><div><small>{kindLabels[locale][selected?.kind ?? 'root']}</small><strong>{selected?.label ?? (tr ? 'Grafik yükleniyor…' : 'Loading graph…')}</strong></div>{selected?.href ? <a href={selected.href}>{tr ? 'Makaleyi aç' : 'Open article'} ↗</a> : null}</div>
    <div className="graph-legend">{kindOrder.filter((kind) => !hiddenKinds.has(kind)).map((kind) => <span key={kind}><i style={{ background: kindColors[kind] }} />{kindLabels[locale][kind]}</span>)}</div>
    <div className="graph-controls"><button type="button" onClick={() => zoomBy(1.35)} aria-label={tr ? 'Yakınlaştır' : 'Zoom in'}>+</button><button type="button" onClick={() => zoomBy(.74)} aria-label={tr ? 'Uzaklaştır' : 'Zoom out'}>−</button><button type="button" onClick={fit} aria-label={tr ? 'Grafiği ekrana sığdır' : 'Fit graph'}>⌗</button></div>
  </section>;
}
