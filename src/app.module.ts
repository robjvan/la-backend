import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { PlantsModule } from './modules/plants/plants.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MailModule } from './modules/mail/mail.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    DatabaseModule,
    LocationsModule,
    MailModule,
    PaymentsModule,
    PlantsModule,
    SubscriptionsModule,
    UsersModule,
    UserProfilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
