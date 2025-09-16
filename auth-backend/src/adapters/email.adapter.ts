import { logger } from '../utils/logger';

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailAdapter {
  sendEmail(message: EmailMessage): Promise<void>;
}

export abstract class BaseMailAdapter implements MailAdapter {
  abstract sendEmail(message: EmailMessage): Promise<void>;

  protected logEmailSent(to: string, subject: string): void {
    logger.info('Email sent successfully', {
      to: this.maskEmail(to),
      subject,
      adapter: this.constructor.name,
    });
  }

  protected logEmailError(to: string, subject: string, error: Error): void {
    logger.error('Email sending failed', {
      to: this.maskEmail(to),
      subject,
      error: error.message,
      adapter: this.constructor.name,
    });
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}