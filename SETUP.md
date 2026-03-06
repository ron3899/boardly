# Boardly - Monorepo Setup Guide

This guide will help you set up and run the Boardly application locally.

## Prerequisites

- **Node.js**: v18+ (v20 recommended)
- **pnpm**: v8.0+ (Package manager)
- **PostgreSQL**: v14+ (Optional: can use SQLite for quick testing)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

#### API Configuration (`apps/api/.env`)

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:

```env
# For quick testing with SQLite (no PostgreSQL required)
DATABASE_URL="file:./dev.db"

# OR for PostgreSQL
# DATABASE_URL="postgresql://boardly:boardly@localhost:5432/boardly?schema=public"

JWT_SECRET="dev-secret-change-in-production"
PORT=8000
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

#### Web App Configuration (`apps/web/.env.local`)

```bash
cd apps/web
cp .env.example .env.local
```

Edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true
```

### 3. Set Up the Database

If using PostgreSQL, create the database:

```bash
createdb boardly
```

Then generate and push the Prisma schema:

```bash
# From the root directory
pnpm db:generate
pnpm db:push
```

Optional: Seed the database with sample data:

```bash
cd apps/api
pnpm db:seed
```

### 4. Start the Development Servers

From the **root directory**, run:

```bash
pnpm dev
```

This will start:
- **API Server**: http://localhost:8000
- **Web App**: http://localhost:3000

## Development Modes

### Mode 1: Full Stack (API + Database)

**Best for**: Production-like development and API testing

```env
# apps/web/.env.local
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_FALLBACK_TO_MOCK=false
```

Requirements:
- Database must be running
- API server must be running
- All features work with real data persistence

### Mode 2: Graceful Fallback (Recommended)

**Best for**: Regular development work

```env
# apps/web/.env.local
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true
```

Behavior:
- Web app tries to connect to API first
- If API is unavailable or times out, falls back to mock data
- Great for frontend development without worrying about API state

### Mode 3: Mock Only

**Best for**: Frontend-only development, UI/UX work

```env
# apps/web/.env.local
NEXT_PUBLIC_USE_MOCK_API=true
```

Behavior:
- No API calls are made
- All data is mocked in-memory
- Changes don't persist on page refresh
- Fastest startup time

## Project Structure

```
boardly/
├── apps/
│   ├── api/              # Fastify backend API
│   │   ├── src/
│   │   │   ├── config/   # Environment config
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── plugins/  # Fastify plugins
│   │   │   └── index.ts  # API entry point
│   │   ├── prisma/       # Database schema & migrations
│   │   └── .env          # API environment variables
│   │
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/      # Next.js app router pages
│       │   ├── components/ # React components
│       │   └── lib/      # Utilities & API client
│       └── .env.local    # Web environment variables
│
├── packages/
│   └── shared/           # Shared types & utilities
│
└── package.json          # Root package.json
```

## Available Scripts

### Root Directory

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm lint         # Run linting across all apps
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
```

### API (`apps/api`)

```bash
pnpm dev          # Start API with hot reload
pnpm build        # Build API for production
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed database with sample data
```

### Web (`apps/web`)

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## API Endpoints

### Health Check

```bash
# Detailed health check with database status
curl http://localhost:8000/health

# Quick ping endpoint
curl http://localhost:8000/ping
```

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Boards

- `GET /boards` - List all boards
- `GET /boards/:id` - Get board details
- `POST /boards` - Create new board
- `PATCH /boards/:id` - Update board
- `DELETE /boards/:id` - Delete board

## Troubleshooting

### Issue: Web app shows timeout errors

**Solution:**
1. Check if API is running: `curl http://localhost:8000/health`
2. If API is down, either:
   - Start the API: `cd apps/api && pnpm dev`
   - Enable fallback mode: Set `NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true`

### Issue: Database connection errors

**Solution:**
1. For quick testing, switch to SQLite:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
2. For PostgreSQL, ensure database exists:
   ```bash
   createdb boardly
   ```
3. Run migrations:
   ```bash
   pnpm db:push
   ```

### Issue: Port already in use

**Solution:**
Change the ports in `.env` files:
```env
# apps/api/.env
PORT=8001

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Issue: Changes not reflecting

**Solution:**
1. Restart dev servers: Stop (Ctrl+C) and run `pnpm dev` again
2. Clear Next.js cache: `rm -rf apps/web/.next`
3. Rebuild Prisma client: `pnpm db:generate`

## Testing the Setup

Run the test script to verify everything is working:

```bash
./test-app.sh
```

Or manually test:

```bash
# Test API health
curl http://localhost:8000/health

# Test web app
curl http://localhost:3000

# Test login page
curl http://localhost:3000/login
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Set up database
4. ✅ Start dev servers
5. 🎉 Visit http://localhost:3000
6. 📚 Read `apps/web/DEV-MODE-README.md` for frontend development tips

## Additional Resources

- [Turbo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Fastify Documentation](https://fastify.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

## Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review the error logs in the terminal
3. Ensure all prerequisites are installed
4. Try the graceful fallback mode for development
