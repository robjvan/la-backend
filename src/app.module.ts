import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PlantsModule } from './modules/plants/plants.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { MailModule } from './modules/mail/mail.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [UsersModule, PlantsModule, AuthModule, PaymentsModule, SubscriptionsModule, MailModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
