import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { adminProviders } from './admin.providers';
import { MetricsService } from './metrics.service';
import { UserMetricsService } from './user-metrics.service';
import { PlantMetricsService } from './plant-metrics.service';
import { GeographicalMetricsService } from './geographics-metrics.service';
import { UsersModule } from '../users/users.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [UsersModule, LoggingModule],
  controllers: [AdminController],
  providers: [
    ...adminProviders,
    AdminService,
    MetricsService,
    UserMetricsService,
    PlantMetricsService,
    GeographicalMetricsService,
  ],
})
export class AdminModule {}
