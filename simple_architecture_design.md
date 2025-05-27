# Platform tukangin - Arsitektur Sederhana untuk Tugas Kuliah

## 1. GAMBARAN BESAR SISTEM

Bayangkan platform ini seperti sebuah pasar tradisional digital. Di satu sisi ada customer yang butuh tukang, di sisi lain ada tukang yang siap bekerja. Platform kita berperan sebagai "penghubung" yang mempertemukan mereka dengan aman dan mudah.

### Komponen Utama Sistem

```
┌─────────────────────────────────────────┐
│            USER (Browser)               │
│         Next.js Frontend                │
└─────────────┬───────────────────────────┘
              │ API Calls (HTTP/HTTPS)
┌─────────────┴───────────────────────────┐
│          EXPRESS.JS API                 │
│        (Backend Server)                 │
└─────────────┬───────────────────────────┘
              │ Database Queries
┌─────────────┴───────────────────────────┐
│       SUPABASE POSTGRESQL               │
│        (Database + Auth)                │
└─────────────────────────────────────────┘
```

Arsitektur ini menggunakan pola client-server yang sederhana namun powerful. Frontend Next.js berkomunikasi dengan Backend Express melalui REST API, dan backend menyimpan semua data di PostgreSQL melalui Supabase.

## 2. TECH STACK LENGKAP DAN ALASANNYA

### Frontend: Next.js dengan TypeScript

Next.js dipilih karena memberikan keunggulan SSR (Server-Side Rendering) yang membuat website kita loading lebih cepat dan SEO-friendly. TypeScript memastikan code kita lebih aman dengan type checking yang mencegah bug umum. TailwindCSS v4 memberikan styling yang konsisten dan mudah di-maintain.

### Backend: Express.js dengan TypeScript

Express.js adalah framework Node.js yang paling populer dan mudah dipelajari. Dengan TypeScript, kita mendapat keuntungan type safety yang sama seperti di frontend, membuat development lebih smooth dan error-free.

### Database: PostgreSQL dengan Supabase + Prisma

Supabase memberikan managed PostgreSQL dengan fitur authentication dan real-time features built-in. Prisma ORM memberikan type-safe database access yang sangat membantu dalam development. Kombinasi ini sangat powerful namun tetap mudah digunakan.

### DevOps: Docker + GitLab CI/CD

Docker memastikan aplikasi kita berjalan konsisten di environment manapun. GitLab CI/CD mengotomatisasi testing dan deployment, membuat project terlihat lebih profesional.

## 3. STRUKTUR PROJECT YANG RAPI

```
tukangin-platform/
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # App Router (Next.js 13+)
│   │   │   ├── (auth)/        # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/     # User dashboards
│   │   │   ├── jobs/          # Job-related pages
│   │   │   └── profile/       # Profile management
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Basic UI components
│   │   │   ├── forms/         # Form components
│   │   │   └── layout/        # Layout components
│   │   ├── lib/               # Utilities dan configurations
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── tailwind.config.js     # TailwindCSS configuration
│   ├── next.config.js         # Next.js configuration
│   └── package.json
│
├── backend/                   # Express.js API Server
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   ├── users.ts       # User management
│   │   │   ├── jobs.ts        # Job management
│   │   │   └── payments.ts    # Payment processing
│   │   ├── controllers/       # Business logic handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # External service integrations
│   │   ├── utils/             # Helper functions
│   │   └── types/             # TypeScript types
│   ├── prisma/                # Database schema dan migrations
│   │   ├── schema.prisma      # Database schema definition
│   │   └── migrations/        # Database migration files
│   ├── tests/                 # Unit dan integration tests
│   └── package.json
│
├── docker/                    # Docker configurations
│   ├── Dockerfile.frontend    # Frontend container setup
│   ├── Dockerfile.backend     # Backend container setup
│   └── docker-compose.yml     # Development environment
│
├── .gitlab-ci.yml            # GitLab CI/CD configuration
├── README.md                 # Project documentation
└── package.json              # Root package configuration
```

### Mengapa Struktur Ini?

Struktur ini memisahkan frontend dan backend dengan jelas, memudahkan development dan maintenance. Setiap folder memiliki purpose yang spesifik, membuat code lebih organized dan mudah ditemukan.

