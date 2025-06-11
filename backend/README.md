# Backend Aplikasi TukangIn

Backend untuk aplikasi marketplace jasa teknisi/tukang dengan Express.js, TypeScript, Prisma ORM, dan Supabase.

## Struktur Direktori

```
backend/
├── prisma/             # Model database dan migrasi Prisma
├── src/                # Kode sumber utama
│   ├── config/         # Konfigurasi aplikasi
│   ├── controllers/    # Handler untuk endpoint API
│   ├── middleware/     # Middleware Express
│   ├── routes/         # Definisi rute API
│   ├── services/       # Logika bisnis
│   ├── types/          # Type definitions TypeScript
│   └── utils/          # Utilitas dan helper
└── index.ts            # Entry point aplikasi
```

## Teknologi

- **Framework**: Express.js
- **Runtime**: Node.js
- **Bahasa**: TypeScript
- **ORM**: Prisma
- **Storage/Auth**: Supabase
- **Database**: PostgreSQL
- **Validasi**: zod
- **Logging**: Winston
- **Authentication**: JWT
- **Real-time**: Socket.IO

## Memulai

### Prasyarat

- Node.js v18+ dan NPM
- PostgreSQL database
- Akun Supabase

### Instalasi

1. Clone repositori dan masuk ke direktori backend

```bash
cd backend
```

2. Install dependensi

```bash
npm install
```

3. Salin file `.env.example` ke `.env` dan sesuaikan

```bash
cp .env.example .env
```

4. Generate Prisma client berdasarkan schema

```bash
npm run prisma:generate
```

5. Jalankan migrasi database

```bash
npm run prisma:migrate
```

### Menjalankan Server

- Development:

```bash
npm run dev
```

- Production:

```bash
npm run build
npm start
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout pengguna

### Users

- `GET /api/users/me` - Mendapatkan data pengguna saat ini

### Providers

- `GET /api/providers/profile` - Mendapatkan profil provider
- `GET /api/providers/services` - Mendapatkan layanan provider

## Pengembangan

### Prisma Studio (Database Explorer)

Untuk melihat dan mengedit data dengan UI:

```bash
npm run prisma:studio
```

### Logging

Aplikasi menggunakan Winston untuk logging. Di environment produksi, log akan disimpan di folder `logs/`.

### Keamanan

- Semua rute API dilindungi dengan JWT
- Autentikasi multi-level berdasarkan peran
- Password di-hash dengan bcrypt
- Validasi input dengan express-validator
