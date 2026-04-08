/**
 * API client for Django backend.
 * Dev: src/setupProxy.js forwards /documents and /media to http://127.0.0.1:8000.
 *      Override target with REACT_APP_PROXY_TARGET if needed.
 * Prod: set REACT_APP_API_URL (full origin, no trailing slash), or serve app from same host as API.
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
  const res = await fetch(apiUrl(DOCUMENTS_LIST), { credentials: 'omit' });
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
    credentials: 'omit',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const base = data.detail || data.error || res.statusText;
    const hint = data.hint ? ` ${data.hint}` : '';
    const msg = (typeof base === 'string' ? `${base}${hint}` : `${JSON.stringify(data)}${hint}`).trim();
    throw new Error(msg || 'Upload failed.');
  }
  return { ...data, file: normalizeFileUrl(data.file) };
}

export async function askDocument(documentId, question, topK = 4) {
  const res = await fetch(apiUrl(RAG), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
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
