import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Extension method untuk common operations
// prisma.$extends({
//   model: {
//     user: {
//       async findByEmail(email: string) {
//         return prisma.user.findUnique({ where: { email } });
//       },
//     },
//   },
// });

// Connect to the database
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    return prisma;
  } catch (error) {
    console.error('Could not connect to database: ', error);
    process.exit(1);
  }
};

// Singleton untuk menggunakan instance yang sama di seluruh aplikasi
export default prisma;
