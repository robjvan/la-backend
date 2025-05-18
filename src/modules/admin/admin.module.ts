import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { adminProviders } from './admin.providers';
import { UsersModule } from '../users/users.module';
import { PlantsModule } from '../plants/plants.module';
import { MetricsService } from './metrics.service';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, PlantsModule, UserProfilesModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService, MetricsService, ...adminProviders],
})
export class AdminModule {}