## 4. DATABASE SCHEMA SEDERHANA TAPI LENGKAP

### Schema Prisma untuk Core Entities

```prisma
// prisma/schema.prisma

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  phone         String   @unique
  name          String
  userType      UserType
  avatar        String?
  address       String?
  city          String?
  latitude      Float?
  longitude     Float?
  isVerified    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  customerJobs  Job[]    @relation("CustomerJobs")
  tukangJobs    Job[]    @relation("TukangJobs")
  tukangProfile TukangProfile?
  reviews       Review[]

  @@map("users")
}

model TukangProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  bio             String?
  experience      Int      @default(0)
  skills          String[] // Array of skills
  priceRange      String?  // "100000-500000"
  workingRadius   Int      @default(10) // in kilometers
  isAvailable     Boolean  @default(true)
  rating          Float    @default(0)
  totalJobs       Int      @default(0)
  verificationDoc String?

  // Relations
  user            User     @relation(fields: [userId], references: [id])

  @@map("tukang_profiles")
}

model Job {
  id          String    @id @default(cuid())
  title       String
  description String
  category    JobCategory
  address     String
  city        String
  latitude    Float?
  longitude   Float?
  budget      Int
  urgency     Urgency   @default(NORMAL)
  status      JobStatus @default(OPEN)
  scheduledAt DateTime?

  // Relations
  customerId  String
  customer    User      @relation("CustomerJobs", fields: [customerId], references: [id])
  tukangId    String?
  tukang      User?     @relation("TukangJobs", fields: [tukangId], references: [id])

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?

  // Additional relations
  reviews     Review[]
  payments    Payment[]

  @@map("jobs")
}

model Payment {
  id              String        @id @default(cuid())
  jobId           String
  amount          Int
  platformFee     Int
  tukangAmount    Int
  status          PaymentStatus @default(PENDING)
  paymentMethod   String?
  transactionId   String?       @unique

  // Relations
  job             Job           @relation(fields: [jobId], references: [id])

  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("payments")
}

model Review {
  id        String   @id @default(cuid())
  jobId     String
  reviewerId String
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())

  // Relations
  job       Job      @relation(fields: [jobId], references: [id])
  reviewer  User     @relation(fields: [reviewerId], references: [id])

  @@map("reviews")
}

// Enums
enum UserType {
  CUSTOMER
  TUKANG
}

enum JobCategory {
  AC_SERVICE
  PLUMBING
  ELECTRICAL
  CLEANING
  CONSTRUCTION
  APPLIANCE_REPAIR
}

enum JobStatus {
  OPEN
  MATCHED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Urgency {
  NORMAL
  URGENT
  EMERGENCY
}

enum PaymentStatus {
  PENDING
  PAID
  COMPLETED
  FAILED
  REFUNDED
}
```

Schema ini dirancang sederhana namun mencakup semua aspek penting dari business logic platform tukang. Setiap table memiliki purpose yang jelas dan relationship yang logis.

## 5. API DESIGN YANG MUDAH DIPAHAMI

### RESTful API Endpoints

```typescript
// backend/src/routes/jobs.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/jobs - Mendapatkan daftar job
router.get('/', async (req, res) => {
  try {
    const { category, city, status } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        ...(category && { category: category as JobCategory }),
        ...(city && { city: city as string }),
        ...(status && { status: status as JobStatus }),
      },
      include: {
        customer: {
          select: { name: true, avatar: true, rating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
});

// POST /api/jobs - Membuat job baru
router.post('/', async (req, res) => {
  try {
    const jobData = req.body;

    const newJob = await prisma.job.create({
      data: {
        ...jobData,
        customerId: req.user.id, // dari authentication middleware
      },
      include: {
        customer: true,
      },
    });

    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create job' });
  }
});

export default router;
```

API design mengikuti RESTful conventions yang standard dan mudah dipahami. Setiap endpoint memiliki purpose yang jelas dan error handling yang proper.

## 6. FRONTEND COMPONENT STRUCTURE

### Contoh Component dengan TypeScript

