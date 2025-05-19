import { Module } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesController } from './user-profiles.controller';
import { usersProfilesProviders } from './user-profiles.providers';

@Module({
  imports: [],
  controllers: [UserProfilesController],
  providers: [UserProfilesService, ...usersProfilesProviders],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
