import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { plantsProviders } from './plants.providers';

@Module({
  imports: [],
  controllers: [PlantsController],
  providers: [PlantsService, ...plantsProviders],
  exports: [PlantsService],
})
export class PlantsModule {}
