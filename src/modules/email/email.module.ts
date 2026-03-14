import { Module } from '@nestjs/common';

import { ConfigModule } from '@config';

import { EmailSenderService } from './email-sender.service';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailTemplateService, EmailSenderService],
  exports: [EmailTemplateService, EmailSenderService],
})
export class EmailModule {}
