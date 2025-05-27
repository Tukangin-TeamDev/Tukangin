import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verifikasi Email Tukangin',
      html: `
        <h1>Verifikasi Email Anda</h1>
        <p>Klik link berikut untuk memverifikasi email Anda:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Password Tukangin',
      html: `
        <h1>Reset Password</h1>
        <p>Klik link berikut untuk mereset password Anda:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link ini akan kadaluarsa dalam 1 jam.</p>
      `
    });
  }
} 