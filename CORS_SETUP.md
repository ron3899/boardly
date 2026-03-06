# CORS Configuration Guide

## Overview

This document explains the CORS (Cross-Origin Resource Sharing) configuration for the Boardly application and how to fix common CORS-related issues.

## Problem Statement

The application previously had CORS errors when the web frontend tried to connect to the API backend because:

1. The web app was configured to connect to a placeholder URL (`https://your-api.onrender.com/`)
2. The client sends requests with `credentials: 'include'` to support cookie-based authentication
3. Proper environment configuration was missing

## Solution

### 1. Environment Configuration

**Web App (`apps/web/.env`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**API Server (`apps/api/.env`):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/boardly"
JWT_SECRET="dev-secret-change-me-in-production"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 2. CORS Configuration in API

The API is configured in `apps/api/src/plugins/cors.ts` with:

```typescript
app.register(fastifyCors, {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
})
```

This configuration:
- ✅ Allows specific origins (not wildcard `*`)
- ✅ Enables credentials (cookies, authorization headers)
- ✅ Supports multiple origins via comma-separated values

### 3. Client Configuration

The API client in `apps/web/src/lib/api-client.ts` includes:

```typescript
const res = await fetch(`${API_URL}${path}`, {
  credentials: 'include',  // Required for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## How CORS Works

When the browser makes a cross-origin request:

1. Browser sends a **preflight request** (OPTIONS) to check if the origin is allowed
2. Server responds with CORS headers:
   - `Access-Control-Allow-Origin: http://localhost:3000`
   - `Access-Control-Allow-Credentials: true`
3. Browser allows the actual request to proceed
4. Server includes CORS headers in the response

## Common Issues and Solutions

### Issue 1: Wildcard Origin with Credentials

❌ **Wrong:**
```typescript
origin: '*',
credentials: true,  // Not allowed with wildcard!
```

✅ **Correct:**
```typescript
origin: ['http://localhost:3000'],
credentials: true,
```

### Issue 2: Missing Environment Variables

If you get CORS errors, check that:

1. `apps/web/.env` exists with `NEXT_PUBLIC_API_URL`
2. `apps/api/.env` exists with `CORS_ORIGIN`
3. The URLs match your actual server addresses

### Issue 3: Production Deployment

For production, update the environment variables:

**Web App:**
```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

**API Server:**
```env
CORS_ORIGIN="https://your-app.vercel.app"
```

For multiple origins:
```env
CORS_ORIGIN="https://your-app.vercel.app,https://staging.your-app.vercel.app"
```

## Development Setup

1. **Copy example files:**
   ```bash
   cp apps/web/.env.example apps/web/.env
   cp apps/api/.env.example apps/api/.env
   ```

2. **Update database URL** in `apps/api/.env` with your PostgreSQL connection

3. **Start the development servers:**
   ```bash
   pnpm dev
   ```

   This will start:
   - Web app on `http://localhost:3000`
   - API server on `http://localhost:3001`

4. **Verify CORS is working:**
   - Open browser dev tools (F12)
   - Navigate to `http://localhost:3000`
   - Check the Network tab - there should be no CORS errors
   - Preflight OPTIONS requests should return 200 OK

## Testing CORS

You can test the CORS configuration with curl:

```bash
# Test preflight request
curl -i -X OPTIONS http://localhost:3001/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"

# Should return:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Credentials: true
```

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│  Next.js Web App    │         │   Fastify API       │
│  localhost:3000     │────────▶│   localhost:3001    │
│                     │  CORS   │                     │
│  credentials:       │◀────────│  CORS Plugin:       │
│  'include'          │         │  - origin: [...]    │
│                     │         │  - credentials: true│
└─────────────────────┘         └─────────────────────┘
```

## Security Best Practices

1. **Never use wildcard (`*`) with credentials** - This is a security risk and browsers will block it
2. **List specific origins** - Only allow origins you control
3. **Use HTTPS in production** - Especially important with credentials
4. **Rotate JWT secrets** - Change `JWT_SECRET` from default value
5. **Validate origin on server** - The CORS plugin does this automatically

## Troubleshooting

### Browser shows "CORS policy: No 'Access-Control-Allow-Origin' header"

1. Check API server is running on the correct port
2. Verify `CORS_ORIGIN` in `apps/api/.env` matches web app URL
3. Check browser console for the actual origin being sent

### Browser shows "CORS policy: The value of the 'Access-Control-Allow-Origin' header must not be the wildcard '*'"

This means the server is using wildcard origin with credentials. Update the API CORS configuration to use specific origins.

### Cookies not being sent/received

1. Ensure `credentials: 'include'` is set in fetch requests
2. Ensure `credentials: true` is set in CORS plugin
3. Check that origin matches exactly (including protocol and port)
4. For production, ensure both sites use HTTPS

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Fastify CORS Plugin](https://github.com/fastify/fastify-cors)
- [Fetch API Credentials](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#sending_a_request_with_credentials_included)
