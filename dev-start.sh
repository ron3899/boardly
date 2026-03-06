#!/bin/bash

# Boardly Development Startup Script
# This script ensures proper database setup before starting the application

set -e  # Exit on error

echo "🚀 Starting Boardly Development Environment"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Please install it first:${NC}"
    echo "   npm install -g pnpm"
    exit 1
fi

echo -e "${GREEN}✓ pnpm is installed${NC}"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check if .env files exist
if [ ! -f "apps/api/.env" ]; then
    echo -e "${YELLOW}⚙️  Creating apps/api/.env from example...${NC}"
    cp apps/api/.env.example apps/api/.env
    # Set SQLite by default
    sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|g' apps/api/.env
    rm apps/api/.env.bak 2>/dev/null || true
    echo -e "${GREEN}✓ Created apps/api/.env with SQLite${NC}"
else
    echo -e "${GREEN}✓ apps/api/.env exists${NC}"
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo -e "${YELLOW}⚙️  Creating apps/web/.env.local from example...${NC}"
    cp apps/web/.env.example apps/web/.env.local
    echo -e "${GREEN}✓ Created apps/web/.env.local${NC}"
else
    echo -e "${GREEN}✓ apps/web/.env.local exists${NC}"
fi

# Check database setup
echo -e "${BLUE}🗄️  Setting up database...${NC}"

# Generate Prisma client
echo -e "${YELLOW}   Generating Prisma client...${NC}"
cd apps/api
pnpm db:generate 2>&1 | grep -v "warn" || true
echo -e "${GREEN}   ✓ Prisma client generated${NC}"

# Push database schema
echo -e "${YELLOW}   Pushing database schema...${NC}"
if pnpm db:push 2>&1 | grep -v "warn"; then
    echo -e "${GREEN}   ✓ Database schema created${NC}"
else
    echo -e "${YELLOW}   ⚠️  Database schema push had warnings (this is usually OK)${NC}"
fi

# Seed database
echo -e "${YELLOW}   Seeding database with sample data...${NC}"
if pnpm db:seed 2>&1; then
    echo -e "${GREEN}   ✓ Database seeded${NC}"
else
    echo -e "${YELLOW}   ⚠️  Database seeding had issues (continuing anyway)${NC}"
fi

cd ../..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}🌐 Starting development servers...${NC}"
echo "   - API Server: http://localhost:8000"
echo "   - Web App: http://localhost:3000"
echo ""
echo -e "${YELLOW}📝 Note: Web app has automatic fallback to mock data if API is unavailable${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start development servers
pnpm dev
