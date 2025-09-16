import sgMail from '@sendgrid/mail';
import { BaseMailAdapter, EmailMessage } from './email.adapter';
import { AppError, ErrorCode } from '../types/errors';
import { config } from '../config/env';

export class SendGridAdapter extends BaseMailAdapter {
  constructor() {
    super();
    if (!config.email.apiKey) {
      throw new Error('SendGrid API key is required');
    }
    sgMail.setApiKey(config.email.apiKey);
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const msg = {
        to: message.to,
        from: config.email.from,
        subject: message.subject,
        html: message.html,
        text: message.text,
      };

      await sgMail.send(msg);
      this.logEmailSent(message.to, message.subject);
    } catch (error) {
      this.logEmailError(message.to, message.subject, error as Error);
      throw AppError.internal(
        ErrorCode.EMAIL_SEND_FAILED,
        'Failed to send email via SendGrid',
        error
      );
    }
  }
}