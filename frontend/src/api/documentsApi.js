/**
 * API client for Django backend.
 * Dev: rely on package.json "proxy" to http://127.0.0.1:8000 (relative paths).
 * Prod / custom host: set REACT_APP_API_URL e.g. http://localhost:8000 (no trailing slash).
 */
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

function normalizeFileUrl(filePath) {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  if (filePath.startsWith('/') && API_BASE) return `${API_BASE}${filePath}`;
  return filePath;
}

const DOCUMENTS_LIST = '/documents/';
const RAG = '/documents/rag/';

export function getApiBase() {
  return API_BASE;
}

export async function fetchDocuments() {
  const res = await fetch(apiUrl(DOCUMENTS_LIST));
  if (!res.ok) throw new Error('Could not load documents. Is the backend running on port 8000?');
  const data = await res.json();
  return data.map((d) => ({
    ...d,
    file: normalizeFileUrl(d.file),
  }));
}

export async function uploadDocument(file, title) {
  const body = new FormData();
  body.append('file', file);
  if (title) body.append('title', title);
  const res = await fetch(apiUrl(DOCUMENTS_LIST), {
    method: 'POST',
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.detail || data.error || JSON.stringify(data) || res.statusText;
    throw new Error(typeof msg === 'string' ? msg : 'Upload failed.');
  }
  return { ...data, file: normalizeFileUrl(data.file) };
}

export async function askDocument(documentId, question, topK = 4) {
  const res = await fetch(apiUrl(RAG), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document_id: documentId,
      question,
      top_k: topK,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.detail || 'Could not get an answer.');
  }
  return data;
}
