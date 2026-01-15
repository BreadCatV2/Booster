# Booster - AI Agent Instructions

This document provides guidance for AI agents (like Google Jules) working on the Booster codebase.

## Project Overview

Booster is a Next.js 16 video platform application built with:
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL 16 with pgvector extension (for embeddings)
- **ORM**: Drizzle ORM
- **API**: tRPC for type-safe APIs
- **Auth**: Clerk (mocked in local dev)
- **Styling**: Tailwind CSS + Radix UI components
- **Package Manager**: Bun (preferred) or npm

## Quick Setup

```bash
# Run the setup script
chmod +x jules-setup.sh && ./jules-setup.sh

# Start development server
bun run dev
```

## Environment Setup

The project supports a **fully local development mode** that mocks external services:

1. Set `USE_LOCAL_DEV=true` in `.env.local`
2. Database runs as local PostgreSQL (not Docker)
3. External services (Clerk, Bunny, Upstash) are mocked automatically

### Database Connection

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/booster
```

PostgreSQL 16 with pgvector must be installed:
```bash
sudo apt-get install postgresql-16 postgresql-16-pgvector
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── db/           # Drizzle schema and database connection
├── lib/          # Utilities and external service clients
│   └── mocks/    # Mock implementations for local dev
├── modules/      # Feature modules (auth, videos, users, etc.)
├── trpc/         # tRPC router definitions
└── scripts/      # Database setup and seed scripts
```

## Key Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bunx drizzle-kit push` | Push schema to database |
| `bunx drizzle-kit generate` | Generate migrations |
| `bun run src/scripts/setup-local-db.ts` | Seed local dev user |

## Testing

When running tests or validating the setup:

1. Ensure PostgreSQL is running: `pg_isready`
2. Database exists: `psql -U postgres -c '\l' | grep booster`
3. Schema is pushed: `bunx drizzle-kit push`
4. Run lint: `bun run lint`

## Local Development Mode

When `USE_LOCAL_DEV=true`:
- A mock user is automatically available (username: `devuser`)
- Authentication is bypassed
- Video uploads are mocked
- Rate limiting is disabled
- External API calls are intercepted

## Common Issues

### PostgreSQL connection fails
```bash
sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

### pgvector extension missing
```bash
sudo apt-get install postgresql-16-pgvector
sudo -u postgres psql -d booster -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Module resolution errors
```bash
rm -rf node_modules bun.lockb
bun install
```

## Architecture Notes

- **tRPC Routers** are in `src/trpc/routers/` - each module has its own router
- **Database Schema** is defined in `src/db/schema.ts` using Drizzle
- **Modules** follow a pattern: `modules/{feature}/` contains UI, hooks, and procedures
- **Mock Services** in `src/lib/mocks/` intercept external service calls in local dev
