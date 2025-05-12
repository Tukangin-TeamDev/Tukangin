import { PrismaClient, Prisma } from '@prisma/client';
import { CreateUserDto, UserFilterDto, UserResponseDto } from "../types/user.types";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Mencari user berdasarkan email
 */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Membuat user baru
 */
export const createUser = async (data: CreateUserDto): Promise<UserResponseDto> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // Cast authProvider ke enum untuk kompatibilitas dengan Prisma
  const userData = {
    ...data,
    password: hashedPassword,
    authProvider: data.authProvider as any // Menggunakan as any untuk menghindari type error
  };

  const user = await prisma.user.create({
    data: userData
  });
  
  // Mengembalikan data menggunakan fungsi helper
  return mapUserToResponseDto(user);
};

/**
 * Mencari user berdasarkan ID
 */
export const findUserById = async (id: number): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      providerProfile: id !== undefined && id !== null,
    },
  });
  
  if (!user) {
    return null;
  }
  
  return user;
};

/**
 * Fungsi untuk memastikan tipe UserResponseDto sesuai dengan data dari prisma
 */
export const mapUserToResponseDto = (user: any): UserResponseDto => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone || undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

/**
 * Mencari daftar user dengan filter
 */
export const findUsers = async (filter: UserFilterDto): Promise<{ 
  users: UserResponseDto[]; 
  meta: { page: number; limit: number; totalItems: number; totalPages: number; }; 
}> => {
  const { role, search, page = 1, limit = 10 } = filter;
  
  const skip = (page - 1) * limit;
  
  // Buat kondisi where berdasarkan filter
  const where: Prisma.UserWhereInput = {};
  
  if (role) {
    where.role = role;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  // Query users dengan paginasi
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);
  
  return {
    users: users.map(user => mapUserToResponseDto(user)),
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }
  };
};

/**
 * Memperbarui data user
 */
export const updateUser = async (
  id: number, 
  data: Partial<Omit<CreateUserDto, 'role'>>
): Promise<UserResponseDto> => {
  // Cast authProvider jika ada ke enum untuk kompatibilitas dengan Prisma
  const userData = {
    ...data,
    authProvider: data.authProvider as any // Menggunakan as any untuk menghindari type error
  };

  const user = await prisma.user.update({
    where: { id },
    data: userData,
  });
  
  // Mengembalikan data menggunakan fungsi helper
  return mapUserToResponseDto(user);
};

/**
 * Menghapus user berdasarkan ID
 */
export const deleteUser = async (id: number): Promise<UserResponseDto> => {
  // Cek apakah user memiliki providerProfile
  const user = await prisma.user.findUnique({
    where: { id },
    include: { providerProfile: true }
  });
  
  if (!user) {
    throw new Error('User tidak ditemukan');
  }
  
  // Jika user adalah provider, hapus provider profile terlebih dahulu
  if (user.providerProfile) {
    await prisma.providerProfile.delete({
      where: { userId: id }
    });
  }
  
  // Hapus user
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  
  // Mengembalikan data menggunakan fungsi helper
  return mapUserToResponseDto(deletedUser);
};
