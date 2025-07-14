import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
