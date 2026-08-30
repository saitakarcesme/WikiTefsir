'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@/app/components/locale-provider';

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
  label, title, description = '', pdfUrl, page, viewerUrl, sourceUrl, sourceLabel,
}: SourceDrawerProps) {
  const turkish = useLocale() === 'tr';
  const [open, setOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(defaultPanelWidth);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resizingRef = useRef(false);
  const pdfTarget = pdfUrl && page ? `${pdfUrl}#page=${page}&view=FitH` : undefined;
  const embeddedTarget = viewerUrl ?? pdfTarget;
  const mobileTarget = embeddedTarget ?? sourceUrl;

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

  useEffect(() => {
    if (!open) return;
    function resizePanel(event: PointerEvent) {
      if (!resizingRef.current || window.innerWidth <= 760) return;
      const minimum = Math.min(390, window.innerWidth);
      const maximum = Math.max(minimum, window.innerWidth - 360);
      setPanelWidth(Math.max(minimum, Math.min(maximum, window.innerWidth - event.clientX)));
    }
    function finishResize() {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.classList.remove('source-panel-resizing');
    }
    window.addEventListener('pointermove', resizePanel);
    window.addEventListener('pointerup', finishResize);
    window.addEventListener('pointercancel', finishResize);
    return () => {
      window.removeEventListener('pointermove', resizePanel);
      window.removeEventListener('pointerup', finishResize);
      window.removeEventListener('pointercancel', finishResize);
      document.body.classList.remove('source-panel-resizing');
    };
  }, [open]);

  function openPanel() {
    const initialWidth = window.innerWidth <= 760 ? window.innerWidth : Math.min(defaultPanelWidth, Math.max(420, window.innerWidth - 360));
    setPanelWidth(initialWidth);
    setOpen(true);
  }

  return <>
    <button ref={triggerRef} className="source-trigger" type="button" onClick={openPanel}><span aria-hidden="true">↗</span>{label ?? (turkish ? 'Kaynak' : 'Source')}</button>
    {open ? createPortal(<aside className="source-drawer" style={{ width: panelWidth }} role="complementary" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <button className="source-resize-handle" type="button" aria-label={turkish ? 'Kaynak panelini boyutlandır' : 'Resize source panel'} title={turkish ? 'Boyutlandırmak için sürükleyin' : 'Drag to resize'}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          const minimum = Math.min(390, window.innerWidth);
          const maximum = Math.max(minimum, window.innerWidth - 360);
          const step = event.shiftKey ? 64 : 24;
          setPanelWidth((width) => Math.max(minimum, Math.min(maximum, width + (event.key === 'ArrowLeft' ? step : -step))));
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          resizingRef.current = true;
          document.body.classList.add('source-panel-resizing');
        }} />
      <h2 className="sr-only" id={titleId}>{title}</h2>
      {description ? <p className="sr-only" id={descriptionId}>{description}</p> : null}
      <button ref={closeRef} className="source-close" type="button" aria-label={turkish ? 'Kaynak panelini kapat' : 'Close source panel'} title={turkish ? 'Kaynak panelini kapat' : 'Close source panel'} onClick={() => setOpen(false)}>×</button>
      {embeddedTarget
        ? <><iframe className="source-document" src={embeddedTarget} title={`${title}${page ? `, page ${page}` : ''}`} /><div className="source-mobile-fallback"><small>{sourceLabel}</small><strong>{title}</strong>{description ? <p>{description}</p> : null}<a href={mobileTarget} target="_blank" rel="noreferrer">{turkish ? 'PDF kaynağını aç' : 'Open PDF source'} ↗</a></div></>
        : <div className="source-unavailable"><strong>{turkish ? 'Doğrulanmış dijital kaynak yeni sekmede kullanılabilir.' : 'The verified digital source is available in a new tab.'}</strong><a href={sourceUrl} target="_blank" rel="noreferrer">{turkish ? `${sourceLabel} kaynağını aç` : `Open ${sourceLabel}`} ↗</a></div>}
    </aside>, document.body) : null}
  </>;
}
