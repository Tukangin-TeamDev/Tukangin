import { Request, Response } from 'express';
// import { z } from 'zod'; // Tidak digunakan
import * as userService from '../../services/user.service';
import { createUserSchema, updateUserSchema } from '../../utils/validators';
import { ApiResponse } from '../../types/common.types';
// import { PaginationMeta } tidak digunakan
import { UserResponseDto, UserFilterDto, UserRole } from '../../types/user.types';
import { createAdminAuditLog } from '../../middleware/audit.middleware';
import * as bcrypt from 'bcrypt';

/**
 * Mendapatkan daftar semua user dengan paginasi dan filter
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const filter: UserFilterDto = {
      role: req.query.role as UserRole | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const { users, meta } = await userService.findUsers(filter);

    const response: ApiResponse<UserResponseDto[]> = {
      success: true,
      data: users,
      meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting users:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil data pengguna',
    };

    return res.status(500).json(response);
  }
};

/**
 * Mendapatkan detail user berdasarkan ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID user tidak valid',
      };
      return res.status(400).json(response);
    }

    const user = await userService.findUserById(userId);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    // Hapus field password dari response
    const { password, ...userWithoutPassword } = user;

    const response: ApiResponse<typeof userWithoutPassword> = {
      success: true,
      data: userWithoutPassword,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting user by ID:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil data pengguna',
    };

    return res.status(500).json(response);
  }
};

/**
 * Membuat user baru
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validasi input menggunakan Zod
    const validationResult = createUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Data tidak valid',
        message: validationResult.error.errors[0].message,
      };

      return res.status(400).json(response);
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await userService.findUserByEmail(validationResult.data.email);

    if (existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email sudah terdaftar',
      };

      return res.status(409).json(response);
    }

    // Buat user baru
    const newUser = await userService.createUser(validationResult.data);

    const response: ApiResponse<UserResponseDto> = {
      success: true,
      data: newUser,
      message: 'User berhasil dibuat',
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error creating user:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat membuat user',
    };

    return res.status(500).json(response);
  }
};

/**
 * Memperbarui data user
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID user tidak valid',
      };
      return res.status(400).json(response);
    }

    // Validasi bahwa user dengan ID tersebut ada
    const existingUser = await userService.findUserById(userId);

    if (!existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    // Validasi data input menggunakan Zod
    const validationResult = updateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validasi gagal',
        message: validationResult.error.errors[0].message,
      };
      return res.status(400).json(response);
    }

    // Jika password diubah, maka harus di-hash dulu
    let updateData = validationResult.data;

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await userService.updateUser(userId, updateData);

    // Tambahkan log audit
    if (req.user) {
      await createAdminAuditLog('USER_UPDATED', { userId }, req.user.id);
    }

    const response: ApiResponse<UserResponseDto> = {
      success: true,
      data: updatedUser,
      message: 'User berhasil diperbarui',
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error updating user:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memperbarui user',
    };

    return res.status(500).json(response);
  }
};

/**
 * Menghapus user
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID user tidak valid',
      };
      return res.status(400).json(response);
    }

    // Validasi bahwa user dengan ID tersebut ada
    const existingUser = await userService.findUserById(userId);

    if (!existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    // Hapus user
    await userService.deleteUser(userId);

    // Tambahkan log audit
    if (req.user) {
      await createAdminAuditLog('USER_DELETED', { userId }, req.user.id);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'User berhasil dihapus',
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting user:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat menghapus user',
    };

    return res.status(500).json(response);
  }
};
