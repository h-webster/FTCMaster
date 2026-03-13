# FTCMaster

FTCMaster is a full‑stack scouting and analytics platform for FIRST Tech Challenge (FTC). It combines a React/Vite frontend, an Express/MongoDB backend, and serverless data‑ingestion jobs that pull official FTC event data. It also includes AI‑assisted scouting reports.

## Features
- Team lookup, event listings, and team detail pages
- Event rankings, matches, and scoring data
- OPR (offensive power rating) storage and querying
- AI scouting reports generated from team performance data
- Scheduled ingestion of FTC event data into MongoDB

## Architecture
- Frontend: React + Vite SPA (client UI)
- Backend: Express API with MongoDB (data cache and app API)
- Serverless jobs: Vercel functions for data extraction and batching
- AI analysis: OpenAI‑powered scouting summaries stored in MongoDB
- ML backend: separate Python service (see below)

## Repository Structure
- `src/` React app (routes, components, contexts, UI logic)
- `backend/` Express API, MongoDB schemas, and middleware
- `api/` Vercel serverless functions (event/OPR ingestion)
- `public/` static assets
- `dist/` frontend build output (if present)

## Related ML Backend (Python)
The ML backend for match predictions lives in a separate repo:
- [FTCMaster-ML](https://github.com/h-webster/FTCMaster-ML)

## Local Development

### 1) Frontend
Install and run the Vite dev server:
```bash
npm install
npm run dev
```
Default dev server: `http://localhost:5173`

### 2) Backend API
From `backend/`:
```bash
npm install
npm run dev
```
Default API server: `http://localhost:5000`

### 3) Environment Variables
Create `.env` files for both root and `backend/` as needed:
- `FTC_USERNAME` / `FTC_TOKEN` for FTC API Basic Auth
- `MONGODB_URI` for MongoDB connection
- `OPENAI_API_KEY` for AI scouting endpoint
- `NODE_ENV` / `PORT` as desired

## API Overview (Backend)
Routes are registered under `/api` in `backend/api/server.js`:
- FTC API proxy and fetchers: `backend/api/routes/ftceventsRoutes.js`
- Events cache: `backend/api/routes/eventRoutes.js`
- Teams cache: `backend/api/routes/teamRoutes.js`
- OPR storage: `backend/api/routes/OPRRoutes.js`
- AI analysis and caching: `backend/api/routes/openApiRoutes.js`

## Data Ingestion
Serverless functions in `api/` pull event and match data, then batch‑upsert into MongoDB via the backend API. This is used for scheduled updates and fast client queries.

## Build
```bash
npm run build
npm run preview
```

## Notes
- The backend applies CORS restrictions for production domains and local dev.
- The FTC API calls require valid credentials from FIRST.
- This was obviously ai generated readme (this is me writing)
