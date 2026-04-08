import React, { useState } from 'react';
import './AskIntelligencePanel.css';

/**
 * Question input and answer display for RAG; requires a selected document id.
 */
export function AskIntelligencePanel({
  selectedDocument,
  onAsk,
  loading,
  lastAnswer,
  lastSources,
  error,
}) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || !selectedDocument) return;
    onAsk(q);
  };

  const pdfReady =
    selectedDocument && (selectedDocument.file_type || '').toLowerCase() === 'pdf';

  return (
    <section className="panel ask-panel" id="ask" aria-labelledby="ask-heading">
      <div className="panel__header">
        <span className="panel__icon" aria-hidden="true">✦</span>
        <div>
          <h2 id="ask-heading" className="panel__title">
            Ask your document
          </h2>
          <p className="panel__desc">
            Natural-language questions use retrieval from the selected file, then a local model composes an answer.
          </p>
        </div>
      </div>

      {selectedDocument && !pdfReady && (
        <p className="ask-panel__notice" role="status">
          RAG is tuned for PDFs right now. You can still chat once the pipeline supports this format.
        </p>
      )}

      <form className="ask-panel__form" onSubmit={handleSubmit}>
        <label className="ask-panel__label" htmlFor="question-field">
          Your question
        </label>
        <textarea
          id="question-field"
          className="ask-panel__textarea"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Summarize the key risks mentioned in section 2."
          disabled={loading || !selectedDocument}
        />
        <div className="ask-panel__actions">
          <button
            type="submit"
            className="ask-panel__submit"
            disabled={loading || !selectedDocument || !question.trim()}
          >
            {loading ? 'Thinking…' : 'Get answer'}
          </button>
          {!selectedDocument && (
            <span className="ask-panel__hint">Select a document from the library first.</span>
          )}
        </div>
      </form>

      {error && (
        <div className="ask-panel__error" role="alert">
          {error}
        </div>
      )}

      {lastAnswer && (
        <div className="ask-panel__result">
          <h3 className="ask-panel__result-title">Answer</h3>
          <p className="ask-panel__answer">{lastAnswer}</p>
          {lastSources && lastSources.length > 0 && (
            <div className="ask-panel__sources">
              <span className="ask-panel__sources-label">Sources</span>
              <ul>
                {lastSources.map((s, i) => (
                  <li key={`${s}-${i}`}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
