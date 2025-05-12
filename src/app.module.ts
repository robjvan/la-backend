import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PlantsModule } from './modules/plants/plants.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MailModule } from './modules/mail/mail.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AuthModule,
    PlantsModule,
    LocationsModule,
    MailModule,
    PaymentsModule,
    SubscriptionsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
