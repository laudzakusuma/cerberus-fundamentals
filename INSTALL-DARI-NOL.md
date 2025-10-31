# 🚀 PANDUAN INSTALASI LENGKAP - DARI NOL

## Persiapan: Install Node.js & npm

### 📥 Download Node.js

#### **Windows:**
1. Buka: https://nodejs.org/
2. Download versi **LTS** (Long Term Support) - saat ini v20.x
3. Klik file installer (misal: `node-v20.x.x-x64.msi`)
4. Ikuti wizard instalasi:
   - Klik "Next" → "Next" → "Install"
   - Centang "Automatically install necessary tools"
   - Tunggu sampai selesai
5. Restart komputer

#### **macOS:**
```bash
# Cara 1: Download dari website
# Buka: https://nodejs.org/
# Download .pkg installer → Klik install

# Cara 2: Pakai Homebrew (jika sudah install)
brew install node
```

#### **Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install Node.js dari NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node --version
npm --version
```

---

## ✅ Verifikasi Instalasi Node.js

Buka terminal/command prompt, ketik:

```bash
node --version
```
**Output seharusnya:** `v18.x.x` atau `v20.x.x`

```bash
npm --version
```
**Output seharusnya:** `9.x.x` atau `10.x.x`

Jika kedua command di atas keluar versi number, berarti **instalasi berhasil!** ✅

---

## 📦 Download Proyek Cerberus

### **Opsi 1: Download dari link**
1. Download folder `cerberus-fundamentals` (sudah saya sediakan)
2. Extract/unzip ke lokasi yang mudah diakses
   - Misal: `C:\Projects\cerberus-fundamentals` (Windows)
   - Misal: `~/Projects/cerberus-fundamentals` (macOS/Linux)

### **Opsi 2: Jika ada di zip file**
1. Extract file `cerberus-fundamentals.zip`
2. Pastikan struktur folder seperti ini:
   ```
   cerberus-fundamentals/
   ├── package.json
   ├── src/
   ├── prisma/
   └── ... (file lainnya)
   ```

---

## 🖥️ Buka Terminal/Command Prompt

### **Windows:**
- **PowerShell** (Recommended):
  1. Tekan `Windows + X`
  2. Pilih "Windows PowerShell"
  
- **Command Prompt (CMD)**:
  1. Tekan `Windows + R`
  2. Ketik `cmd`
  3. Enter

- **Git Bash** (jika sudah install Git):
  1. Klik kanan di folder project
  2. Pilih "Git Bash Here"

### **macOS:**
1. Tekan `Cmd + Space`
2. Ketik "Terminal"
3. Enter

### **Linux:**
1. Tekan `Ctrl + Alt + T`

---

## 📂 Masuk ke Direktori Proyek

Di terminal, ketik:

### **Windows (PowerShell/CMD):**
```bash
# Ganti path ini sesuai lokasi folder Anda
cd C:\Projects\cerberus-fundamentals

# Atau jika di Desktop:
cd C:\Users\NamaUser\Desktop\cerberus-fundamentals
```

### **macOS/Linux:**
```bash
# Ganti path ini sesuai lokasi folder Anda
cd ~/Projects/cerberus-fundamentals

# Atau jika di Desktop:
cd ~/Desktop/cerberus-fundamentals
```

### **Verifikasi lokasi:**
```bash
# Windows (PowerShell)
Get-Location

# Windows (CMD)
cd

# macOS/Linux
pwd
```

**Output seharusnya menunjukkan path ke folder cerberus-fundamentals**

---

## 📋 Cek Isi Folder

Ketik command ini untuk melihat file di folder:

```bash
# Windows (PowerShell)
dir

# Windows (CMD)
dir

# macOS/Linux
ls -la
```

**Anda seharusnya melihat:**
- `package.json` ← File penting!
- `src/` ← Folder source code
- `prisma/` ← Folder database
- `README.md` ← Dokumentasi
- Dan file-file lainnya

Jika **package.json** ada, berarti Anda sudah di folder yang benar! ✅

---

## 🔧 LANGKAH 1: Install Dependencies

Ini akan download semua library yang dibutuhkan (React, Next.js, Three.js, dll).

```bash
npm install
```

### **Proses ini akan:**
- 📥 Download 450+ packages
- 💾 Ukuran total: ~250 MB
- ⏱️ Waktu: 1-3 menit (tergantung internet)

### **Output yang akan muncul:**
```
npm WARN deprecated ...
npm WARN deprecated ...

added 450 packages, and audited 451 packages in 2m

125 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### **Jika ada ERROR:**

