# 🛡️ MULAI DI SINI - Cerberus Installation Guide

Selamat datang di **Cerberus Fundamentals**! 🎉

Proyek security monitoring platform dengan UI futuristik dan 3D interaktif.

---

## 🚀 Instalasi Cepat (3 Menit)

Jalankan command ini di terminal:

```bash
cd cerberus-fundamentals
npm install
npm run seed
npm run dev
```

Kemudian buka: **http://localhost:3000**

Login dengan:
```
Email: demo@cerberus.dev
Password: demo123
```

✅ **SELESAI!**

---

## 📚 Panduan Lengkap (Pilih Sesuai Kebutuhan)

### 1. **COMMANDS.md** ⚡
   → Copy-paste commands langsung
   → Paling cepat untuk mulai
   → **[Buka File Ini Dulu!](./COMMANDS.md)**

### 2. **INSTALASI.md** 📖
   → Panduan detail step-by-step
   → Dengan troubleshooting
   → Untuk pemula

### 3. **FLOWCHART.md** 🎯
   → Visualisasi alur instalasi
   → Timeline estimasi
   → Error recovery

### 4. **QUICKSTART.md** 🏃
   → Quick start guide (English)
   → 5-minute setup
   → Basic info

### 5. **README.md** 📘
   → Dokumentasi lengkap
   → Architecture overview
   → API reference
   → Deployment guide

### 6. **PROJECT_SUMMARY.md** 📋
   → Overview proyek
   → File structure
   → Tech stack details

---

## 🎯 Rekomendasi Urutan Baca

**Pertama kali install:**
```
1. COMMANDS.md      (copy-paste commands)
2. Browser check    (http://localhost:3000)
3. Test login       (demo credentials)
```

**Jika ada error:**
```
1. INSTALASI.md     (troubleshooting section)
2. FLOWCHART.md     (error recovery)
```

**Untuk development:**
```
1. README.md        (architecture & API)
2. PROJECT_SUMMARY.md (code structure)
```

---

## ⚡ Ultra Quick Start

Hanya 3 commands:

```bash
# 1. Install (2 menit)
npm install

# 2. Setup database (10 detik)
npm run seed

# 3. Start server (15 detik)
npm run dev
```

Buka browser → `localhost:3000` → Login → **DONE!**

---

## 🔍 Verifikasi Cepat

Setelah install, cek dengan:

```bash
node verify-setup.js
```

Output seharusnya:
```
✅ Node.js version
✅ Dependencies installed
✅ Environment file
✅ Database initialized
✅ Prisma client
...
🎉 Setup looks good! Run: npm run dev
```

---

## 🎓 Apa yang Akan Anda Lihat?

### Landing Page
- 🎭 3D animated hero (three-headed guardian)
- ✨ Smooth animations
- 🌟 Neon glow effects
- 🔵 "Get Started" button

### Dashboard (Setelah Login)
- 📊 Statistics cards (Total, Critical, Warnings)
- 🔔 Event tiles dengan color coding
- 📈 Sidebar navigation
- 🔄 Real-time refresh
- ✨ Glass morphism design

---

## 🛠️ Requirements

**Minimal:**
- Node.js 18+
- npm 8+
- Browser modern (Chrome/Firefox/Edge)

**Check versions:**
```bash
node --version   # Should be v18+
npm --version    # Should be 8+
```

---

## 📦 Yang Akan Diinstall

```
Total packages: 450+
Size: ~250 MB
Time: 1-3 minutes
```

**Main dependencies:**
- Next.js 14 (React framework)
- TypeScript (Type safety)
- Stitches (CSS-in-JS)
- Framer Motion (Animations)
- Three.js (3D graphics)
- Prisma (Database ORM)
- NextAuth (Authentication)

---

## 🚨 Troubleshooting Quick Fix

### Port 3000 sudah dipakai?
```bash
PORT=3001 npm run dev
```

### npm install error?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database error?
```bash
rm prisma/dev.db
npm run seed
```

---

## 🎯 Setelah Berhasil Install

**Test fitur-fitur ini:**

✅ Gerakkan mouse di landing page (3D tracking)  
✅ Hover tombol (animasi lift)  
✅ Login ke dashboard  
✅ Klik event tiles  
✅ Test sidebar navigation  
✅ Resize window (responsive)  
✅ Check accessibility (Tab navigation)  

---

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Recommended |
| Firefox | ✅ Full | Recommended |
| Edge    | ✅ Full | Chromium-based |
| Safari  | ✅ Full | macOS/iOS |
| IE      | ❌ No   | Not supported |

---

## 🎨 Preview

**Landing:**
```
   🛡️ CERBERUS
   
   [Interactive 3D Guardian]
   
   Security Monitoring
   Reimagined
   
   [ Get Started → ]
```

**Dashboard:**
```
   📊 Total: 8  |  🔴 Critical: 2  |  🟡 Warning: 1
   
   Recent Events:
   
   🚨 Security Alert | Critical
   Failed login attempt detected
   🌐 192.168.1.100  🕐 5m ago
   
   📊 System Status | Info
   Health check completed
   🌐 localhost  🕐 10m ago
```

---

## 💡 Pro Tips

1. **Development**: Gunakan `npm run dev` (fast refresh enabled)
2. **Database GUI**: Run `npx prisma studio` untuk visual editor
3. **Testing**: Run `npm run test` untuk unit tests
4. **Type Check**: Run `npm run type-check` sebelum commit
5. **Code Quality**: Run `npm run lint` untuk check style

---

## 🔗 Quick Links

- **Full Docs**: [README.md](./README.md)
- **Quick Commands**: [COMMANDS.md](./COMMANDS.md)
- **Installation**: [INSTALASI.md](./INSTALASI.md)
- **Flowchart**: [FLOWCHART.md](./FLOWCHART.md)

---

## 📞 Need Help?

1. Check browser console (F12)
2. Read INSTALASI.md troubleshooting section
3. Run `node verify-setup.js`
4. Check FLOWCHART.md error recovery

---

## 🎉 Ready to Start?

```bash
cd cerberus-fundamentals
npm install
npm run seed  
npm run dev
```

**Good luck & happy coding! 🛡️✨**

---

*Last updated: October 31, 2025*
