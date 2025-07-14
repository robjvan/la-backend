import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Module({
  // Register database providers to be used within the module
  providers: [...databaseProviders],
  // Export database providers to be accessible by other modules
  exports: [...databaseProviders],
})
export class DatabaseModule {}