```typescript
// frontend/src/components/jobs/JobCard.tsx
import React from 'react';
import Image from 'next/image';
import { Job, User } from '@/types';

interface JobCardProps {
  job: Job & {
    customer: Pick<User, 'name' | 'avatar'>;
  };
  onApply?: (jobId: string) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT': return 'text-orange-600 bg-orange-100';
      case 'EMERGENCY': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header dengan info customer */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={job.customer.avatar || '/default-avatar.png'}
          alt={job.customer.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h4 className="font-medium text-gray-900">{job.customer.name}</h4>
          <p className="text-sm text-gray-500">{job.city}</p>
        </div>
        <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
          {job.urgency}
        </div>
      </div>

      {/* Job details */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      {/* Footer dengan price dan action */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-green-600">
          {formatPrice(job.budget)}
        </div>
        {onApply && (
          <button
            onClick={() => onApply(job.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}
```

Component ini menunjukkan penggunaan TypeScript yang proper dengan interface definitions, serta styling TailwindCSS yang clean dan responsive.

## 7. DOCKER SETUP UNTUK DEVELOPMENT

### Docker Configuration

```dockerfile
# docker/Dockerfile.frontend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY frontend/ .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
```

```dockerfile
# docker/Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY backend/src ./src

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    ports:
      - '5000:5000'
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - database

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Docker setup ini memungkinkan seluruh tim development memiliki environment yang identical, mengurangi "works on my machine" problems.

## 8. GITLAB CI/CD PIPELINE

### GitLab CI Configuration

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: '/certs'

# Test stage
test:
  stage: test
  image: node:18-alpine
  before_script:
    - cd backend
    - npm ci
  script:
    - npm run test
    - npm run lint
  only:
    - merge_requests
    - main

# Build stage
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -f docker/Dockerfile.frontend -t $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA .
    - docker build -f docker/Dockerfile.backend -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
  only:
    - main

# Deploy to staging
deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging server..."
    - docker-compose -f docker-compose.staging.yml up -d
  environment:
    name: staging
    url: https://staging.tukangin.com
  only:
    - main

# Deploy to production (manual)
deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production server..."
    - docker-compose -f docker-compose.production.yml up -d
  environment:
    name: production
    url: https://tukangin.com
  when: manual
  only:
    - main
```

Pipeline ini mengotomatisasi testing, building, dan deployment process, membuat development workflow lebih professional.

## 9. WORKFLOW DEVELOPMENT LENGKAP

### Step 1: Initial Setup (Hari 1-2)

```bash
# Clone dan setup project
git clone <repository-url>
cd tukangin-platform

# Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials dan API keys

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Setup database
cd backend
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

### Step 2: Development Process (Hari 3-14)

```bash
# Start development servers
docker-compose up -d

# Atau manual untuk debugging
cd backend && npm run dev  # Port 5000
cd frontend && npm run dev # Port 3000

# Database changes workflow
cd backend
npx prisma migrate dev --name add_new_feature
npx prisma generate
```

### Step 3: Testing dan Quality Assurance (Hari 12-14)

```bash
# Backend testing
cd backend
npm run test
npm run test:coverage

# Frontend testing
cd frontend
npm run test
npm run lint
npm run type-check
```

### Step 4: Deployment Process (Hari 15)

```bash
# Commit dan push ke GitLab
git add .
git commit -m "feat: implement job matching system"
git push origin main

# GitLab CI/CD akan otomatis:
# 1. Run tests
# 2. Build Docker images
# 3. Deploy ke staging
# 4. Manual approval untuk production
```

Workflow ini dirancang untuk tim kecil dengan timeline project kuliah yang realistic, biasanya 2-4 minggu development time.

## 10. MONITORING DAN MAINTENANCE SEDERHANA

### Basic Logging Setup

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
```

### Error Handling Middleware

```typescript
// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
  });
};
```

Setup monitoring sederhana ini cukup untuk tugas kuliah namun tetap menunjukkan understanding tentang production-ready practices.

Arsitektur ini dirancang dengan prinsip "simple but complete" - cukup sederhana untuk dipahami dan diimplementasikan dalam timeframe kuliah, namun tetap menunjukkan best practices yang digunakan di industri. Setiap komponen memiliki purpose yang jelas dan saling terhubung dengan baik.
