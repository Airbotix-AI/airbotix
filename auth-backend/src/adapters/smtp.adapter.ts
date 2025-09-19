import nodemailer from 'nodemailer';
import { BaseMailAdapter, EmailMessage } from './email.adapter';
import { AppError, ErrorCode } from '../types/errors';
import { config } from '../config/env';

export class SmtpAdapter extends BaseMailAdapter {
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    if (!config.email.smtp.host || !config.email.smtp.user || !config.email.smtp.pass) {
      throw new Error('SMTP configuration is incomplete');
    }

    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const mailOptions = {
        from: config.email.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      };

      await this.transporter.sendMail(mailOptions);
      this.logEmailSent(message.to, message.subject);
    } catch (error) {
      this.logEmailError(message.to, message.subject, error as Error);
      throw AppError.internal(
        ErrorCode.EMAIL_SEND_FAILED,
        'Failed to send email via SMTP',
        error
      );
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }
}