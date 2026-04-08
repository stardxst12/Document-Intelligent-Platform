import React, { useRef, useState } from 'react';
import './DocumentUploadPanel.css';

/**
 * Drag-friendly uploader with optional title override; calls parent on success.
 */
export function DocumentUploadPanel({ onUploaded, disabled }) {
  const inputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const file = fileList?.[0];
    if (file && onUploaded) onUploaded(file, title.trim() || undefined);
  };

  return (
    <section className="panel upload-panel" id="upload" aria-labelledby="upload-heading">
      <div className="panel__header">
        <span className="panel__icon" aria-hidden="true">↑</span>
        <div>
          <h2 id="upload-heading" className="panel__title">
            Add a document
          </h2>
          <p className="panel__desc">
            Drop a PDF or other supported file. It is stored securely and appears in your library for Q&amp;A.
          </p>
        </div>
      </div>
      <label className="upload-panel__field">
        <span className="upload-panel__label">Display title (optional)</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Q3 compliance review"
          disabled={disabled}
        />
      </label>
      <button
        type="button"
        className={`upload-panel__dropzone ${dragOver ? 'upload-panel__dropzone--active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <span className="upload-panel__dropzone-title">Click or drag a file here</span>
        <span className="upload-panel__dropzone-hint">PDF recommended for Ask / RAG</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="upload-panel__input"
        accept=".pdf,.doc,.docx,application/pdf"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        disabled={disabled}
      />
    </section>
  );
}
