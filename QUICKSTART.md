# Boardly Quick Start Guide

Get Boardly running in **under 2 minutes** with zero configuration hassle.

## 🚀 Super Quick Start (Recommended)

```bash
# 1. Install dependencies
pnpm install

# 2. Run the automated setup and start
./dev-start.sh
```

That's it! The script will:
- ✅ Set up SQLite database automatically
- ✅ Generate database schema
- ✅ Seed with sample data
- ✅ Start both API and Web servers

**Access the app**: http://localhost:3000

---

## 🎯 Development Modes

### Mode 1: Full Stack (Default) ✨ **Recommended**

Everything works out of the box with SQLite:

```bash
./dev-start.sh
```

- **API Server**: http://localhost:8000
- **Web App**: http://localhost:3000
- **Database**: SQLite (no PostgreSQL needed!)
- **Auto-fallback**: If API goes down, web app uses mock data

### Mode 2: Web Only (Frontend Development)

No API, no database, just the web app with mock data:

```bash
./dev-web-only.sh
```

- **Web App**: http://localhost:3000
- **Data**: Mock data (in-memory, non-persistent)
- **Use case**: UI/UX work, component development

### Mode 3: Manual (Advanced)

Start services individually:

```bash
# Terminal 1: API Server
cd apps/api
pnpm dev

# Terminal 2: Web App
cd apps/web
pnpm dev
```

---

## 📦 What You Need

- **Node.js**: v18 or newer ([download](https://nodejs.org))
- **pnpm**: Package manager

```bash
# Install pnpm if you don't have it
npm install -g pnpm
```

---

## 🔧 Configuration (Optional)

The app works with **zero configuration**, but you can customize:

### Using PostgreSQL Instead of SQLite

1. Edit `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/boardly"
   ```

2. Edit `apps/api/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. Run setup:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

### Change Ports

Edit `.env` files:

```env
# apps/api/.env
PORT=8001

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## 🐛 Troubleshooting

### Issue: "Port already in use"

**Solution**: Kill the process or change the port

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in apps/web/package.json:
"dev": "next dev --port 3001"
```

### Issue: "Database errors"

**Solution**: Reset the database

```bash
cd apps/api
rm -f dev.db dev.db-journal  # Delete SQLite database
pnpm db:push                  # Recreate
pnpm db:seed                  # Seed with data
```

### Issue: "Web app shows timeout errors"

**Solutions**:

1. **Check if API is running**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Enable fallback mode** (edit `apps/web/.env.local`):
   ```env
   NEXT_PUBLIC_API_FALLBACK_TO_MOCK=true
   ```

3. **Or use web-only mode**:
   ```bash
   ./dev-web-only.sh
   ```

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies

```bash
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Issue: "Prisma client errors"

**Solution**: Regenerate Prisma client

```bash
pnpm db:generate
```

---

## ✅ Verify Everything Works

Run the test script:

```bash
./test-app.sh
```

Or manually test:

```bash
# Test API
curl http://localhost:8000/health

# Should return: {"status":"ok","database":{"status":"connected"},...}

# Test Web App
curl http://localhost:3000

# Should return HTML
```

---

## 🎓 Default Login Credentials

After running `dev-start.sh`, use these credentials:

- **Email**: `demo@boardly.dev`
- **Password**: `password123`

Or register a new account at http://localhost:3000/register

---

## 📚 Next Steps

1. ✅ Start the app with `./dev-start.sh`
2. 🌐 Visit http://localhost:3000
3. 🔐 Login with demo credentials
4. 🎨 Create your first board
5. 📖 Read [SETUP.md](./SETUP.md) for detailed docs

---

## 🆘 Still Having Issues?

1. **Check logs**: Look at terminal output for error messages
2. **Try web-only mode**: `./dev-web-only.sh`
3. **Reset everything**:
   ```bash
   rm -rf node_modules apps/*/node_modules
   rm -f apps/api/dev.db
   pnpm install
   ./dev-start.sh
   ```

---

## 📊 Project Structure

```
boardly/
├── apps/
│   ├── api/           # Backend (Fastify + Prisma)
│   └── web/           # Frontend (Next.js + React)
├── packages/
│   └── shared/        # Shared types
├── dev-start.sh       # Auto setup & start (recommended)
├── dev-web-only.sh    # Frontend-only mode
└── test-app.sh        # Test everything works
```

---

## 🔥 Pro Tips

1. **Use `dev-start.sh`** - It handles everything automatically
2. **Fallback mode is enabled by default** - Web app works even if API is down
3. **SQLite requires no setup** - Perfect for local development
4. **Mock data mode** - Great for frontend work without backend

---

Happy coding! 🎉
