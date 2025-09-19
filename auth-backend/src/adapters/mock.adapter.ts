import { BaseMailAdapter, EmailMessage } from './email.adapter';
import { logger } from '../utils/logger';

export interface MockEmailRecord {
  to: string;
  subject: string;
  html: string;
  text?: string;
  sentAt: Date;
}

export class MockAdapter extends BaseMailAdapter {
  private static sentEmails: MockEmailRecord[] = [];

  async sendEmail(message: EmailMessage): Promise<void> {
    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const record: MockEmailRecord = {
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      sentAt: new Date(),
    };

    MockAdapter.sentEmails.push(record);
    this.logEmailSent(message.to, message.subject);

    // Log the email content for debugging
    logger.debug('Mock email sent:', {
      to: message.to,
      subject: message.subject,
      html: message.html,
    });
  }

  static getSentEmails(): MockEmailRecord[] {
    return [...MockAdapter.sentEmails];
  }

  static getLastEmail(): MockEmailRecord | undefined {
    return MockAdapter.sentEmails[MockAdapter.sentEmails.length - 1];
  }

  static getEmailsFor(email: string): MockEmailRecord[] {
    return MockAdapter.sentEmails.filter(record => record.to === email);
  }

  static clear(): void {
    MockAdapter.sentEmails = [];
  }

  static getEmailCount(): number {
    return MockAdapter.sentEmails.length;
  }
}