import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { EnvService } from '@config/env.service';

import { EmailMessage } from './types/email.types';

@Injectable()
export class EmailSenderService {
  private readonly resend: Resend | null = null;
  private readonly defaultFrom: string | undefined;

  constructor(private readonly envService: EnvService) {
    const apiKey = this.envService.resendApiKey;
    this.defaultFrom = this.envService.emailFrom;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async send(
    message: EmailMessage,
  ): Promise<{ id: string | null; error: Error | null }> {
    if (!this.resend) {
      return { id: null, error: new Error('RESEND_API_KEY is not configured') };
    }

    const to = Array.isArray(message.to) ? message.to : [message.to];
    const from = message.from ?? this.defaultFrom;
    if (!from) {
      return {
        id: null,
        error: new Error(
          'Email "from" address is not configured (EMAIL_FROM or message.from)',
        ),
      };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
      });
      if (error) {
        return { id: null, error: new Error(error.message) };
      }
      return { id: data?.id ?? null, error: null };
    } catch (err) {
      return {
        id: null,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }
}
