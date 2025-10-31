# 🚀 Quick Start Guide

Get Cerberus up and running in 5 minutes!

## Prerequisites

Make sure you have installed:
- Node.js 18 or higher
- npm (comes with Node.js)

Check your versions:
```bash
node --version  # Should be v18 or higher
npm --version
```

## Installation Steps

### 1. Navigate to the project
```bash
cd cerberus-fundamentals
```

### 2. Install dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Stitches (CSS-in-JS)
- Framer Motion (animations)
- Three.js & react-three-fiber (3D graphics)
- Prisma (database)
- NextAuth (authentication)

### 3. Setup the database
```bash
npm run seed
```

This command will:
✅ Create a SQLite database file (dev.db)
✅ Run database migrations
✅ Create demo user account
✅ Generate sample security events

### 4. Start the development server
```bash
npm run dev
```

### 5. Open your browser
Navigate to: **http://localhost:3000**

You should see the Cerberus landing page with an animated 3D guardian!

## Demo Login

Use these credentials to sign in:
```
Email: demo@cerberus.dev
Password: demo123
```

## What's Next?

After signing in, you'll see:
- **Dashboard** - Overview with stats and recent events
- **Event tiles** - Real-time security events
- **Sidebar navigation** - Access to different sections

## Project Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with demo data
npm run test         # Run unit tests
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
```

## Explore the Code

Key files to check out:
- `src/app/page.tsx` - Landing page with 3D hero
- `src/components/3d/HeroScene.tsx` - Interactive 3D scene
- `src/styles/design-tokens.ts` - Design system
- `prisma/schema.prisma` - Database schema

## Customize

### Change Colors
Edit `src/styles/design-tokens.ts`:
```typescript
colors: {
  accent: '#00D1FF',  // Change to your brand color
  accent2: '#9B59FF', // Secondary color
  // ...
}
```

### Add New Events
POST to `/api/events`:
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "security_alert",
    "level": "critical",
    "message": "Your custom event"
  }'
```

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Database issues?
```bash
# Reset database
rm prisma/dev.db
npm run seed
```

### Module not found errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments - they're extensive!
- Open the browser console (F12) for debugging

## Production Deployment

When ready to deploy:
1. Update environment variables
2. Switch to PostgreSQL
3. Run `npm run build`
4. Deploy to Vercel, Railway, or your platform of choice

---

**Happy coding! 🛡️**
