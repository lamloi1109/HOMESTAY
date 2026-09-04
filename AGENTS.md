# Repository Guidelines

## Project Structure & Module Organization

This repository is split into a FastAPI backend and a Next.js frontend. Backend code lives in `backend/app/`: API routes are under `api/`, database entities under `models/`, request/response types under `schemas/`, and business logic under `services/`. Alembic migrations are in `backend/migrations/`, with pytest coverage in `backend/tests/`. The frontend uses the App Router: routes live in `frontend/src/app/`, reusable UI in `frontend/src/components/`, shared helpers in `frontend/src/lib/`, and design tokens in `frontend/src/styles/gaoji/`. Static assets belong in `frontend/public/`; planning and reference material belongs in `docs/`. Treat `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` as the current scope source of truth.

## Build, Test, and Development Commands

- `docker compose up -d db` starts PostgreSQL 16, including the test database.
- `cd backend; python -m venv .venv; .venv/Scripts/pip install -r requirements-dev.txt` prepares the Python environment on Windows.
- `cd backend; .venv/Scripts/python -m alembic upgrade head` applies migrations.
- `cd backend; .venv/Scripts/python -m uvicorn app.main:app --reload` serves the API at `http://127.0.0.1:8000`.
- `cd frontend; npm ci; npm run dev` serves the UI at `http://localhost:3000`.
- Run `npm run lint && npm run build` in `frontend`, and `ruff check . && pytest -q` in `backend`, before opening a PR.

## Coding Style & Naming Conventions

Python uses four-space indentation, type hints, a 100-character line limit, and Ruff rules configured in `backend/ruff.toml`. Use `snake_case` for modules/functions and `PascalCase` for models. TypeScript uses two-space indentation, ESLint, `PascalCase.tsx` component files, camelCase helpers, and Next.js route names. Reuse Gaoji design tokens and components instead of duplicating CSS. Do not swallow exceptions or introduce placeholder data as completed behavior.

## Testing Guidelines

Backend tests use pytest and pytest-asyncio against PostgreSQL—not SQLite—because booking race tests require real locking semantics. Name tests `test_<behavior>.py` and add regression coverage beside related suites. No frontend test runner is configured; lint and production build are the required frontend checks.

## Commit & Pull Request Guidelines

Enable hooks once with `git config core.hooksPath .githooks`. Follow history’s format: `[phase-N][type]: concise description (T-XXX)`; reserve `chore(coord): ...` for coordination files. Keep commits focused. PRs should describe behavior and verification, reference the task/issue, include screenshots for UI changes, and never be self-merged. Before coordinated work, read `.coordination/AGENT_ONBOARDING.md`, `BRIEF.md`, `TASKS.md`, and recent `DECISIONS.md` entries.
