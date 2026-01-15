#!/bin/bash
# ============================================================================
# Booster - Google Jules Setup Script
# ============================================================================
# This script sets up a fully local development environment for the Booster
# project on Google Jules VM. It installs PostgreSQL with pgvector directly
# (no Docker) and configures all necessary dependencies.
# ============================================================================

set -e  # Exit on any error

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           Booster - Jules Environment Setup Script               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# 1. Ensure we're on the dev-local branch
# ============================================================================
echo "🌿 Checking branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev-local" ]; then
    echo "   Switching from '$CURRENT_BRANCH' to 'dev-local'..."
    git fetch origin dev-local 2>/dev/null || true
    git checkout dev-local 2>/dev/null || git checkout -b dev-local origin/dev-local
fi
echo "✅ On branch: $(git branch --show-current)"
echo ""

# ============================================================================
# 2. Display Environment Info
# ============================================================================
echo "📋 Environment Information:"
echo "   Node.js: $(node -v)"
echo "   npm: $(npm -v)"
echo "   Bun: $(bun -v 2>/dev/null || echo 'not installed')"
echo ""

# ============================================================================
# 2. Install Bun (if not available)
# ============================================================================
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    echo "✅ Bun installed: $(bun -v)"
else
    echo "✅ Bun already installed: $(bun -v)"
fi
echo ""

# ============================================================================
# 3. Install PostgreSQL 16 with pgvector extension (Direct Installation)
# ============================================================================
echo "🐘 Setting up PostgreSQL 16 with pgvector..."

# Check if PostgreSQL is already running
if pg_isready -q 2>/dev/null; then
    echo "✅ PostgreSQL is already running"
else
    # Install PostgreSQL 16
    echo "   Installing PostgreSQL 16..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq postgresql-16 postgresql-contrib-16 postgresql-16-pgvector
    
    # Start PostgreSQL service
    echo "   Starting PostgreSQL service..."
    sudo service postgresql start
    
    # Wait for PostgreSQL to be ready
    echo "   Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
        if pg_isready -q 2>/dev/null; then
            break
        fi
        sleep 1
    done
    
    if ! pg_isready -q 2>/dev/null; then
        echo "❌ PostgreSQL failed to start"
        exit 1
    fi
    
    # Create database and enable pgvector
    echo "   Creating booster database and enabling pgvector..."
    sudo -u postgres psql -c "CREATE DATABASE booster;" 2>/dev/null || echo "   Database 'booster' already exists"
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" 2>/dev/null
    sudo -u postgres psql -d booster -c "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null
    
    echo "✅ PostgreSQL 16 with pgvector is ready"
fi
echo ""

# ============================================================================
# 4. Create Environment File for Local Development
# ============================================================================
echo "📝 Creating .env.local for local development..."

if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# ============================================================================
# Local Development Environment Configuration
# ============================================================================
# This configuration is optimized for Jules VM local development.
# External services are mocked for offline development.
# ============================================================================

# Enable local development mode (uses mocks for external services)
USE_LOCAL_DEV=true

# Local PostgreSQL Database (Direct installation, no Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/booster

# Supabase (Mocked in local dev mode)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=local-dev-key

# Clerk (Mocked in local dev mode)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_local_dev
CLERK_SECRET_KEY=sk_test_local_dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
CLERK_SIGNING_SECRET=whsec_local_dev

# Stripe (Optional - only needed for payment features)
STRIPE_SECRET_KEY=sk_test_local_dev

# Bunny Stream (Mocked in local dev mode)
BUNNY_STREAM_API_KEY=local-dev-bunny-key

# Redis/Upstash (Mocked in local dev mode)
UPSTASH_REDIS_REST_URL=http://localhost:6379
UPSTASH_REDIS_REST_TOKEN=local-dev-token

# UploadThing (Mocked in local dev mode)
UPLOADTHING_TOKEN=local-dev-uploadthing

# OpenAI (Optional - only needed for AI features)
OPENAI_API_KEY=

# Development Settings
NODE_ENV=development
EOF
    echo "✅ Created .env.local with local development configuration"
else
    echo "⚠️  .env.local already exists, skipping creation"
fi
echo ""

# ============================================================================
# 5. Install Node.js Dependencies
# ============================================================================
echo "📦 Installing Node.js dependencies..."
bun install --frozen-lockfile 2>/dev/null || bun install
echo "✅ Dependencies installed"
echo ""

# ============================================================================
# 6. Setup Database Schema
# ============================================================================
echo "🗃️  Pushing database schema..."
bunx drizzle-kit push 2>/dev/null || npx drizzle-kit push
echo "✅ Database schema pushed"
echo ""

# ============================================================================
# 7. Seed Local Development Data
# ============================================================================
echo "🌱 Seeding local development data..."
bun run src/scripts/setup-local-db.ts 2>/dev/null || true
echo "✅ Local development data seeded"
echo ""

# ============================================================================
# 8. Run Linting/Type Check
# ============================================================================
echo "🔍 Running lint check..."
bun run lint 2>/dev/null || npm run lint || echo "⚠️  Lint check had warnings"
echo ""

# ============================================================================
# 9. Verify Setup
# ============================================================================
echo "✅ Verifying setup..."
echo "   Database connection: $(pg_isready && echo 'OK' || echo 'FAILED')"
echo "   Node modules: $([ -d 'node_modules' ] && echo 'OK' || echo 'MISSING')"
echo "   Environment file: $([ -f '.env.local' ] && echo 'OK' || echo 'MISSING')"
echo ""

# ============================================================================
# Done!
# ============================================================================
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Setup Complete!                            ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  To start the development server:                                ║"
echo "║    bun run dev                                                   ║"
echo "║                                                                  ║"
echo "║  The app will be available at:                                   ║"
echo "║    http://localhost:3000                                         ║"
echo "║                                                                  ║"
echo "║  Local dev mode uses mocked services for:                        ║"
echo "║    - Authentication (Clerk)                                      ║"
echo "║    - Video streaming (Bunny/Mux)                                 ║"
echo "║    - Rate limiting (Upstash)                                     ║"
echo "║    - File uploads (UploadThing)                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
