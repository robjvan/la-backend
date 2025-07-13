import { Module } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesController } from './user-profiles.controller';
import { usersProfilesProviders } from './user-profiles.providers';
import { UsersModule } from '../users/users.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [UsersModule, LoggingModule],
  controllers: [UserProfilesController],
  providers: [UserProfilesService, ...usersProfilesProviders],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