#### Error: `EACCES` atau `permission denied`
**Windows**: Jalankan PowerShell sebagai Administrator
**macOS/Linux**: 
```bash
sudo npm install
```

#### Error: `network timeout`
Internet lemot, coba lagi:
```bash
npm install --timeout=60000
```

#### Error: `npm not found`
Node.js belum terinstall dengan benar, install ulang Node.js.

---

## 🗄️ LANGKAH 2: Setup Database

Ini akan membuat database SQLite dan mengisi data demo.

```bash
npm run seed
```

### **Output yang seharusnya muncul:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

🌱 Seeding database...
✅ Created demo user: demo@cerberus.dev
✅ Created 8 sample events

🎉 Seeding completed!

Demo credentials:
  Email: demo@cerberus.dev
  Password: demo123
```

### **Cek file database sudah terbuat:**
```bash
# Windows (PowerShell)
Test-Path prisma\dev.db

# macOS/Linux
ls prisma/dev.db
```

Jika output `True` atau file ada, database berhasil dibuat! ✅

---

## ✅ LANGKAH 3: Verifikasi Setup (Optional)

Cek apakah semua sudah siap:

```bash
node verify-setup.js
```

### **Output yang seharusnya:**
```
🛡️  Cerberus Setup Verification

✅ Node.js version
✅ Dependencies installed
✅ Environment file
✅ Database initialized
✅ Prisma client
✅ File: package.json
✅ File: tsconfig.json
✅ File: next.config.js
✅ File: prisma/schema.prisma
✅ File: src/app/layout.tsx
✅ File: src/app/page.tsx
✅ File: src/styles/design-tokens.ts

==================================================
✅ Passed: 15
==================================================

🎉 Setup looks good! Run: npm run dev

Demo Login:
  Email: demo@cerberus.dev
  Password: demo123
```

---

## 🚀 LANGKAH 4: Start Development Server

Jalankan aplikasi:

```bash
npm run dev
```

### **Output yang seharusnya:**
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.5s
 ○ Compiling / ...
 ✓ Compiled / in 3.2s
```

**Jangan tutup terminal ini!** Server sedang berjalan.

### **Jika ada error port 3000 sudah dipakai:**
```bash
# Gunakan port lain
PORT=3001 npm run dev

# Atau matikan aplikasi yang pakai port 3000
```

---

## 🌐 LANGKAH 5: Buka Browser

1. Buka browser (Chrome/Firefox/Edge)
2. Di address bar, ketik:
   ```
   http://localhost:3000
   ```
3. Tekan Enter

### **Anda seharusnya melihat:**
- 🎭 Landing page dengan 3D hero yang beranimasi
- 🛡️ Logo "CERBERUS" di kiri atas
- 🌟 Background gelap dengan efek neon
- 🔵 Tombol biru "Get Started"

Jika halaman muncul, **INSTALASI BERHASIL!** 🎉

---

## 🔐 LANGKAH 6: Login ke Dashboard

1. Klik tombol **"Sign In"** (kanan atas) atau **"Get Started"**

2. Anda akan melihat form login

3. Masukkan kredensial demo:
   ```
   Email: demo@cerberus.dev
   Password: demo123
   ```

4. Klik tombol **"Sign In"**

5. Anda akan masuk ke **Dashboard** dengan:
   - 📊 Statistics cards (Total Events, Critical, Warnings)
   - 🔔 Event tiles dengan warna berbeda
   - 📈 Sidebar menu di kiri
   - 🎨 Dark theme dengan glass effect

---

## 🎉 SELESAI! Aplikasi Sudah Berjalan!

### **Yang bisa Anda coba:**
- ✅ Gerakkan mouse di landing page → 3D guardian mengikuti
- ✅ Hover tombol → Animasi lift
- ✅ Klik event tiles → Animasi
- ✅ Resize window → Responsive design
- ✅ Test keyboard navigation (Tab key)
- ✅ Klik sidebar menu
- ✅ Klik "Refresh" button di dashboard

---

## 🔧 Commands Penting untuk Diingat

```bash
# Start development server
npm run dev

# Stop server (di terminal yang running)
Ctrl + C

# Restart server
npm run dev

# Reset database (jika mau mulai dari awal)
rm prisma/dev.db       # macOS/Linux
del prisma\dev.db      # Windows
npm run seed

# Buka database GUI
npx prisma studio

# Build untuk production
npm run build

# Run production
npm run start

# Run tests
npm run test
```

---

## 🚨 TROUBLESHOOTING

