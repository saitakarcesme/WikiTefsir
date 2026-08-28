'use client';

import { PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from 'react';

interface SourceDrawerProps {
  label?: string;
  title: string;
  description?: string;
  pdfUrl?: string;
  page?: number;
  viewerUrl?: string;
  sourceUrl: string;
  sourceLabel: string;
}

const defaultPanelWidth = 640;

export function SourceDrawer({
  label = 'Source', title, description = '', pdfUrl, page, viewerUrl, sourceUrl, sourceLabel,
}: SourceDrawerProps) {
  const [open, setOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(defaultPanelWidth);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resizingRef = useRef(false);
  const pdfTarget = pdfUrl && page ? `${pdfUrl}#page=${page}&view=FitH` : undefined;
  const embeddedTarget = viewerUrl ?? pdfTarget;

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const root = document.documentElement;
    const body = document.body;
    body.classList.add('source-panel-open');
    closeRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) { if (event.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      body.classList.remove('source-panel-open');
      root.style.removeProperty('--source-panel-width');
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open) document.documentElement.style.setProperty('--source-panel-width', `${panelWidth}px`);
  }, [open, panelWidth]);

  function resizePanel(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!resizingRef.current || window.innerWidth <= 760) return;
    const minimum = Math.min(420, window.innerWidth);
    const maximum = Math.max(minimum, window.innerWidth - 340);
    setPanelWidth(Math.max(minimum, Math.min(maximum, window.innerWidth - event.clientX)));
  }

  function openPanel() {
    const initialWidth = window.innerWidth <= 760 ? window.innerWidth : Math.min(defaultPanelWidth, Math.max(420, window.innerWidth - 360));
    setPanelWidth(initialWidth);
    setOpen(true);
  }

  return <>
    <button ref={triggerRef} className="source-trigger" type="button" onClick={openPanel}><span aria-hidden="true">↗</span>{label}</button>
    {open ? <aside className="source-drawer" style={{ width: panelWidth }} role="complementary" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <button className="source-resize-handle" type="button" aria-label="Resize source panel" title="Drag to resize"
        onPointerDown={(event) => { resizingRef.current = true; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={resizePanel}
        onPointerUp={(event) => { resizingRef.current = false; event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { resizingRef.current = false; }} />
      <h2 className="sr-only" id={titleId}>{title}</h2>
      {description ? <p className="sr-only" id={descriptionId}>{description}</p> : null}
      <button ref={closeRef} className="source-close" type="button" aria-label="Close source panel" title="Close source panel" onClick={() => setOpen(false)}>×</button>
      {embeddedTarget
        ? <iframe className="source-document" src={embeddedTarget} title={`${title}${page ? `, page ${page}` : ''}`} />
        : <div className="source-unavailable"><strong>The verified digital source is available in a new tab.</strong><a href={sourceUrl} target="_blank" rel="noreferrer">Open {sourceLabel} ↗</a></div>}
    </aside> : null}
  </>;
}
