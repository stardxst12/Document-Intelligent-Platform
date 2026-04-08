import React from 'react';
import './DocumentLibrary.css';

function formatBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

/**
 * Scrollable catalog of uploaded documents with selection for the Ask panel.
 */
export function DocumentLibrary({
  documents,
  selectedId,
  onSelect,
  loading,
  error,
  onRefresh,
}) {
  return (
    <section className="panel library-panel" id="library" aria-labelledby="library-heading">
      <div className="panel__header">
        <span className="panel__icon" aria-hidden="true">◇</span>
        <div className="library-panel__heading-row">
          <div>
            <h2 id="library-heading" className="panel__title">
              Your library
            </h2>
            <p className="panel__desc">
              Select a document to ask questions. PDFs work best with the current RAG pipeline.
            </p>
          </div>
          <button type="button" className="library-panel__refresh" onClick={onRefresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>
      {error && (
        <p className="library-panel__alert" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="library-panel__status">Loading documents…</p>}
      {!loading && documents.length === 0 && !error && (
        <p className="library-panel__empty">No documents yet—upload one to get started.</p>
      )}
      <ul className="library-panel__list">
        {documents.map((doc) => {
          const active = doc.id === selectedId;
          const isPdf = (doc.file_type || '').toLowerCase() === 'pdf';
          return (
            <li key={doc.id}>
              <button
                type="button"
                className={`library-panel__card ${active ? 'library-panel__card--active' : ''}`}
                onClick={() => onSelect(doc.id)}
                aria-pressed={active}
              >
                <div className="library-panel__card-main">
                  <span className="library-panel__doc-title">{doc.title || 'Untitled'}</span>
                  <span className="library-panel__meta">
                    {formatBytes(doc.size)} · {doc.page_count || 0} pages · {formatDate(doc.created_at)}
                  </span>
                </div>
                <div className="library-panel__card-aside">
                  <span className={`library-panel__pill ${isPdf ? 'library-panel__pill--ok' : 'library-panel__pill--warn'}`}>
                    {(doc.file_type || 'file').toUpperCase()}
                  </span>
                  {doc.file && (
                    <a
                      className="library-panel__download"
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
