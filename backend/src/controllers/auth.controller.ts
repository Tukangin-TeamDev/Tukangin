import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { authConfig } from '../config/auth.config';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { AuthRequest, LoginResponse } from '../types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, role } = req.body;
      const result = await authService.register(email, password, fullName, role);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (result.requiresTwoFactor) {
        return res.json({ requiresTwoFactor: true, userId: result.userId });
      }

      if (!result.accessToken || !result.refreshToken) {
        throw new Error('Invalid token data');
      }

      this.setTokenCookies(res, result.accessToken, result.refreshToken);
      res.json({ message: 'Login successful' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.params;
      await authService.verifyEmail(token);
      res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.json({ message: 'If email exists, reset instructions have been sent' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await authService.resetPassword(token, password);
      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async setup2FA(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const secret = await authService.setup2FA(userId);
      res.json({ secret });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async verify2FA(req: Request, res: Response) {
    try {
      const { userId, token } = req.body;
      const result = await authService.verify2FA(userId, token);
      
      if (!result.accessToken || !result.refreshToken) {
        throw new Error('Invalid token data');
      }
      
      this.setTokenCookies(res, result.accessToken, result.refreshToken);
      res.json({ message: '2FA verification successful' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async handleGoogleCallback(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found'));
      }

      const result = await authService.googleLogin(profile.id);
      done(null, result);
    } catch (error) {
      done(error);
    }
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const result = req.user as { accessToken: string; refreshToken: string };
      
      this.setTokenCookies(res, result.accessToken, result.refreshToken);
      res.redirect(process.env.FRONTEND_URL + '/login/success');
    } catch (error: any) {
      res.redirect(process.env.FRONTEND_URL + '/login/error');
    }
  }

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: authConfig.jwtExpiration * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: authConfig.jwtRefreshExpiration * 1000
    });
  }
} 