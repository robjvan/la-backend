import { Module } from '@nestjs/common';
import { AppwriteService } from './appwrite.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [AppwriteService],
  exports: [AppwriteService],
})
export class AppwriteModule {}
