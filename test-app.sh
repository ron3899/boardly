#!/bin/bash

# Test if server is running
echo "Testing server..."
curl -s http://localhost:3000 > /dev/null && echo "✓ Homepage loads" || echo "✗ Homepage failed"

# Test login page
curl -s http://localhost:3000/login > /dev/null && echo "✓ Login page loads" || echo "✗ Login page failed"

# Test register page
curl -s http://localhost:3000/register > /dev/null && echo "✓ Register page loads" || echo "✗ Register page failed"

# Check if there are any build errors
cd apps/web && pnpm run lint 2>&1 | tail -5
