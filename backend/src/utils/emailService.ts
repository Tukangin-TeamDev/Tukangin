import nodemailer from 'nodemailer';
import { AppError } from '../middleware/errorHandler';
import logger from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Konfigurasi transporter berdasarkan environment
const createTransporter = () => {
  // Untuk development, gunakan ethereal email (fake SMTP service)
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    // Buat test account di ethereal
    return nodemailer.createTestAccount().then(account => {
      logger.info(`Created Ethereal test account: ${account.user}, ${account.pass}`);

      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  // Untuk production atau testing dengan SMTP yang dikonfigurasi
  return Promise.resolve(
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465', // true untuk port 465, false untuk port lain
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  );
};

// Fungsi untuk mengirim email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Tukangin App" <no-reply@tukangin.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      logger.info(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new AppError('Gagal mengirim email', 500);
  }
};

// Template untuk email OTP verifikasi
export const sendOtpEmail = async (
  email: string,
  otp: string,
  expiresInMinutes: number,
  type: string
): Promise<void> => {
  let subject = '';
  let text = '';
  let html = '';

  if (type === 'VERIFY_EMAIL') {
    subject = 'Verifikasi Email Akun Tukangin';
    text = `Kode OTP untuk verifikasi email Anda adalah: ${otp}. Kode ini berlaku selama ${expiresInMinutes} menit.`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
          <h1>Tukangin</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <h2>Verifikasi Email</h2>
          <p>Terima kasih telah mendaftar di Tukangin. Untuk menyelesaikan pendaftaran akun Anda, masukkan kode OTP berikut di aplikasi:</p>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Kode OTP ini berlaku selama <strong>${expiresInMinutes} menit</strong>.</p>
          <p>Jika Anda tidak melakukan pendaftaran di Tukangin, abaikan email ini.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} Tukangin. All rights reserved.</p>
        </div>
      </div>
    `;
  } else if (type === '2FA') {
    subject = 'Kode OTP untuk Login Tukangin';
    text = `Kode OTP untuk login Anda adalah: ${otp}. Kode ini berlaku selama ${expiresInMinutes} menit.`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
          <h1>Tukangin</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <h2>Kode OTP untuk Login</h2>
          <p>Anda baru saja mencoba login ke akun Tukangin. Masukkan kode OTP berikut untuk menyelesaikan proses login:</p>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Kode OTP ini berlaku selama <strong>${expiresInMinutes} menit</strong>.</p>
          <p>Jika Anda tidak melakukan login di Tukangin, segera ubah password akun Anda.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} Tukangin. All rights reserved.</p>
        </div>
      </div>
    `;
  } else if (type === 'PASSWORD_RESET') {
    subject = 'Reset Password Akun Tukangin';
    text = `Kode OTP untuk reset password Anda adalah: ${otp}. Kode ini berlaku selama ${expiresInMinutes} menit.`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
          <h1>Tukangin</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <h2>Reset Password</h2>
          <p>Anda baru saja meminta reset password untuk akun Tukangin. Masukkan kode OTP berikut di aplikasi untuk melanjutkan proses reset password:</p>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Kode OTP ini berlaku selama <strong>${expiresInMinutes} menit</strong>.</p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} Tukangin. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};
