import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { plantsProviders } from './plants.providers';
import { UsersModule } from '../users/users.module';
import { LoggingModule } from '../logging/logging.module';
import { AppwriteModule } from '../appwrite/appwrite.module';

@Module({
  imports: [UsersModule, LoggingModule, AppwriteModule],
  controllers: [PlantsController],
  providers: [PlantsService, ...plantsProviders],
  exports: [PlantsService],
})
export class PlantsModule {}
