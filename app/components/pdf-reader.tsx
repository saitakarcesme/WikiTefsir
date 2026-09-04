'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

interface PdfReaderProps {
  source: string;
  originalSource: string;
  initialPage?: number;
  title: string;
  sourceLabel: string;
  turkish: boolean;
}

export function PdfReader({ source, originalSource, initialPage = 1, title, sourceLabel, turkish }: PdfReaderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(initialPage);
  const [zoom, setZoom] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let disposed = false;
    let loadedDocument: PDFDocumentProxy | null = null;

    void import('pdfjs-dist').then(async (pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      const task = pdfjs.getDocument(source);
      loadedDocument = await task.promise;
      if (disposed) return;
      setDocument(loadedDocument);
      setPage(Math.min(Math.max(1, initialPage), loadedDocument.numPages));
    }).catch(() => {
      if (!disposed) setError(true);
    }).finally(() => {
      if (!disposed) setLoading(false);
    });

    return () => {
      disposed = true;
      renderTaskRef.current?.cancel();
      void loadedDocument?.destroy();
    };
  }, [initialPage, source]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(viewport);
    setViewportWidth(viewport.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!document || !canvas || viewportWidth <= 0) return;
    let cancelled = false;
    renderTaskRef.current?.cancel();

    void document.getPage(page).then((pdfPage) => {
      if (cancelled) return;
      const baseViewport = pdfPage.getViewport({ scale: 1 });
      const fitScale = Math.max(.35, (viewportWidth - 32) / baseViewport.width);
      const displayViewport = pdfPage.getViewport({ scale: fitScale * zoom });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const renderViewport = pdfPage.getViewport({ scale: fitScale * zoom * pixelRatio });
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;
      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(displayViewport.width)}px`;
      canvas.style.height = `${Math.floor(displayViewport.height)}px`;
      const task = pdfPage.render({ canvas, canvasContext: context, viewport: renderViewport });
      renderTaskRef.current = task;
      void task.promise.catch((reason: { name?: string }) => {
        if (reason?.name !== 'RenderingCancelledException') setError(true);
      });
    }).catch(() => setError(true));

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [document, page, viewportWidth, zoom]);

  const pageCount = document?.numPages ?? 0;
  const previousLabel = turkish ? 'Önceki sayfa' : 'Previous page';
  const nextLabel = turkish ? 'Sonraki sayfa' : 'Next page';
  return <div className="pdf-reader">
    <header className="pdf-reader-toolbar">
      <div className="pdf-reader-identity"><small>{sourceLabel}</small><strong>{title}</strong></div>
      <div className="pdf-reader-controls" aria-label={turkish ? 'PDF okuma araçları' : 'PDF reader controls'}>
        <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label={previousLabel} title={previousLabel}>←</button>
        <label><span className="sr-only">{turkish ? 'Sayfa' : 'Page'}</span><input type="number" min="1" max={pageCount || undefined} value={page} onChange={(event) => setPage(Math.min(pageCount || 1, Math.max(1, Number(event.target.value) || 1)))} /> <span>/ {pageCount || '—'}</span></label>
        <button type="button" disabled={!pageCount || page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label={nextLabel} title={nextLabel}>→</button>
        <span className="pdf-reader-divider" aria-hidden="true" />
        <button type="button" disabled={zoom <= .65} onClick={() => setZoom((value) => Math.max(.65, value - .15))} aria-label={turkish ? 'Uzaklaştır' : 'Zoom out'} title={turkish ? 'Uzaklaştır' : 'Zoom out'}>−</button>
        <output>{Math.round(zoom * 100)}%</output>
        <button type="button" disabled={zoom >= 2} onClick={() => setZoom((value) => Math.min(2, value + .15))} aria-label={turkish ? 'Yakınlaştır' : 'Zoom in'} title={turkish ? 'Yakınlaştır' : 'Zoom in'}>+</button>
        <button type="button" onClick={() => setZoom(1)} aria-label={turkish ? 'Genişliğe sığdır' : 'Fit to width'} title={turkish ? 'Genişliğe sığdır' : 'Fit to width'}>↔</button>
      </div>
      <a href={originalSource} target="_blank" rel="noreferrer">{turkish ? 'Asıl PDF' : 'Original PDF'} ↗</a>
    </header>
    <div className="pdf-reader-viewport" ref={viewportRef}>
      {loading ? <div className="pdf-reader-state">{turkish ? 'Kaynak hazırlanıyor…' : 'Preparing source…'}</div> : null}
      {error ? <div className="pdf-reader-state"><strong>{turkish ? 'Bu sayfa görüntülenemedi.' : 'This page could not be displayed.'}</strong><a href={originalSource} target="_blank" rel="noreferrer">{turkish ? 'Asıl PDF’yi aç' : 'Open original PDF'} ↗</a></div> : null}
      <canvas ref={canvasRef} aria-label={`${title}, ${turkish ? 'sayfa' : 'page'} ${page}`} />
    </div>
  </div>;
}
