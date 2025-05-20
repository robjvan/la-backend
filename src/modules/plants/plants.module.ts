import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { plantsProviders } from './plants.providers';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PlantsController],
  providers: [PlantsService, ...plantsProviders],
  exports: [PlantsService],
})
export class PlantsModule {}