### **1. Terminal error: command not found**
```bash
# Pastikan Node.js terinstall
node --version

# Jika error, install ulang Node.js dari nodejs.org
```

### **2. npm install gagal**
```bash
# Clear cache
npm cache clean --force

# Delete dan install ulang
rm -rf node_modules package-lock.json  # macOS/Linux
# atau
rmdir /s node_modules & del package-lock.json  # Windows

npm install
```

### **3. Port 3000 sudah dipakai**
```bash
# Windows: Cari aplikasi yang pakai port 3000
netstat -ano | findstr :3000
# Matikan aplikasi tersebut

# Atau gunakan port lain
PORT=3001 npm run dev
```

### **4. Database error**
```bash
# Reset database
rm prisma/dev.db       # macOS/Linux
del prisma\dev.db      # Windows

# Seed ulang
npm run seed
```

### **5. Browser menunjukkan halaman error**
- Check terminal untuk error message
- Pastikan `npm run dev` masih berjalan
- Refresh browser (Ctrl+R atau Cmd+R)
- Clear browser cache

### **6. 3D scene tidak muncul**
- Pastikan browser support WebGL (Chrome, Firefox, Edge)
- Update browser ke versi terbaru
- Disable extensions/ad-blocker
- Check browser console (F12) untuk error

### **7. Module not found error**
```bash
# Reinstall dependencies
npm install

# Jika masih error, clear cache dulu
npm cache clean --force
rm -rf node_modules
npm install
```

---

## 📊 Struktur Folder Setelah Install

```
cerberus-fundamentals/
│
├── node_modules/           ← Tercipta setelah npm install
│   └── (450+ packages)     ← Semua library ada di sini
│
├── prisma/
│   ├── dev.db             ← Database SQLite
│   ├── dev.db-journal     ← SQLite journal
│   ├── schema.prisma      ← Database schema
│   └── seed.ts            ← Seed script
│
├── src/
│   ├── app/               ← Next.js pages
│   ├── components/        ← React components
│   ├── lib/               ← Utilities
│   ├── styles/            ← Styling (Stitches)
│   └── utils/             ← Helper functions
│
├── public/                ← Static files
│   ├── manifest.json      ← PWA manifest
│   └── icon.svg           ← App icon
│
├── .env                   ← Environment variables
├── package.json           ← Project config
├── package-lock.json      ← Lock file (tercipta setelah npm install)
├── tsconfig.json          ← TypeScript config
├── next.config.js         ← Next.js config
└── README.md              ← Dokumentasi
```

---

## 🎓 Next Steps - Setelah Aplikasi Jalan

### **Untuk Belajar:**
1. Buka `README.md` → Baca dokumentasi lengkap
2. Explore folder `src/` → Lihat source code
3. Edit `src/styles/design-tokens.ts` → Ubah warna
4. Baca komentar di code → Setiap file punya penjelasan

### **Untuk Development:**
1. Edit files → Changes auto-reload (Fast Refresh)
2. Add new pages di `src/app/`
3. Add new components di `src/components/`
4. Test API di `src/app/api/`

### **Untuk Production:**
1. Update `.env` → Ganti NEXTAUTH_SECRET
2. Ganti database → SQLite → PostgreSQL
3. Build: `npm run build`
4. Deploy ke Vercel/Railway/Netlify

---

## 💡 Tips & Best Practices

### **Development:**
- ✅ Selalu jalankan `npm run dev` di satu terminal
- ✅ Buka terminal baru untuk commands lain
- ✅ Save file untuk auto-reload
- ✅ Check browser console (F12) untuk debug

### **Database:**
- ✅ Gunakan `npx prisma studio` untuk GUI
- ✅ Run `npm run seed` jika mau reset data
- ✅ Check `prisma/schema.prisma` untuk schema

### **Code Quality:**
- ✅ Run `npm run lint` sebelum commit
- ✅ Run `npm run type-check` untuk TypeScript
- ✅ Run `npm run test` untuk testing

---

## 📚 Dokumentasi Lainnya

- **COMMANDS.md** → Quick reference commands
- **INSTALASI.md** → Troubleshooting detail
- **FLOWCHART.md** → Visual installation guide
- **README.md** → Full documentation
- **PROJECT_SUMMARY.md** → Project overview

---

## 🎉 CONGRATULATIONS!

Anda berhasil menginstall Cerberus dari NOL!

**Aplikasi sudah running di:**
- Local: http://localhost:3000
- Login: demo@cerberus.dev / demo123

**Happy coding! 🛡️✨**

---

*Jika ada pertanyaan atau error, check browser console (F12) atau terminal output untuk error messages.*
