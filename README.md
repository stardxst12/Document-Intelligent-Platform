# Document Intelligence Platform

A small full-stack app for **uploading documents**, **keeping a library**, and **asking questions** with **retrieval-augmented generation (RAG)**. The UI (“Lumina Docs”) is a React app; the API is Django REST Framework with a MySQL database. Answers are grounded in the text of a selected PDF using embeddings and a local or OpenAI-compatible chat model.

localhost_3000_.png

## Features

- **Upload** — Send PDFs (and other files) via the web UI or `POST /documents/` as `multipart/form-data` with a `file` field (optional `title`).
- **Library** — List stored documents, open files, and pick one for Q&A.
- **Ask (RAG)** — `POST /documents/rag/` with `document_id`, `question`, and optional `top_k` to retrieve similar chunks and generate an answer.
- **Chunks API** — `GET /documents/<id>/chunks/` for stored chunk metadata (when populated).

RAG uses **LangChain**, **FAISS**, **Hugging Face** embeddings (`sentence-transformers/all-MiniLM-L6-v2`), and **`PyPDFLoader`** for PDFs. The chat model is configured in `backend/documents/rag.py` (e.g. LM Studio or another OpenAI-compatible server).

## Project layout

| Path | Role |
|------|------|
| `backend/` | Django project (`manage.py`, `backend/settings.py`, apps) |
| `backend/documents/` | Models, views, URLs, RAG pipeline |
| `frontend/` | Create React App UI and `src/setupProxy.js` for dev API proxy |
| `indexing.ipynb` | Optional notebook experiments |

## Prerequisites

- **Python 3.10+** (version you use for Django)
- **Node.js** and **npm** (for the frontend)
- **MySQL** with a database the app can use
- **LM Studio** (or similar) running if you use the default RAG chat endpoint in `rag.py`

## Basic setup

### 1. Database

Create a MySQL database (e.g. named `documents`). In `backend/backend/settings.py`, set `DATABASES` `NAME`, `USER`, `PASSWORD`, `HOST`, and `PORT` to match your server.

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install django djangorestframework mysqlclient PyPDF2
pip install langchain langchain-community langchain-text-splitters
pip install faiss-cpu sentence-transformers
```

Apply migrations and run the server:

```bash
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

API base (local): `http://127.0.0.1:8000`

- `GET/POST` `http://127.0.0.1:8000/documents/`
- `POST` `http://127.0.0.1:8000/documents/rag/`

### 3. RAG model (optional but needed for answers)

Edit `backend/documents/rag.py` and point `ChatOpenAI` `base_url` and `model` to your local server (e.g. LM Studio). Without a running model, uploads and listing still work; **Ask** may error until the LLM is reachable.

### 4. Frontend

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`. In development, `src/setupProxy.js` forwards `/documents` and `/media` to `http://127.0.0.1:8000`. Start Django **before** or **with** the UI so uploads and the library load.

For production builds, set `REACT_APP_API_URL` to your API origin (no trailing slash) if the UI and API are on different hosts, and configure CORS on Django as needed.

## Quick Postman check

1. `POST` `http://127.0.0.1:8000/documents/`
2. Body: **form-data** — key `file` (type **File**), optional key `title` (text).
3. Use a **trailing slash** on the URL.

## License

Add a license if you distribute this project.
