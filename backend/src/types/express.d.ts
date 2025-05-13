import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    // Interface User untuk tipe user dalam request Express
    interface User {
      id: number;
      email: string;
      role: UserRole;
      name?: string;
    }
  }
}

export {}; 