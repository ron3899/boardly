# Mock Authentication Setup

This document explains how to configure the mock authentication system for preview/sandbox environments.

## Problem Solved

The login endpoint was returning 401 errors in preview sandboxes because Prisma attempted to connect to a non-existent PostgreSQL database. This fix enables the API to work without a database when in mock mode.

## Configuration

### For API (apps/api/.env)

Create or update `apps/api/.env` with:

```env
MOCK_AUTH=true
JWT_SECRET=local-dev-secret-boardly-123
PORT=4001
NODE_ENV=development
DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/boardly
CORS_ORIGIN=http://localhost:3000
```

### For Web (apps/web/.env.local)

Create or update `apps/web/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

## How It Works

### When MOCK_AUTH=true (sandbox/preview mode):

1. **auth.service.ts**: All authentication methods check for `MOCK_AUTH` and return mock user data
2. **prisma.ts**: Prisma client is replaced with a no-op proxy that never attempts database connection
3. **Login**: Any email/password combo succeeds and returns mock user
4. **Register**: Always succeeds and returns new mock user
5. **getUser**: Returns mock user for any user ID

### When MOCK_AUTH=false (production mode):

- Full Prisma database authentication works as before
- All database queries execute normally
- Real password hashing and verification
- Production behavior unchanged

## Mock User Data

```typescript
const MOCK_USER = {
  id: 'mock-user-1',
  email: 'demo@boardly.com',
  name: 'Demo User',
  createdAt: new Date(),
};
```

## Files Changed

- `apps/api/src/modules/auth/auth.service.ts` - Added mock auth logic
- `apps/api/src/plugins/prisma.ts` - Added proxy wrapper for mock mode
- `owla-preview.html` - Interactive demo of mock authentication

## Testing

1. Set `MOCK_AUTH=true` in `apps/api/.env`
2. Start the API server
3. Open `owla-preview.html` in a browser
4. Try the login/register forms - they will succeed instantly
5. Or use the actual frontend with any credentials - all logins succeed

## Production Deployment

**IMPORTANT**: Never set `MOCK_AUTH=true` in production!

In production environments:
- Remove the `MOCK_AUTH` variable entirely, or
- Set `MOCK_AUTH=false` explicitly

This ensures the real authentication system is used.
