import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { loggingProviders } from './logging.providers';

@Module({
  providers: [LoggingService, ...loggingProviders],
  exports: [LoggingService],
})
export class LoggingModule {}
