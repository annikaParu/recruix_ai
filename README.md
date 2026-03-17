## RankyTech-Style AI Job Platform

Full-stack implementation of a JobRight-style AI job platform inspired by `rankytech.com`, built with:

- **Frontend**: React + TypeScript + Tailwind (Vite)
- **Backend**: FastAPI + LangChain + LangGraph
- **Database**: PostgreSQL with pgvector (via Docker)

### Project structure

- **backend/** — FastAPI app, LangChain/LangGraph stubs, Dockerfile
- **frontend/** — React + TS + Tailwind SPA (Vite)
- **docker-compose.yml** — backend + pgvector Postgres for local dev

### Backend: FastAPI + AI layer

From `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env .env.local  # edit OPENAI_API_KEY if needed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Key endpoints:

- **GET `/api/jobs`** — mock job listings with basic text search
- **POST `/api/resume/upload`** — PDF upload + `pdfplumber` parsing
- **POST `/api/analyze/match`** — LangChain match scoring (resume vs job)
- **POST `/api/analyze/stream`** — LangGraph-style streaming AI coach (SSE)

### Frontend: React + TypeScript + Tailwind

From `frontend/`:

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/api` to `http://localhost:8000`.
You get:

- **Hero / marketing section** themed like RankyTech
- **Resume uploader** with parsed preview
- **Job board** consuming `/api/jobs`
- **AI coach panel** using SSE via `/api/analyze/stream`

### Docker (backend + Postgres with pgvector)

From the repo root:

```bash
docker compose up --build
```

This will start:

- **backend** — FastAPI app on port `8000`
- **db** — PostgreSQL with pgvector on port `5432`

You can then run the frontend separately with `npm run dev` in `frontend/`.

### Next steps / customisation

- Replace mock jobs with a real job API (JSearch, Adzuna) and persist to Postgres.
- Add proper conversation memory and tools to the LangGraph coach agent.
- Style the UI further to exactly match `rankytech.com` brand if desired.

