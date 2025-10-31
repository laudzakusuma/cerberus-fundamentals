# 🎯 Alur Instalasi Cerberus

```
┌─────────────────────────────────────────────────────────────┐
│                    MULAI INSTALASI                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Check Node.js     │
         │  node --version    │
         │  (Need v18+)       │
         └────────┬───────────┘
                  │ ✅
                  ▼
         ┌────────────────────┐
         │  Masuk Direktori   │
         │  cd cerberus-*     │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  npm install       │◄──── ⏱️ 1-3 menit
         │  (450+ packages)   │
         └────────┬───────────┘
                  │ ✅
                  ▼
         ┌────────────────────┐
         │  npm run seed      │
         │  (Setup DB)        │
         └────────┬───────────┘
                  │ ✅
                  ▼
         ┌────────────────────┐
         │  node verify-*     │◄──── 🔍 Optional
         │  (Check setup)     │
         └────────┬───────────┘
                  │ ✅
                  ▼
         ┌────────────────────┐
         │  npm run dev       │◄──── 🚀 Start!
         │  (Port 3000)       │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Buka Browser      │
         │  localhost:3000    │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Klik Sign In      │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Login             │
         │  demo@cerberus.dev │
         │  demo123           │
         └────────┬───────────┘
                  │ ✅
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    🎉 DASHBOARD READY!                       │
│                                                              │
│   📊 Stats Cards       🔔 Event Tiles                       │
│   🎭 3D Hero          📈 Sidebar Nav                        │
│   ✨ Animations       🛡️ Real-time Updates                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Timeline Estimasi

```
1. cd cerberus-*        →  5 detik
2. npm install          →  2 menit  ⏱️
3. npm run seed         →  10 detik
4. verify-setup         →  5 detik  (optional)
5. npm run dev          →  15 detik
6. Buka browser         →  5 detik
7. Login                →  10 detik
                        ────────────
   TOTAL:               ~3 menit
```

---

## 🔄 Struktur Folder Setelah Install

```
cerberus-fundamentals/
│
├── node_modules/          ← Tercipta setelah npm install
│   └── (450+ packages)
│
├── prisma/
│   ├── dev.db            ← Tercipta setelah npm run seed
│   ├── dev.db-journal    ← SQLite journal
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app/              → Next.js pages
│   ├── components/       → React components
│   ├── lib/              → Utilities
│   └── styles/           → Stitches theme
│
├── .env                  → Environment variables
├── package.json          → Dependencies
└── package-lock.json     ← Tercipta setelah npm install
```

---

## 🎯 Checkpoint Status

Setelah setiap step, cek:

```
✅ Step 1 - Direktori OK:
   $ ls package.json
   package.json  ← file ada

✅ Step 2 - npm install OK:
   $ ls node_modules
   node_modules/  ← folder ada
   
✅ Step 3 - Database OK:
   $ ls prisma/dev.db
   prisma/dev.db  ← file ada

✅ Step 4 - Server OK:
   $ npm run dev
   ✓ Ready in 2.5s  ← message ini muncul
```

---

## 🔴 Error Recovery

Jika ada error di step manapun:

```
┌─────────────────────┐
│   npm install       │
│   GAGAL? ❌         │
└─────────┬───────────┘
          │
          ▼
  ┌──────────────────┐
  │  rm -rf node_*   │
  │  npm install     │
  └──────────────────┘

┌─────────────────────┐
│   npm run seed      │
│   GAGAL? ❌         │
└─────────┬───────────┘
          │
          ▼
  ┌──────────────────┐
  │  rm prisma/*.db  │
  │  npm run seed    │
  └──────────────────┘

┌─────────────────────┐
│   npm run dev       │
│   Port conflict? ❌ │
└─────────┬───────────┘
          │
          ▼
  ┌──────────────────┐
  │  PORT=3001       │
  │  npm run dev     │
  └──────────────────┘
```

---

## 🎓 Apa yang Terjadi di Setiap Step?

### npm install
```
→ Download 450+ packages
→ Build native modules
→ Create node_modules/
→ Generate package-lock.json
```

### npm run seed
```
→ Run: prisma db push
  ├─ Create database schema
  └─ Generate Prisma Client
  
→ Run: ts-node prisma/seed.ts
  ├─ Create demo user (bcrypt hash password)
  └─ Insert 8 sample events
```

### npm run dev
```
→ Start Next.js dev server
→ Compile TypeScript
→ Bundle client code
→ Start on http://localhost:3000
→ Enable Fast Refresh
```

---

## 📱 Hasil Akhir

Setelah login, Anda akan melihat:

```
╔═══════════════════════════════════════════════════════╗
║  🛡️ CERBERUS           [📊] [🔔] [📈]  [User] [Sign Out] ║
╠═══════════════════════════════════════════════════════╣
║                                                        ║
║  📊 Dashboard                                         ║
║  Welcome back, demo@cerberus.dev                      ║
║                                                        ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐            ║
║  │ Total    │ │ Critical │ │ Warnings │            ║
║  │ Events   │ │ 🔴       │ │ 🟡       │            ║
║  │    8     │ │    2     │ │    1     │            ║
║  └──────────┘ └──────────┘ └──────────┘            ║
║                                                        ║
║  Recent Events                      [🔄 Refresh]      ║
║                                                        ║
║  ┌─────────────────────────────────────────┐         ║
║  │ 🚨 Security Alert         🔴 Critical   │         ║
║  │ Failed login attempt detected           │         ║
║  │ 🌐 192.168.1.100  🕐 5m ago            │         ║
║  └─────────────────────────────────────────┘         ║
║                                                        ║
║  (... 7 more events ...)                              ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```

---

**🎉 Installation complete! Selamat coding!**
