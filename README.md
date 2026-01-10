# Shopping Note (Modern CRUD) — React + Vite + Tailwind + Express + Prisma (SQLite)

Aplikasi **Shopping Note** modern dengan fitur CRUD lengkap, UI modern (light/dark), search & filter, dan penyimpanan data pakai **SQLite**.

## Fitur
- CRUD item belanja: tambah, edit, hapus
- Tandai item **dibeli / belum**
- Search, filter kategori, filter status
- UI modern + Dark Mode
- Backend REST API (Express)
- Database SQLite via Prisma ORM

---

## Prasyarat
- Node.js **18+** (disarankan 20+)

---

## Cara Menjalankan (Paling Cepat)
Buka folder ini di **VS Code**, lalu jalankan:

### 1) Install dependency (root)
```bash
npm install
```

### 2) Siapkan database + seed
```bash
npm run db:push
npm run db:seed
```

### 3) Jalankan mode development (client + server)
```bash
npm run dev
```

Akses aplikasi:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

---

## Catatan
- File database SQLite otomatis dibuat di: `server/prisma/dev.db`
- Jika ingin reset data:
  - hapus `server/prisma/dev.db`
  - lalu jalankan `npm run db:push` dan `npm run db:seed`
