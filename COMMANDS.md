# ⚡ Quick Start - Copy Paste Commands

Jalankan command ini satu per satu di terminal:

---

## 1️⃣ Masuk ke Direktori
```bash
cd cerberus-fundamentals
```

---

## 2️⃣ Install Dependencies
```bash
npm install
```
⏱️ Tunggu 1-3 menit...

---

## 3️⃣ Setup Database
```bash
npm run seed
```
✅ Database siap dengan demo user!

---

## 4️⃣ Verifikasi (Optional)
```bash
node verify-setup.js
```
🔍 Cek apakah semua OK

---

## 5️⃣ Start Server
```bash
npm run dev
```
🚀 Server berjalan di http://localhost:3000

---

## 6️⃣ Buka Browser
```
http://localhost:3000
```

---

## 7️⃣ Login
```
Email: demo@cerberus.dev
Password: demo123
```

---

## ✅ DONE!

Dashboard seharusnya sudah muncul dengan:
- 📊 Statistics cards
- 🔔 Event tiles
- 🎭 3D animated hero
- 📈 Sidebar navigation

---

## 🔧 Commands Lainnya

```bash
# Stop server
Ctrl + C

# Restart server
npm run dev

# Build production
npm run build

# Open database GUI
npx prisma studio

# Run tests
npm run test

# Check code
npm run lint
```

---

## 🚨 Jika Ada Error

### Port sudah dipakai:
```bash
PORT=3001 npm run dev
```

### Clear dan reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset database:
```bash
rm prisma/dev.db
npm run seed
```

---

## 📱 Browser Support

✅ Chrome  
✅ Firefox  
✅ Edge  
✅ Safari  
❌ IE (not supported)

---

## 🎯 Setelah Login

Coba:
- Klik event tiles
- Hover buttons untuk animasi
- Drag 3D scene
- Test sidebar navigation
- Resize window (responsive test)

---

**Need help? Check INSTALASI.md untuk troubleshooting lengkap!**
