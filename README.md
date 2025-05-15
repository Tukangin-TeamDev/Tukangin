# TUKANGIN

Platform marketplace layanan onsite yang menghubungkan pelanggan dengan penyedia jasa.

## Struktur Proyek

Proyek ini menggunakan monorepo dengan struktur sebagai berikut:

- `/frontend` - Aplikasi Next.js dengan App Router
- `/backend` - Aplikasi Express.js yang menyediakan API RESTful

## Instalasi

```bash
# Install dependensi di root
npm install

# Install dependensi frontend
cd frontend
npm install

# Install dependensi backend
cd backend
npm install
```

## Pengembangan

```bash
# Menjalankan frontend (dari root)
npm run fe:dev
# atau dari direktori frontend
cd frontend
npm run dev

# Menjalankan backend (dari root)
npm run be:dev
# atau dari direktori backend
cd backend
npm run dev
```

## Build dan Production

```bash
# Build frontend
npm run fe:build

# Build backend
npm run be:build

# Menjalankan frontend di production
npm run fe:start

# Menjalankan backend di production
npm run be:start
```
