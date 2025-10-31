# 🛡️ Cerberus Fundamentals

A minimal, production-ready fullstack security monitoring platform built with Next.js, TypeScript, and modern web technologies. Features a stunning dark futuristic UI with interactive 3D elements and real-time event monitoring.

## ✨ Features

- **🎨 Premium Dark UI**: Futuristic glass morphism design with neon accents
- **🎭 3D Hero Scene**: Interactive three-headed guardian with procedural geometry (react-three-fiber)
- **⚡ Real-time Events**: Live event monitoring with Socket.IO infrastructure
- **🔐 Authentication**: Secure NextAuth-based credential authentication
- **📱 PWA Support**: Installable progressive web app with offline capabilities
- **🎬 Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **♿ Accessible**: WCAG-compliant with keyboard navigation and screen reader support
- **📦 No Tailwind**: Pure Stitches CSS-in-JS with design tokens

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - App Router with TypeScript
- **Stitches** - CSS-in-JS with design tokens
- **Framer Motion** - Animation library
- **react-three-fiber** - 3D rendering with Three.js
- **@react-three/drei** - Three.js helpers
- **@react-three/postprocessing** - Bloom and visual effects

### Backend
- **Next.js API Routes** - RESTful endpoints
- **Prisma** - Type-safe database ORM
- **SQLite** - Database (PoC, swap for PostgreSQL in production)
- **NextAuth** - Authentication solution
- **Socket.IO** - Real-time WebSocket communication (infrastructure ready)

### Developer Experience
- **TypeScript** - Strict type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Setup

1. **Clone and install**
```bash
cd cerberus-fundamentals
npm install
```

2. **Setup database**
```bash
npm run seed
```

This will:
- Create SQLite database
- Run Prisma migrations
- Seed with demo user and sample events

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
```
Email: demo@cerberus.dev
Password: demo123
```

## 📁 Project Structure

```
cerberus-fundamentals/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── events/          # Events CRUD
│   │   │   └── status/          # System status
│   │   ├── auth/                # Auth pages
│   │   │   └── signin/          # Sign-in page
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── providers.tsx        # Client providers
│   │
│   ├── components/              # React components
│   │   ├── 3d/                  # Three.js components
│   │   │   └── HeroScene.tsx   # 3D hero scene
│   │   ├── ui/                  # UI components
│   │   │   ├── Topbar.tsx      # Navigation bar
│   │   │   └── Sidebar.tsx     # Dashboard sidebar
│   │   └── EventTile.tsx       # Event card component
│   │
│   ├── lib/                     # Core utilities
│   │   ├── auth.ts             # NextAuth config
│   │   └── db.ts               # Prisma client
│   │
│   ├── styles/                  # Styling
│   │   ├── design-tokens.ts    # Stitches theme
│   │   └── global.css          # Global CSS
│   │
│   └── utils/                   # Helpers
│       └── motionPresets.ts    # Animation presets
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
│
└── public/                      # Static assets
    └── manifest.json            # PWA manifest
```

## 🎨 Design System

### Color Palette

```typescript
colors: {
  bg: '#0B0F14',           // Background
  accent: '#00D1FF',       // Primary accent (cyan)
  accent2: '#9B59FF',      // Secondary accent (purple)
  success: '#2EE6A6',      // Success green
  danger: '#FF6B6B',       // Error red
  text: '#E8EEF2',         // Primary text
  textMuted: '#9AA4B2',    // Secondary text
}
```

### Typography

```typescript
fonts: {
  body: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, monospace',
}

fontSizes: {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
}
```

### Spacing

Uses 4px base unit:
```typescript
space: {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  // ... up to 20
}
```

### Border Radius

```typescript
radii: {
  sm: '6px',
  md: '8px',
  lg: '14px',
  xl: '20px',
  full: '9999px',
}
```

### Motion

