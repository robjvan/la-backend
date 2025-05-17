import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { plantsProviders } from './plants.providers';
import { FirebaseStorageModule } from '../firebase-storage/firebase-storage.module';

@Module({
  imports: [FirebaseStorageModule],
  controllers: [PlantsController],
  providers: [PlantsService, ...plantsProviders],
  exports: [PlantsService],
})
export class PlantsModule {}
