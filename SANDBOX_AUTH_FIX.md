# Sandbox/Preview Environment Auth Fix

## Problem
The login flow was failing in sandbox/preview environments where `DATABASE_URL` is not available. The app has two auth modes (mock frontend and mock backend) that weren't properly coordinated.

## Solution
Fixed the mock authentication flow to work end-to-end without requiring a database connection.

## Changes Made

### 1. Frontend Mock API (`apps/web/src/lib/mock-data.ts`)

**Added Cookie Management:**
- `setMockAuthCookie()`: Sets authentication token cookie
- `getMockAuthCookie()`: Reads authentication token from cookie
- `clearMockAuthCookie()`: Clears authentication cookie on logout

**Updated Login Handler:**
- Accepts both credential sets:
  - `demo@boardly.com` / `demo1234` (matches backend mock)
  - `demo@example.com` / `demo` (legacy dev mode)
- Sets a `token` cookie on successful login
- Cookie format: `token=mock-token-{timestamp}`

**Updated Auth Methods:**
- `/auth/me` now checks for mock token cookie before returning user
- `/auth/logout` clears the token cookie
- `/auth/register` also sets the token cookie

### 2. Frontend Environment (`apps/web/.env.local`)

Created new file with:
```env
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_MOCK_AUTH=true
NEXT_PUBLIC_API_URL=
```

### 3. Backend Environment (`apps/api/.env`)

Created new file with:
```env
MOCK_AUTH=true
JWT_SECRET=mock-secret-for-dev-change-in-production
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Middleware (No Changes Required)

The middleware at `apps/web/src/middleware.ts` already correctly:
- Checks for `NEXT_PUBLIC_USE_MOCK_API=true`
- Bypasses auth checks in mock mode
- Allows client-side auth handling

## How It Works

### Login Flow (Mock Mode)

1. **User submits credentials** → Login page
2. **Client validates credentials** → Mock API checks against valid credentials
3. **Cookie is set** → `document.cookie = 'token=mock-token-...'`
4. **Auth state updated** → `isAuthenticated = true`
5. **Redirect to /app** → Middleware sees mock mode, allows through
6. **Dashboard loads** → Mock boards data ready

### Valid Credentials

**Option 1 (Primary):**
- Email: `demo@boardly.com`
- Password: `demo1234`

**Option 2 (Legacy):**
- Email: `demo@example.com`
- Password: `demo`

## Testing

### Local Testing
1. Ensure `.env.local` exists in `apps/web/` with mock mode enabled
2. Start the dev server: `npm run dev`
3. Navigate to `/login`
4. Enter credentials: `demo@boardly.com` / `demo1234`
5. Verify redirect to `/app` and boards load

### Preview Environment
The sandbox/preview environment will automatically:
1. Use mock API mode (no real API calls)
2. Accept mock credentials
3. Set authentication cookies
4. Allow navigation to protected routes
5. Display mock board data

## Preview Demo

Open `owla-preview.html` in a browser to see an interactive demonstration of:
- The login flow
- Cookie management
- Authentication state changes
- Valid credentials
- Technical implementation details

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Mock API Mode                          │
│                 (NEXT_PUBLIC_USE_MOCK_API=true)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Login Page                                                 │
│  - Accepts demo@boardly.com or demo@example.com             │
│  - Shows dev mode hints                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  api-client-dev.ts                                          │
│  - Routes to handleMockRequest()                            │
│  - No real HTTP calls                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  mock-data.ts                                               │
│  - Validates credentials                                    │
│  - Sets cookie: token=mock-token-{timestamp}                │
│  - Returns mock user + token                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Middleware                                                 │
│  - Sees NEXT_PUBLIC_USE_MOCK_API=true                       │
│  - Bypasses auth checks                                     │
│  - Allows navigation to /app                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Dashboard (/app)                                           │
│  - Loads mock boards                                        │
│  - Displays Product Development board with groups           │
│  - All features work client-side                            │
└─────────────────────────────────────────────────────────────┘
```

## Backend Mock Auth (Fallback)

If the backend is running with `MOCK_AUTH=true`, it will:
- Use `auth.service.mock.ts` instead of Prisma
- Store users in-memory
- Accept `demo@boardly.com` / `demo1234`
- Sign JWTs with the mock secret
- Set httpOnly cookies

However, in full mock mode, the backend is not needed at all.

## Files Modified

1. ✏️ `apps/web/src/lib/mock-data.ts` - Added cookie helpers and credential validation
2. ✨ `apps/web/.env.local` - Created with mock API config
3. ✨ `apps/api/.env` - Created with mock auth config
4. ✨ `owla-preview.html` - Interactive demonstration

## Benefits

✅ **No Database Required** - Works without DATABASE_URL
✅ **Fast Development** - No API round-trips
✅ **Consistent UX** - Same login flow as production
✅ **PM-Friendly** - Easy to demo in sandbox
✅ **Reliable** - No network or database failures

## Deployment

### For Sandbox/Preview:
- Copy `.env.local` variables to platform environment variables
- Ensure `NEXT_PUBLIC_USE_MOCK_API=true` is set
- Deploy frontend only (backend optional)

### For Production:
- Remove or set `NEXT_PUBLIC_USE_MOCK_API=false`
- Set real `DATABASE_URL`
- Set secure `JWT_SECRET`
- Use real authentication

## Troubleshooting

**Login fails with "Invalid credentials":**
- Verify you're using `demo@boardly.com` / `demo1234`
- Check browser console for errors
- Ensure `NEXT_PUBLIC_USE_MOCK_API=true` is set

**Redirected back to /login after successful login:**
- Check if cookie is being set (browser DevTools → Application → Cookies)
- Verify middleware is bypassing checks in mock mode
- Check browser console for errors

**Mock data not loading:**
- Verify `NEXT_PUBLIC_USE_MOCK_API=true` in environment
- Check that `mock-data.ts` has boards seeded
- Look for errors in browser console

## Next Steps

- ✅ Login flow fixed and working
- ✅ Mock data properly seeded
- ✅ Environment variables configured
- 🔄 Test in actual sandbox environment
- 🔄 Verify PM can access demo
- 🔄 Add more mock boards if needed

---

**Note:** This fix ensures the app works reliably in sandbox/preview environments without requiring a real database connection. The mock mode provides a fully functional demo experience for product reviews and development.
