import nodemailer, { TransportOptions } from 'nodemailer';
import logger from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Mengirim email menggunakan nodemailer
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Konfigurasi transporter berdasarkan environment
    let transporter;
    
    // Di development tanpa SMTP, gunakan ethereal untuk testing
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      // Generate test account dari ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`Development mode: Email akan dikirim ke Ethereal inbox`);
    } else {
      // Konfigurasi SMTP dari environment variables
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465', // true untuk port 465, false untuk port lain
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      } as TransportOptions);
    }

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Tukangin App" <no-reply@tukangin.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    // Kirim email
    const info = await transporter.sendMail(mailOptions);

    // Log preview URL di development
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      logger.debug(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    logger.info(`Email terkirim: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
}; 