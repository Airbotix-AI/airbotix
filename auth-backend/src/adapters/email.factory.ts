import { MailAdapter } from './email.adapter';
import { SendGridAdapter } from './sendgrid.adapter';
import { SmtpAdapter } from './smtp.adapter';
import { MockAdapter } from './mock.adapter';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class EmailAdapterFactory {
  static create(): MailAdapter {
    const provider = config.email.provider;

    logger.info(`Initializing email adapter: ${provider}`);

    switch (provider) {
      case 'sendgrid':
        return new SendGridAdapter();

      case 'smtp':
        return new SmtpAdapter();

      case 'mock':
        return new MockAdapter();

      default:
        logger.warn(`Unknown email provider: ${provider}, falling back to mock`);
        return new MockAdapter();
    }
  }
}

// Singleton instance
export const emailAdapter = EmailAdapterFactory.create();