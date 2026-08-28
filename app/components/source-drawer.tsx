'use client';

import { useEffect, useId, useRef, useState } from 'react';

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
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pdfTarget = pdfUrl && page ? `${pdfUrl}#page=${page}&view=FitH` : undefined;

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button ref={triggerRef} className="source-trigger" type="button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">↗</span>{label}
      </button>
      {open ? (
        <div className="source-layer">
          <button className="source-backdrop" type="button" aria-label="Close source panel" onClick={() => setOpen(false)} />
          <aside className={`source-drawer${expanded ? ' expanded' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <header className="source-drawer-header">
              <div><span>Primary source</span><h2 id={titleId}>{title}</h2><p>{description}</p></div>
              <div className="source-drawer-actions">
                <button type="button" aria-label={expanded ? 'Restore source panel width' : 'Expand source panel'} title={expanded ? 'Restore width' : 'Expand panel'} aria-pressed={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? '↘' : '↔'}</button>
                <button ref={closeRef} type="button" aria-label="Close source panel" title="Close" onClick={() => setOpen(false)}>×</button>
              </div>
            </header>
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
