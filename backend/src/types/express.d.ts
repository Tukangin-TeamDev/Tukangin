import { UserResponseDto, UserRole } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRole | string;
        name?: string;
      };
    }
  }
}

export {}; 