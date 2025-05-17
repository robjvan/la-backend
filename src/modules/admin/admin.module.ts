import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { adminProviders } from './admin.providers';
import { UsersModule } from '../users/users.module';
import { PlantsModule } from '../plants/plants.module';
import { MetricsService } from './metrics.service';

@Module({
  imports: [UsersModule, PlantsModule],
  controllers: [AdminController],
  providers: [AdminService, MetricsService, ...adminProviders],
})
export class AdminModule {}