```typescript
transitions: {
  fast: '180ms cubic-bezier(0.22, 0.9, 0.3, 1)',
  base: '360ms cubic-bezier(0.22, 0.9, 0.3, 1)',
  slow: '600ms cubic-bezier(0.22, 0.9, 0.3, 1)',
}
```

## 🎭 Styling Approach

### Using Stitches

```tsx
import { styled } from '@/styles/design-tokens';

const Button = styled('button', {
  px: '$4',
  py: '$2',
  backgroundColor: '$accent',
  borderRadius: '$md',
  
  '&:hover': {
    transform: 'translateY(-2px)',
  },
});
```

### Design Tokens Usage

```tsx
// Access theme tokens
import { theme } from '@/styles/design-tokens';

const myColor = theme.colors.accent;
```

### Glass Morphism Effect

```tsx
const Card = styled('div', {
  backgroundColor: '$bgCard',         // rgba(19, 25, 32, 0.7)
  backdropFilter: 'blur(6px)',
  border: '1px solid $border',
});
```

## 🎬 Animation Patterns

### Page Transitions

```tsx
import { pageVariants } from '@/utils/motionPresets';

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="enter"
  exit="exit"
>
  {children}
</motion.div>
```

### Stagger Children

```tsx
import { staggerContainer, slideUpVariants } from '@/utils/motionPresets';

<motion.div variants={staggerContainer}>
  {items.map(item => (
    <motion.div key={item.id} variants={slideUpVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects

```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## 🔌 API Reference

### GET /api/status
Returns system status and uptime.

**Response:**
```json
{
  "status": "operational",
  "uptime": 3600,
  "database": "ok",
  "timestamp": "2025-10-31T10:00:00.000Z"
}
```

### GET /api/events
Fetches recent events with optional filters.

**Query Parameters:**
- `limit` (number): Max events to return (default: 20, max: 100)
- `type` (string): Filter by event type
- `level` (string): Filter by severity level

**Response:**
```json
{
  "events": [
    {
      "id": "clx...",
      "type": "security_alert",
      "level": "critical",
      "message": "Failed login attempt",
      "source": "192.168.1.100",
      "createdAt": "2025-10-31T10:00:00.000Z"
    }
  ]
}
```

### POST /api/events
Creates a new event.

**Body:**
```json
{
  "type": "security_alert",
  "level": "critical",
  "message": "Suspicious activity detected",
  "source": "192.168.1.100",
  "metadata": {
    "userAgent": "...",
    "sessionId": "..."
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run e2e
```

### Type Checking
```bash
npm run type-check
```

## 📱 PWA Configuration

The app is PWA-ready with:
- ✅ Manifest file
- ✅ Service worker support (install @ducanh2912/next-pwa)
- ✅ Offline fallback
- ✅ Installable on mobile/desktop

To enable full PWA:
1. Install: `npm install @ducanh2912/next-pwa`
2. Uncomment PWA config in `next.config.js`
3. Rebuild: `npm run build`

## 🔐 Security Notes

### Production Checklist
- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Switch from SQLite to PostgreSQL/MySQL
- [ ] Add rate limiting to API routes
- [ ] Implement CORS policies
- [ ] Add CSP headers
- [ ] Enable HTTPS
- [ ] Add input validation/sanitization
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Configure proper session management

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
Required for production:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-random-secret"
```

## 🎯 Future Enhancements

- [ ] WebSocket real-time events (Socket.IO server setup)
- [ ] Advanced analytics dashboard
- [ ] Event filtering and search
- [ ] User management
- [ ] API key generation
- [ ] Email notifications
- [ ] Dark/light theme toggle
- [ ] Mobile responsive improvements
- [ ] Export reports (PDF/CSV)
- [ ] Multi-factor authentication

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stitches Documentation](https://stitches.dev)
- [Framer Motion](https://www.framer.com/motion)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)

## 📄 License

MIT License - feel free to use this project as a foundation for your own applications.

## 🤝 Contributing

This is a proof-of-concept project. Feel free to fork and extend it for your needs.

---

**Built with ❤️ using modern web technologies**
