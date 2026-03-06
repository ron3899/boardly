#!/bin/bash

# Boardly Web-Only Development Mode
# Run the web app without the API server (uses mock data)

set -e

echo "🌐 Starting Boardly in Web-Only Mode (Mock Data)"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Please install it first:${NC}"
    echo "   npm install -g pnpm"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Create .env.local with mock mode enabled
echo -e "${YELLOW}⚙️  Configuring web app for standalone mode...${NC}"
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_API_TIMEOUT=5000
NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true
EOF

echo -e "${GREEN}✓ Configuration complete${NC}"
echo ""
echo -e "${BLUE}🚀 Starting web app on http://localhost:3000${NC}"
echo -e "${YELLOW}📝 Note: Using mock data only - changes won't persist${NC}"
echo ""

# Start only the web app
cd apps/web
pnpm dev
