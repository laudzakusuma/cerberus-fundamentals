# 🛡️ Panduan Instalasi Cerberus - Step by Step

## ✅ Prasyarat
Pastikan sudah terinstall:
- **Node.js 18+** (cek dengan: `node --version`)
- **npm** (cek dengan: `npm --version`)

Jika belum, download dari: https://nodejs.org/

---

## 📋 Langkah-Langkah Instalasi

### **Langkah 1: Download Proyek**
Proyek sudah tersedia di:
```
/mnt/user-data/outputs/cerberus-fundamentals
```

Download atau copy folder ini ke komputer Anda.

---

### **Langkah 2: Buka Terminal**
- **Windows**: Git Bash / PowerShell / CMD
- **macOS/Linux**: Terminal

---

### **Langkah 3: Masuk ke Direktori Proyek**
```bash
cd cerberus-fundamentals
```

Verifikasi lokasi:
```bash
pwd  # macOS/Linux
cd   # Windows
```

Output seharusnya: `/path/to/cerberus-fundamentals`

---

### **Langkah 4: Install Dependencies**
```bash
npm install
```

**Proses ini akan:**
- ✅ Download semua package (Next.js, React, Three.js, dll)
- ✅ Membuat folder `node_modules/`
- ✅ Membuat file `package-lock.json`
- ⏱️ Durasi: 1-3 menit

**Output yang diharapkan:**
```
added 450 packages, and audited 451 packages in 2m

125 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

### **Langkah 5: Setup Database**
```bash
npm run seed
```

**Proses ini akan:**
- ✅ Membuat database SQLite (`prisma/dev.db`)
- ✅ Menjalankan migrasi Prisma
- ✅ Membuat user demo
- ✅ Mengisi 8 sample events

**Output yang diharapkan:**
```
🌱 Seeding database...
✅ Created demo user: demo@cerberus.dev
✅ Created 8 sample events

🎉 Seeding completed!

Demo credentials:
  Email: demo@cerberus.dev
  Password: demo123
```

---

### **Langkah 6: Verifikasi Setup (Opsional)**
```bash
node verify-setup.js
```

Script ini akan mengecek:
- ✅ Versi Node.js
- ✅ Dependencies terinstall
- ✅ File .env ada
- ✅ Database sudah di-seed
- ✅ File-file penting ada

**Output yang diharapkan:**
```
🛡️  Cerberus Setup Verification

✅ Node.js version
✅ Dependencies installed
✅ Environment file
✅ Database initialized
✅ Prisma client
✅ File: package.json
... (dan seterusnya)

==================================================
✅ Passed: 15
==================================================

🎉 Setup looks good! Run: npm run dev

Demo Login:
  Email: demo@cerberus.dev
  Password: demo123
```

---

### **Langkah 7: Jalankan Development Server**
```bash
npm run dev
```

**Output yang diharapkan:**
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.5s
```

---

### **Langkah 8: Buka Browser**
1. Buka browser (Chrome/Firefox/Edge)
2. Ketik di address bar: `http://localhost:3000`
3. Tekan Enter

**Anda akan melihat:**
- 🎭 Landing page dengan 3D hero yang beranimasi
- 🛡️ Logo Cerberus di kiri atas
- 🔵 Tombol "Get Started"

---

### **Langkah 9: Login**
1. Klik tombol **"Sign In"** atau **"Get Started"**
2. Masukkan kredensial demo:
   ```
   Email: demo@cerberus.dev
   Password: demo123
   ```
3. Klik **"Sign In"**

**Anda akan diarahkan ke:**
- 📊 Dashboard dengan stats
- 🔔 Recent events
- 📈 Sidebar navigation

---

## 🎉 Selesai!

Cerberus sudah berjalan! Sekarang Anda bisa:
- ✅ Explore dashboard
- ✅ Lihat events real-time
- ✅ Klik event tiles untuk interaksi
- ✅ Test animasi 3D hero (putar mouse)

---

## 🔧 Commands Penting

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build untuk production
npm run start            # Start production server

# Database
npm run seed             # Seed ulang database
npx prisma studio        # Buka Prisma Studio (database GUI)

# Testing
npm run test             # Run unit tests
npm run lint             # Check code quality
npm run type-check       # TypeScript validation

# Utilities
node verify-setup.js     # Verify installation
```

---

## 🚨 Troubleshooting

### **Port 3000 sudah dipakai?**
```bash
# Matikan proses di port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Atau gunakan port lain:
PORT=3001 npm run dev
```

### **Error saat npm install?**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### **Database error?**
```bash
# Reset database
rm prisma/dev.db
npm run seed
```

### **3D scene tidak muncul?**
- Pastikan browser support WebGL (Chrome, Firefox, Edge)
- Coba disable ad-blocker
- Check browser console (F12) untuk error

### **Module not found?**
```bash
# Reinstall dependencies
npm install
```

---

## 📱 Fitur yang Bisa Dicoba

### **Landing Page**
- ✨ Hover tombol untuk animasi
- 🎭 Gerakkan mouse untuk lihat 3D tracking
- 📱 Resize window untuk test responsive

### **Dashboard**
- 📊 Lihat stats cards
- 🔔 Event tiles dengan color coding
- 🔄 Klik "Refresh" untuk update
- 📍 Sidebar navigation

### **3D Hero**
- 🎨 Three-headed guardian beranimasi
- 🌀 Auto-rotate aktif
- 🖱️ Drag untuk rotate manual
- ✨ Bloom effect pada objek

---

## 🎨 Kustomisasi

### **Ubah Warna**
Edit `src/styles/design-tokens.ts`:
```typescript
colors: {
  accent: '#FF00FF',  // Ganti ke warna favorit
  accent2: '#00FF00',
}
```

### **Ubah 3D Scene**
Edit `src/components/3d/HeroScene.tsx`:
- Ganti geometry
- Ubah material colors
- Tambah objek baru

### **Tambah Event Baru**
POST ke API:
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "security_alert",
    "level": "critical",
    "message": "Test event"
  }'
```

---

## 📚 Dokumentasi Lengkap

- **README.md** - Dokumentasi lengkap
- **QUICKSTART.md** - Quick start guide
- **PROJECT_SUMMARY.md** - Overview proyek

---

## 💡 Tips

1. **Performance**: 3D scene otomatis fallback di device lemah
2. **Accessibility**: Support keyboard navigation (Tab key)
3. **PWA**: Bisa di-install sebagai app (klik install icon di browser)
4. **Real-time**: Events auto-refresh setiap 10 detik

---

## 🎓 Next Steps

1. ✅ Jalankan aplikasi
2. 📖 Baca dokumentasi di README.md
3. 🎨 Kustomisasi design tokens
4. 🔧 Tambah fitur baru
5. 🚀 Deploy ke production

---

**Butuh bantuan? Cek browser console (F12) untuk debug info!**

**Happy coding! 🛡️✨**
