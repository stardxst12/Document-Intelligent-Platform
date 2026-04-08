import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/tokens.css';
import './styles/panel.css';
import './App.css';
import { fetchDocuments, uploadDocument, askDocument } from './api/documentsApi';
import { SiteHeader } from './components/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { DocumentUploadPanel } from './components/DocumentUploadPanel';
import { DocumentLibrary } from './components/DocumentLibrary';
import { AskIntelligencePanel } from './components/AskIntelligencePanel';
import { SiteFooter } from './components/SiteFooter';

function App() {
  const [documents, setDocuments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [banner, setBanner] = useState(null);
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [lastSources, setLastSources] = useState(null);

  const loadDocuments = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (e) {
      setListError(e.message || 'Failed to load library.');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    setSelectedId((prev) => {
      if (prev == null) return null;
      if (documents.some((d) => d.id === prev)) return prev;
      return null;
    });
  }, [documents]);

  const selectedDocument = useMemo(
    () => documents.find((d) => d.id === selectedId) || null,
    [documents, selectedId]
  );

  const handleUploaded = async (file, title) => {
    setBanner(null);
    setUploadBusy(true);
    try {
      const created = await uploadDocument(file, title);
      setBanner({ type: 'ok', text: `“${created.title || file.name}” uploaded.` });
      await loadDocuments();
      if (created.id != null) setSelectedId(created.id);
    } catch (e) {
      setBanner({ type: 'err', text: e.message || 'Upload failed.' });
    } finally {
      setUploadBusy(false);
    }
  };

  const handleAsk = async (question) => {
    if (!selectedId) return;
    setAskError(null);
    setLastAnswer(null);
    setLastSources(null);
    setAskLoading(true);
    try {
      const res = await askDocument(selectedId, question);
      setLastAnswer(res.answer);
      setLastSources(res.sources || []);
    } catch (e) {
      setAskError(e.message || 'Request failed.');
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="app">
      <SiteHeader />
      <main className="app__main">
        <HeroSection />
        <div className="app__stack">
          {banner && (
            <div
              className={`app__banner ${banner.type === 'err' ? 'app__banner--error' : 'app__banner--ok'}`}
              role="status"
            >
              {banner.text}
              <button type="button" className="app__banner-dismiss" onClick={() => setBanner(null)} aria-label="Dismiss">
                ×
              </button>
            </div>
          )}
          <div className="app__section">
            <DocumentUploadPanel onUploaded={handleUploaded} disabled={uploadBusy} />
          </div>
          <div className="app__section">
            <DocumentLibrary
              documents={documents}
              selectedId={selectedId}
              onSelect={setSelectedId}
              loading={listLoading}
              error={listError}
              onRefresh={loadDocuments}
            />
          </div>
          <div className="app__section">
            <AskIntelligencePanel
              selectedDocument={selectedDocument}
              onAsk={handleAsk}
              loading={askLoading}
              lastAnswer={lastAnswer}
              lastSources={lastSources}
              error={askError}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
