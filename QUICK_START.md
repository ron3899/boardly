# Quick Start Guide

## ✅ CORS Issue Fixed!

The CORS configuration has been set up correctly. Follow these steps to get started:

## 🚀 Development Setup (3 steps)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Database
Edit `apps/api/.env` and update the `DATABASE_URL` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/boardly"
```

Then run database migrations:
```bash
cd apps/api
pnpm db:push
pnpm db:seed
cd ../..
```

### 3. Start Development Servers
```bash
pnpm dev
```

This will start:
- 🌐 Web app: http://localhost:3000
- 🔌 API server: http://localhost:3001

## ✨ What's Fixed?

✅ **Environment files created** - Both `.env` files are now configured
✅ **Local API URL set** - Web app points to `http://localhost:3001`
✅ **CORS properly configured** - API allows requests from `http://localhost:3000`
✅ **Credentials enabled** - Cookie-based authentication works correctly

## 🔍 Verify It Works

1. Open http://localhost:3000 in your browser
2. Open Developer Tools (F12) → Network tab
3. You should see requests to `localhost:3001` with **no CORS errors**

## 📚 More Information

- **CORS_FIX_SUMMARY.md** - Overview of all changes made
- **CORS_SETUP.md** - Detailed CORS configuration guide
- **owla-preview.html** - Visual demo of the fix (open in browser)

## 🚨 Still Having Issues?

Check that:
- [ ] Both servers are running (web on 3000, API on 3001)
- [ ] `.env` files exist in both `apps/web/` and `apps/api/`
- [ ] Database is accessible with the connection string
- [ ] No other services are using ports 3000 or 3001

For detailed troubleshooting, see **CORS_SETUP.md**.

## 🌐 Production Deployment

When deploying to production:

1. **Vercel (Web App)** - Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
   ```

2. **Render (API Server)** - Set environment variable:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```

---

**Need help?** Check the documentation files or see `CORS_SETUP.md` for detailed troubleshooting.
