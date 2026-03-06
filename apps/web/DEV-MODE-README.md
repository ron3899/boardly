# Development Mode Setup

This application now includes a development mode that allows you to run the app without connecting to external APIs or databases.

## Features

- **Mock Data**: Pre-populated with sample boards, groups, items, and columns
- **In-Memory Storage**: All changes persist during your session
- **No Backend Required**: Run just the frontend without the API server
- **Realistic Behavior**: Simulates network delays and API responses

## Getting Started

### Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

4. Click "Auto Login (Dev)" button or use these credentials:
   - Email: `demo@example.com`
   - Password: (any password works in dev mode)

### Configuration

The development mode is controlled by the `.env.local` file in `apps/web/`:

```env
# Set to 'true' to use mock data only
NEXT_PUBLIC_USE_MOCK_API=false

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# API timeout (in milliseconds)
NEXT_PUBLIC_API_TIMEOUT=10000

# Fallback to mock data if API is unavailable
NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true
```

**Configuration Options:**

- `NEXT_PUBLIC_USE_MOCK_API=true`: Forces mock data mode (no API calls)
- `NEXT_PUBLIC_USE_MOCK_API=false` + `NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true`: Tries API first, falls back to mock on failure (recommended for development)
- `NEXT_PUBLIC_USE_MOCK_API=false` + `NEXT_PUBLIC_API_FALLBACK_TO_MOCK=false`: Production mode (API required)

### Switching to Production Mode

To test with a real backend:

1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_FALLBACK_TO_MOCK=false
   ```

2. Start your backend API server on port 8000

3. Restart the Next.js development server

## Mock Data Overview

The development environment comes with:

- **1 Demo User**: demo@example.com
- **3 Sample Boards**:
  - Product Development (with full data)
  - Marketing Campaign (empty)
  - Team Onboarding (empty)

- **Product Development Board** includes:
  - 3 Groups: Sprint Planning, Development, Testing
  - 8 Items with various statuses
  - 5 Columns: Status, Owner, Due Date, Priority, Progress
  - Sample column values demonstrating all column types

## Available Operations

All CRUD operations work in development mode:

- ✅ Create, read, update, delete boards
- ✅ Create, read, update, delete groups
- ✅ Create, read, update, delete items
- ✅ Add and remove columns
- ✅ Update column values
- ✅ Drag and drop reordering
- ✅ User authentication (mock)

## File Structure

```
apps/web/src/lib/
├── mock-data.ts          # Mock data and in-memory storage
├── api-client-dev.ts     # Dev-aware API client with routing
└── api-client.ts         # Main API client (re-exports dev version)
```

## Troubleshooting

### App redirects to login repeatedly
- Check that `NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local`
- Restart the dev server after changing environment variables

### Changes don't persist
- This is expected! Mock data resets when you refresh the page
- Changes persist during your session only

### Want to reset mock data?
- Refresh the page or restart the dev server

## Next Steps

Once you're satisfied with the frontend experience:

1. Set up the backend API and database
2. Update `.env.local` to use the real API
3. Test the integration
4. Deploy to production

## Notes

- Mock data includes realistic delays (300-500ms) to simulate network requests
- Authentication is simplified in dev mode - any credentials will work
- The middleware is disabled in dev mode to allow easier navigation
