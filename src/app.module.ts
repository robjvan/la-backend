import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { PlantsModule } from './modules/plants/plants.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MailModule } from './modules/mail/mail.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module';
import { AppwriteModule } from './modules/appwrite/appwrite.module';
import { LoggingModule } from './modules/logging/logging.module';

@Module({
  imports: [
    AdminModule,
    AppwriteModule,
    AuthModule,
    DatabaseModule,
    LocationsModule,
    LoggingModule,
    MailModule,
    PlantsModule,
    SubscriptionsModule,
    UsersModule,
    UserProfilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
