'use client';

import { useEffect, useId, useState } from 'react';

interface SourceDrawerProps {
  label?: string;
  title: string;
  description: string;
  pdfUrl?: string;
  page?: number;
  sourceUrl: string;
  sourceLabel: string;
}

export function SourceDrawer({
  label = 'Source',
  title,
  description,
  pdfUrl,
  page,
  sourceUrl,
  sourceLabel,
}: SourceDrawerProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const pdfTarget = pdfUrl && page ? `${pdfUrl}#page=${page}&view=FitH` : undefined;

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <>
      <button className="source-trigger" type="button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">↗</span>{label}
      </button>
      {open ? (
        <div className="source-layer">
          <button className="source-backdrop" type="button" aria-label="Close source panel" onClick={() => setOpen(false)} />
          <aside className="source-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <header className="source-drawer-header">
              <div><span>Primary source</span><h2 id={titleId}>{title}</h2></div>
              <button type="button" aria-label="Close source panel" onClick={() => setOpen(false)}>×</button>
            </header>
            <p className="source-drawer-description">{description}</p>
            {pdfTarget ? (
              <div className="source-pdf-frame">
                <iframe src={pdfTarget} title={`${title}, page ${page}`} />
              </div>
            ) : (
              <div className="source-unavailable">
                <strong>Exact PDF alignment is not yet verified for this record.</strong>
                <p>WikiTefsir does not guess edition or page numbers. The verified digital source remains available below.</p>
              </div>
            )}
            <footer className="source-drawer-footer">
              {pdfTarget ? <span>Verified PDF page {page}</span> : <span>Verified digital record</span>}
              <a href={pdfTarget ?? sourceUrl} target="_blank" rel="noreferrer">Open {pdfTarget ? 'PDF' : sourceLabel} in a new tab ↗</a>
            </footer>
          </aside>
        </div>
      ) : null}
    </>
  );
}
